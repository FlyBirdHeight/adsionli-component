// 专门打包util，指令，hook

import path from "path";
import ts from "gulp-typescript";
import { series, parallel, src, dest } from "gulp";
import { buildConfig } from "./utils/config";
import { outDir, projectRoot } from "./utils/path";
import { withTaskName } from "./utils";
//打包处理
export const buildPackages = (dirname: string, name: string) => {
    const task = Object.entries(buildConfig).map(([module, config]) => {
        const output = path.resolve(dirname, config.output.name);
        return series(
            withTaskName(`build-${dirname}`, () => {
                const tsConfig = path.resolve(projectRoot, "tsconfig.json");
                const inputs = ["**/*.ts", "!gulpfile.ts", "!node_modules"];
                return src(inputs)
                    .pipe(
                        ts.createProject(tsConfig, {
                            declaration: true,
                            strict: false,
                            module: config.module
                        })()
                    )
                    .pipe(dest(output));
            }),
            withTaskName(`copy: ${dirname}`, () => {
                // 将打包好的文件放到 es=>utils 和 lib => utils
                // 将utils模块拷贝到dist目录下的es和lib目录
                return src(`${output}/**`).pipe(dest(path.resolve(outDir, config.output.name, name)))
            })
        )
    })
    //多线程进行打包操作
    return parallel(task);
}