import { withInstall } from "@adsionli-plugin/utils/with-install"
import Abutton from "./src/button.vue";
import { App } from 'vue';
Abutton.install = (app: App) => {
    app.component(Abutton.name, Abutton);
}
const AdsionliButton = Abutton;
export {
    AdsionliButton
}
export default AdsionliButton;