import AdsionliRefresh from "./src/refresh.vue";
import RefreshUp from "./src/up.vue";
import { App } from 'vue';
RefreshUp.install = (app: App) => {
    app.component(RefreshUp.name, RefreshUp)
}
AdsionliRefresh.install = (app: App) => {
    app.component(AdsionliRefresh.name, AdsionliRefresh);
}
export {
    AdsionliRefresh
}
export default AdsionliRefresh;