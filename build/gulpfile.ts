// 打包方式：串行(series)  并行(parallel)
import { series, parallel } from "gulp";
import { withTaskName, run } from "./utils"
import { genTypes } from './gen-types';
import { wpRoot, outDir } from "./utils/path";

// gulp 不叫打包，做代码转化 vite，gulp实际上是用来控制打包流程，而真正负责打包的是rollup
const copySourceCode = () => async () => {
  await run(`cp ${wpRoot}/package.json ${outDir}/package.json`);
};

/**
 * 1. 打包样式
 * 2. 打包工具方法
 * 3. 打包所有组件
 * 4. 打包每个组件
 * 5. 生成一个组件库
 * 6. 发布组件
 */
export default series(
  withTaskName("clean", async () => run('rm -rf ./dist')),  // 删除dist目录
  parallel(
    // withTaskName("buildPackages", () => run("pnpm run --parallel build --filter ./packages")),
    withTaskName("buildFullComponent", () => run("pnpm run build buildFullComponent")),
    // withTaskName("buildComponent", () => run("pnpm run build buildComponent"))
  ),
  parallel(genTypes, copySourceCode())
);

export * from "./full_component"
export * from "./component"