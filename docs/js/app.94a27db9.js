(function(e){function t(t){for(var i,o,s=t[0],l=t[1],u=t[2],d=0,f=[];d<s.length;d++)o=s[d],r[o]&&f.push(r[o][0]),r[o]=0;for(i in l)Object.prototype.hasOwnProperty.call(l,i)&&(e[i]=l[i]);c&&c(t);while(f.length)f.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],i=!0,s=1;s<n.length;s++){var l=n[s];0!==r[l]&&(i=!1)}i&&(a.splice(t--,1),e=o(o.s=n[0]))}return e}var i={},r={app:0},a=[];function o(t){if(i[t])return i[t].exports;var n=i[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=i,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var c=l;a.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var i=n("64a9"),r=n.n(i);r.a},1:function(e,t){},"16e8":function(e,t,n){"use strict";var i=n("d3e8"),r=n.n(i);r.a},2:function(e,t){},"429a":function(e,t){function n(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}n.keys=function(){return[]},n.resolve=n,e.exports=n,n.id="429a"},"4a69":function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("HelloCesium")},r=[],a=(n("cadf"),n("551c"),n("f751"),n("097d"),n("ec35")),o=n.n(a),s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("base-cesium",{on:{getViewer:e.getViewer}})],1)},l=[],u=n("ab65"),c={name:"HelloCessium",components:{BaseCesium:u["a"]},data:function(){return{viewer:null}},mounted:function(){},methods:{getViewer:function(e){e.imageryLayers.remove(e.imageryLayers.get(0)),e.imageryLayers.addImageryProvider(new o.a.UrlTemplateImageryProvider({url:"http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}",tilingScheme:new o.a.WebMercatorTilingScheme})),e.terrainProvider=o.a.createWorldTerrain({requestWaterMask:!0,requestVertexNormals:!0}),e.scene.globe.depthTestAgainstTerrain=!0,e.scene.globe.enableLighting=!0}}},d=c,f=(n("16e8"),n("2877")),m=Object(f["a"])(d,s,l,!1,null,"144e9950",null),p=m.exports,v={name:"HelloCesiumPage",components:{HelloCesium:p}},h=v,g=Object(f["a"])(h,i,r,!1,null,null,null);t["default"]=g.exports},"4a9e":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var i=n("a026"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("el-row",{staticClass:"row-bg",attrs:{type:"flex"}},[n("el-col",{attrs:{span:4}},[n("div",{staticClass:"grid-content bg-purple"},[n("div",[e.isCollapse?n("div",{on:{click:function(t){return e.showHide()}}},[n("i",{staticClass:"el-icon-menu"})]):n("div",{on:{click:function(t){return e.showHide()}}},[e._v("\n            Cesium 案例集 "),n("i",{staticClass:"el-icon-menu"})])]),n("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{"default-active":"1-1",collapse:e.isCollapse,router:""},on:{open:e.handleOpen,close:e.handleClose}},[n("el-submenu",{attrs:{index:"1"}},[n("template",{slot:"title"},[n("i",{staticClass:"el-icon-location"}),n("span",{attrs:{slot:"title"},slot:"title"},[e._v("官方案例")])]),n("el-menu-item-group",[n("span",{attrs:{slot:"title"},slot:"title"},[e._v("官方案例")]),n("el-menu-item",{attrs:{index:"1-1",route:{path:"/"}}},[e._v("Hello\n              ")]),n("el-menu-item",{attrs:{index:"1-2",route:{path:"/eapi"}}},[e._v("EntityAPI")])],1),n("el-menu-item-group",{attrs:{title:"分组2"}},[n("el-menu-item",{attrs:{index:"1-3"}},[e._v("选项3")])],1)],2),n("el-submenu",{attrs:{index:"2"}},[n("template",{slot:"title"},[n("i",{staticClass:"el-icon-location"}),n("span",{attrs:{slot:"title"},slot:"title"},[e._v("其他案例")])]),n("el-menu-item-group",[n("span",{attrs:{slot:"title"},slot:"title"},[e._v("官方案例")]),n("el-menu-item",{attrs:{index:"2-1"}},[e._v("基础地图")]),n("el-menu-item",{attrs:{index:"2-2"}},[e._v("选项2")])],1),n("el-menu-item-group",{attrs:{title:"分组2"}},[n("el-menu-item",{attrs:{index:"1-3"}},[e._v("选项3")])],1)],2)],1)],1)]),n("el-col",{attrs:{span:20}},[n("div",{staticClass:"grid-content bg-purple-light"},[n("router-view")],1)])],1)],1)},a=[],o={data:function(){return{isCollapse:!1}},methods:{showHide:function(){this.isCollapse=!this.isCollapse},handleOpen:function(){},handleClose:function(){}}},s=o,l=(n("034f"),n("2877")),u=Object(l["a"])(s,r,a,!1,null,null,null),c=u.exports,d=(n("28a5"),n("ac6a"),n("8c4f")),f=n("4a69"),m=[{path:"/",name:"cesium",component:f["default"]}],p=n("e1b5");p.keys().forEach(function(e){var t=e.split("/").pop().split(".").shift();if("hellocesium"!==t){var n=p(e).default,i={path:"/".concat(t),name:t,component:n};m.push(i)}}),i["default"].use(d["a"]);var v=new d["a"]({mode:"history",base:"",routes:m}),h=n("ec35"),g=n.n(h),w=(n("6f8a"),n("0fae"),n("5c96")),b=n.n(w);i["default"].use(b.a),i["default"].Cesium=i["default"].prototype.$Cesium=g.a,i["default"].config.productionTip=!1,new i["default"]({router:v,render:function(e){return e(c)}}).$mount("#app")},"64a9":function(e,t,n){},"8d30":function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("base-cesium",{on:{getViewer:e.getViewer}})],1)},r=[],a=n("ec35"),o=n.n(a),s=n("ab65"),l={name:"HelloCessium",components:{BaseCesium:s["a"]},data:function(){return{viewer:null}},mounted:function(){},methods:{getViewer:function(e){this.viewer=e,this.addEntity()},addEntity:function(){var e=this.viewer.entities.add({name:"Wyoming",polygon:{hierarchy:o.a.Cartesian3.fromDegreesArray([-109.080842,45.002073,-105.91517,45.002073,-104.058488,44.996596,-104.053011,43.002989,-104.053011,41.003906,-105.728954,40.998429,-107.919731,41.003906,-109.04798,40.998429,-111.047063,40.998429,-111.047063,42.000709,-111.047063,44.476286,-111.05254,45.002073]),height:1e4,extrudedHeight:1e3,material:o.a.Color.RED.withAlpha(.5),outline:!0,outlineColor:o.a.Color.BLACK}});this.viewer.zoomTo(e)}}},u=l,c=(n("cec2"),n("2877")),d=Object(c["a"])(u,i,r,!1,null,"ab4953d8",null);t["default"]=d.exports},"9a3d":function(e,t,n){},ab65:function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"cesiumContainer"}})},r=[],a=n("ec35"),o=n.n(a),s={name:"BaseCesium",data:function(){return{viewer:null}},provide:function(){return{getViewer:this.getViewer}},mounted:function(){var e=o.a.Rectangle.fromDegrees(100,10,120,70);o.a.Camera.DEFAULT_VIEW_RECTANGLE=e;var t={animation:!1,baseLayerPicker:!1,fullscreenButton:!1,geocoder:!1,homeButton:!1,infoBox:!1,sceneModePicker:!1,selectionIndicator:!1,timeline:!1,sceneMode:o.a.SceneMode.SCENE3D,navigationHelpButton:!1,scene3DOnly:!0,navigationInstructionsInitiallyVisible:!1,showRenderLoopErrors:!1};this.viewer=new o.a.Viewer("cesiumContainer",t),this.viewer._cesiumWidget._creditContainer.style.display="none",this.$emit("getViewer",this.viewer)},methods:{getViewer:function(e){var t=this;function n(){t.viewer?e(t.viewer):setTimeout(n,100)}n()}}},l=s,u=(n("c7ba"),n("2877")),c=Object(u["a"])(l,i,r,!1,null,"6669274e",null);t["a"]=c.exports},c7ba:function(e,t,n){"use strict";var i=n("9a3d"),r=n.n(i);r.a},cec2:function(e,t,n){"use strict";var i=n("4a9e"),r=n.n(i);r.a},d3e8:function(e,t,n){},e1b5:function(e,t,n){var i={"./eapi.vue":"8d30","./hellocesium.vue":"4a69"};function r(e){var t=a(e);return n(t)}function a(e){var t=i[e];if(!(t+1)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return t}r.keys=function(){return Object.keys(i)},r.resolve=a,e.exports=r,r.id="e1b5"}});
//# sourceMappingURL=app.94a27db9.js.map