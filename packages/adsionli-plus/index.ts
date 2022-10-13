//NOTE: 这里实际就是用来导出全部组件内容的地方
import * as components from "@adsionli-plugin/components";
import { App } from "vue";

const install = (app: App) => {
    // 每个组件在写的时候都提供了install方法

    // 有的是组件，有的可能是指令 xxx.install = () => { app.directive() }
    Object.entries(components).forEach(([name, component]) => {
        app.component(name, component);
    });
};

export default {
    install,
};

export * from "@adsionli-plugin/components";