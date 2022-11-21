import { createApp } from "vue"
import App from './app.vue'
import AdsionliButton from '@adsionli-plugin/components/button';
import AdsionliRefresh from '@adsionli-plugin/components/refresh';
import '@adsionli-plugin/theme-chalk/src/index.scss';


const app = createApp(App);
app.use(AdsionliButton).use(AdsionliRefresh)
app.mount('#app');