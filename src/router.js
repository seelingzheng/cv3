import Vue from 'vue'
import Router from 'vue-router'

import HelloCesium from '@/views/base/hellocesium.vue'

var routes = [{
  path: '/',
  name: 'hello',
  component: HelloCesium
}, {
  path: '*',
  redirect: '/',
}]
let files = require.context('./views', true, /\.vue$/)

files.keys().forEach(key => {
  let name = key.split('/').pop().split('.').shift();
  if (name !== 'hellocesium') {


    let component = files(key).default
    let p = {
      path: `/${name}`,
      name,
      component
    }
    routes.push(p);
  }
});

// {
//   path: '/cesium',
//   name: 'cesium',
//   // route level code-splitting
//   // this generates a separate chunk (about.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () => import( /* webpackChunkName: "about" */ './views/CesiumPage.vue')
// }


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})