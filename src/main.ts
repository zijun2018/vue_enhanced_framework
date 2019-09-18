import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

// 引入第三方库
import "amfe-flexible";

// 引入vant全局组件
import { Toast, Loading } from "vant";
import "vant/lib/index.css";
Vue.prototype.$toast = Toast;
Vue.prototype.$loading = Loading;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
