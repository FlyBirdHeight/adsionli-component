import { createApp } from "vue"
import App from './app.vue'
import AdsionliButton from '@adsionli-plugin/components/button';

const app = createApp(App);
app.use(AdsionliButton);
app.mount('#app');