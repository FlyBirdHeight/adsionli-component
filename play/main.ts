import { createApp } from "vue"
import App from './app.vue'
import AdsionliButton from '@adsionli-plugin/components/button';
import '@adsionli-plugin/theme-chalk/src/index.scss';

const app = createApp(App);
app.use(AdsionliButton);
app.mount('#app');