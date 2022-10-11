import { buildConfig } from './utils/config';
import { pathRewriter, run } from './utils/index';
import { compRoot, outDir, projectRoot } from './utils/path';
import { rollup, OutputOptions } from "rollup";
//typescript工具库，用来处理AST语法树内容
import { Project, SourceFile, OutputFile } from "ts-morph";
import { sync } from "fast-glob";

import glob from "fast-glob";
import fs from "fs/promises";
import path from 'path';

import * as VueCompiler from "@vue/compiler-sfc";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { parallel, series } from 'gulp';


const buildEachComponent = async () => {
    //获取指定目录下的所有文件夹信息
    const files = sync("*", {
        cwd: compRoot,
        onlyDirectories: true
    })
    //分别把components文件夹下的组件，放到dist/es/components下 和 dist/lib/components，其实就是两种不同的打包方式
    const builds = files.map(async (file: string) => {
        const input = path.resolve(compRoot, file, 'index.ts');
        const config = {
            input,
            plugins: [nodeResolve(), typescript(), vue(), commonjs()],
            //NOTE: 这里需要排除掉vue的依赖与对本身的依赖，单独打包
            external: (id) => /^vue/.test(id) || /^@adsionli-plus/.test(id)
        };
        //创建一个rollup程序
        const bundle = await rollup(config);
        const options = Object.values(buildConfig).map((config) => ({
            format: config.format,
            file: path.resolve(config.output.path, `components/${file}/index.js`),
            paths: pathRewriter(config.output.path),
            exports: "named"
        }));
        //这里就是运行rollup，将内容写出到指定目录下
        await Promise.all(
            options.map((option) => bundle.write(option as OutputOptions))
        )
    })

    return Promise.all(builds)
}

async function genTypes() {
    const project = new Project({
        // 生成.d.ts 我们需要有一个tsconfig
        compilerOptions: {
            allowJs: true,
            declaration: true,
            emitDeclarationOnly: true,
            noEmitOnError: true,
            outDir: path.resolve(outDir, "types"),
            baseUrl: projectRoot,
            paths: {
                "@w-plus/*": ["packages/*"]
            },
            skipLibCheck: true,
            strict: false
        },
        tsConfigFilePath: path.resolve(projectRoot, "tsconfig.json"),
        skipAddingFilesFromTsConfig: true
    })
    //获取文件位置
    const filePaths = await glob("**/*", {
        // ** 任意目录  * 任意文件
        cwd: compRoot,
        onlyFiles: true,
        absolute: true
    })

    const sourceFiles: SourceFile[] = [];

    await Promise.all(
        filePaths.map(async function (file) {
            if (file.endsWith('.vue')) {
                const content = await fs.readFile(file, "utf8");
                //这一步是将vue代码分解成AST语法树
                const sfc = VueCompiler.parse(content);
                const { script } = sfc.descriptor;
                //README: 通过分解后的内容，拿到了对应的descriptor，然后再将script中的content抽离出来，创建成对应的.d.ts文件
                if (script) {
                    let content = script.content; // 拿到脚本  icon.vue.ts  => icon.vue.d.ts
                    //NOTE: 创建对应的文件，并写入文件，然后将文件路径放入到sourceFiles中进行保存
                    const sourceFile = project.createSourceFile(file + ".ts", content);
                    sourceFiles.push(sourceFile);
                }
            } else {
                const sourceFile = project.addSourceFileAtPath(file); // 把所有的ts文件都放在一起 发射成.d.ts文件，.d.ts文件就是一种类型声明，防止ts找不到对应类型的错误问题
                sourceFiles.push(sourceFile);
            }
        })
    )
    //README: 执行rollup打包进程
    await project.emit({
        //NOTE: 默认是放入到内存中，这里我们就需要将其放入到文件中，因为我们是打包输出静态资源文件了，就不需要放在内存中去了
        emitOnlyDtsFiles: true
    })

    const tasks = sourceFiles.map(async (sourceFile: SourceFile) => {
        //NOTE: 先获取到输出信息，然后获取到输出目录下的全部文件内容，然后在进行文件创建，并且将其内容写入到对应路径下创建的新的文件中去
        const emitOutput = sourceFile.getEmitOutput();
        const tasks = emitOutput.getOutputFiles().map(async (outputFile: OutputFile) => {
            const filePath = outputFile.getFilePath();
            await fs.mkdir(path.dirname(filePath), {
                recursive: true
            })
            await fs.writeFile(filePath, pathRewriter("es")(outputFile.getText()));
        })

        await Promise.all(tasks)
    })

    await Promise.all(tasks)
}
/**
 * @method copyTypes 将类型文件复制到dist/components/对应的文件目录下
 */
function copyTypes() {
    //将types分别放入到es模块以及lib模块下
    const src = path.resolve(outDir, "types/components/");
    const copy = (module) => {
        let output = path.resolve(outDir, module, "components");
        return () => run(`sp -r ${src}/* ${output}`);
    }

    return parallel(copy('es'), copy('lib'));
}
/**
 * @method buildComponentEntry 创建单个组件导入的入口文件
 */
async function buildComponentEntry() {
    const config = {
        input: path.resolve(compRoot, "index.ts"),
        plugins: [typescript()],
        external: () => true
    };
    const bundle = await rollup(config);
    return Promise.all(
        Object.values(buildConfig).map((config) => ({
            format: config.format,
            file: path.resolve(config.output.path, "components/index.js")
        })).map((config) => bundle.write(config as OutputOptions))
    );
}

export const buildComponent = series(
    buildEachComponent,
    genTypes,
    copyTypes(),
    buildComponentEntry
)