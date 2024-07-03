import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import echarts from "echarts"
// import 'element-ui/lib/theme-chalk/index.css';
import './theme/index.css'
import './theme/icon.css'
import axios from 'axios';
import { getRequest } from './utils/api';
import { postRequest } from "@/utils/api";
import { putRequest } from "@/utils/api";
import { deleteRequest } from "@/utils/api";

// import { VuePlugin } from 'vuera'
// Vue.use(VuePlugin)

Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest

Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
