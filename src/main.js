import Vue from 'vue'
import App from './App.vue'
import router from './router'

//引入 cesium
import Cesium from 'cesium/Cesium'
import widget from 'cesium/Widgets/widgets.css'
// ElementUI
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from "element-ui";
Vue.use(ElementUI);
Vue.Cesium = Vue.prototype.$Cesium = Cesium;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')