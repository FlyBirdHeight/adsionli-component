import path from "path";
import { outDir } from './path';
//ts打包配置,需要输出两种，一种是esmodule的形式，一种是commonjs的形式
export const buildConfig = {
    esm: {
        module: "ESNext",
        format: "esm",
        output: {
            name: "es",
            path: path.resolve(outDir, "es")
        },
        bundle: {
            path: "a-plus/es"
        }
    },
    cjs: {
        module: "CommonJs",
        format: "cjs",
        output: {
            name: "lib",
            path: path.resolve(outDir, 'lib')
        },
        bundle: {
            path: "a-plus/lib"
        }
    }
}

export type BuildConfig = typeof buildConfig;