import glob from 'fast-glob';
import { wpRoot, outDir, projectRoot } from './utils/path';
import { Project, ModuleKind, ScriptTarget, SourceFile } from 'ts-morph';
import path from 'path';
import fs from 'fs/promises';
import { parallel, series } from 'gulp';
import { withTaskName, run } from './utils/index';
import { buildConfig } from './utils/config';
/**
 * @method genEnterTypes 本方法主要为了生成.d.ts文件，也就是声明类型文件
 */
export const genEnterTypes = async () => {
    const files = await glob("*.ts", {
        cwd: wpRoot,
        absolute: true,
        onlyFiles: true
    })
    //NOTE: 配置一下ts，然后根据配置项生成对应的AST语法树
    const project = new Project({
        compilerOptions: {
            declaration: true,
            module: ModuleKind.ESNext,
            allowJs: true,
            emitDeclarationOnly: true,
            noEmitOnError: false,
            outDir: path.resolve(outDir, "entry/types"),
            target: ScriptTarget.ESNext,
            rootDir: wpRoot,
            strict: false,
            strictNullChecks: false
        },
        skipFileDependencyResolution: true,
        tsConfigFilePath: path.resolve(projectRoot, "tsconfig.json"),
        skipAddingFilesFromTsConfig: true
    })
    const sourceFiles: SourceFile[] = [];
    files.map(f => {
        //将需要处理的文件全部拿出来，然后放入到待处理文件集合中
        const sourceFile = project.addSourceFileAtPath(f);
        sourceFiles.push(sourceFile);
    })
    //将处理好的内容，进行输出
    await project.emit({
        emitOnlyDtsFiles: true
    })
    //执行创建并写入类型文件的操作
    const tasks = sourceFiles.map(async (sourceFile) => {
        const emitOutput = sourceFile.getEmitOutput();
        for (const outputFile of emitOutput.getOutputFiles()) {
            const filepath = outputFile.getFilePath();
            await fs.mkdir(path.dirname(filepath), { recursive: true });
            await fs.writeFile(
                filepath,
                outputFile.getText().replace("@adsionli-plus", "."),
                "utf-8"
            )
        }
    })

    await Promise.all(tasks);
}

export const copyEntryTypes = () => {
    const src = path.resolve(outDir, "entry/types");
    const copy = (module) => parallel(
        withTaskName(`copyEntryTypes: ${module}`, () => run(`cp -r ${src}/* ${path.resolve(outDir, buildConfig[module].output.path)}`))
    )

    return parallel(copy("esm"), copy("cjs"))
}

export const genTypes = series(genEnterTypes, copyEntryTypes());