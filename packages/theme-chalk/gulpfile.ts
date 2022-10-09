import { series, parallel, src, dest } from "gulp";

// gulp 不叫打包，做代码转化 vite
import gulpSass from "gulp-sass";
import dartSass from "sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import path from "path";
/**
 * 1. 打包样式
 * 2. 打包工具方法
 * 3. 打包所有组件
 * 4. 打包每个组件
 * 5. 生成一个组件库
 * 6. 发布组件
 */

//1. 处理sass文件
function compile() {
    const sass = gulpSass(dartSass);
    console.log(__dirname)
    // 从src下的scss文件开始=>编译成css=>添加前缀=>压缩=>最终输出到当前目录下dist下的css目录
    return src(path.resolve(__dirname, "./src/*.scss"))
        .pipe(sass.sync())
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(dest("./dist/css"));
}
/**
 * 处理font文件
 */
function copyfont() {
    // 从src下单fonts文件夹下的所有文件开始=>压缩=>最终输出到当前目录下dist下的font目录
    return src(path.resolve(__dirname, './src/fonts/**')).pipe(cleanCss()).pipe(dest("./dist/fonts"))
}
/**
 * 把打包好的css输出到根目录的dist
 */
function copyfullstyle() {
    const rootDistPath = path.resolve(__dirname, '../../dist/theme-chalk')
    return src(path.resolve(__dirname, './dist/**')).pipe(dest(rootDistPath))
}
//gulp相当于是一个管道，会根据我们设置好的管道，将文件进行处理，然后进行输出到指定位置
export default series(compile, copyfont, copyfullstyle);