import AdsionliRefresh from "./src/refresh.vue";
import RefreshUp from "./src/up.vue";
import { App } from 'vue';

AdsionliRefresh.install = (app: App) => {
    app.component(AdsionliRefresh.name, AdsionliRefresh);
}

export { RefreshUp }

export {
    AdsionliRefresh
}
export default AdsionliRefresh;
export * from './src/up'
export type AdsionliRefreshUp = InstanceType<typeof RefreshUp>