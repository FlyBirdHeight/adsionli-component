import AdsionliRefresh from "./src/refresh.vue";
import { App } from 'vue';

AdsionliRefresh.install = (app: App) => {
    app.component(AdsionliRefresh.name, AdsionliRefresh);
}
export {
    AdsionliRefresh
}
export default AdsionliRefresh;