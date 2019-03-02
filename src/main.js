import Vue from 'vue'
import App from './App.vue'
import router from './router'

//引入 cesium
import Cesium from 'cesium/Cesium'
import widget from 'cesium/Widgets/widgets.css'

Vue.Cesium = Vue.prototype.$Cesium = Cesium;

// ElementUI
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from "element-ui";
Vue.use(ElementUI);

import '../public/css/font-awesome-4.7.0/css/font-awesome.min.css'

import _ from 'lodash'

Vue._ = Vue.prototype._ = _;

import "@/assets/libs/heatmap/CesiumHeatmap.js"


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')