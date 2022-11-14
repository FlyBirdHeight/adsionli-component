import path from 'path';
import { wpRoot, outDir } from './utils/path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import commonjs from '@rollup/plugin-commonjs';
import { rollup, OutputOptions } from 'rollup';
import fs from 'fs/promises';
import { buildConfig } from './utils/config';
import { pathRewriter } from './utils/index';
import { parallel } from 'gulp';

/**
 * @method buildFull 打包全部组件
 */
const buildFull = async () => {
    const config = {
        input: path.resolve(wpRoot, "index.ts"),
        plugins: [nodeResolve(), typescript(), vue(), commonjs()],
        //打包时，不需要在打包vue代码了
        external: (id) => /^vue/.test(id)
    }

    //README: 这里需要主义的事项：存在两种导入组件库的形式，一种是Umd形式，也就是借助script标签进行导入，还有一种就是使用Import进行导入
    //README: 所以要分成两种形式，一种是umd形式，一种是esm形式，打包的时候就需要进行区分，打包出两种不同形式导入的包
    const buildConfig = [
        {
            format: 'umd',
            file: path.resolve(outDir, "index.js"),
            name: "adsionliPlus",
            exports: "named",
            globals: {
                // 表示使用的vue是全局的
                vue: "Vue"
            }
        },
        {
            format: "esm",
            file: path.resolve(outDir, 'index.esm.js')
        }
    ]

    let bundle = await rollup(config);
    return Promise.all(
        buildConfig.map((option) => {
            bundle.write(option as OutputOptions)
        })
    )
}
/**
 * @method buildEntry 打包adsionli-plus目录下的全部文件
 */
async function buildEntry() {
    //读取adsionli-plus下的全部文件与目录
    const everyFile = await fs.readdir(wpRoot, { withFileTypes: true })
    //过滤掉全部的文件目录以及package.json文件
    const entryPoints = everyFile.filter((f) => f.isFile()).filter(f => !['package.json'].includes(f.name))
        .map(f => path.resolve(wpRoot, f.name));
    const config = {
        input: entryPoints,
        plugins: [nodeResolve(), vue(), typescript()],
        //打包时，不需要在打包vue代码了以及其他模块的内容
        external: (id: string) => /^vue/.test(id) || /^@adsionli-plus/.test(id)
    }
    const bundle = await rollup(config);

    return Promise.all(
        Object.values(buildConfig).map(config => ({
            format: config.format,
            dir: config.output.path,
            paths: pathRewriter(config.output.name)
        })).map(option => bundle.write(option as OutputOptions))
    )
}
// gulp适合流程控制和代码的转义  没有打包的功能
export const buildFullComponent = parallel(buildFull, buildEntry);