<template>
  <div id="cesiumContainer"></div>
  <!-- <div id="loadingOverlay">
      <h1>Loading...</h1>
  </div>-->
</template>

<script>
import Cesium from "cesium/Cesium";
export default {
  name: "BaseCesium",
  props: ["imgurl", "options"],
  data() {
    return {
      viewer: null
    };
  },
  provide() {
    return {
      getViewer: this.getViewer
    };
  },
  mounted() {
    //设置默认 home
    var china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70);
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china;

    let initOption = {
      animation: false, //是否创建动画小器件，左下角仪表
      baseLayerPicker: false, //是否显示图层选择器
      fullscreenButton: false, //是否显示全屏按钮
      geocoder: false, //是否显示geocoder小器件，右上角查询按钮
      homeButton: false, //是否显示Home按钮
      infoBox: false, //是否显示信息框
      sceneModePicker: false, //是否显示3D/2D选择器
      selectionIndicator: false, //是否显示选取指示器组件
      timeline: false, //是否显示时间轴
      sceneMode: Cesium.SceneMode.SCENE3D, //设定3维地图的默认场景模式:Cesium.SceneMode.SCENE2D、Cesium.SceneMode.SCENE3D、Cesium.SceneMode.MORPHING
      navigationHelpButton: false, //是否显示右上角的帮助按钮
      scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      navigationInstructionsInitiallyVisible: false,
      showRenderLoopErrors: false
    };

    if (this.imgurl) {
      initOption["imageryProvider"] = new Cesium.SingleTileImageryProvider({
        url: this.imgurl
      });
    }
    if (this.options) initOption = Object.assign(initOption, this.options);
    this.viewer = new Cesium.Viewer("cesiumContainer", initOption);
    //去除版权信息
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.$emit("getViewer", this.viewer);
    this.addLogo();
  },
  methods: {
    getViewer(found) {
      var vm = this;
      function checkForMap() {
        if (vm.viewer) {
          found(vm.viewer);
        } else {
          setTimeout(checkForMap, 100);
        }
      }
      checkForMap();
    },
    addLogo() {
      var mapDom = document.getElementById("cesiumContainer");
      console.log(mapDom.clientWidth, mapDom.clientHeight);
      var viewportQuad = new Cesium.ViewportQuad();
      viewportQuad.rectangle = new Cesium.BoundingRectangle(
        mapDom.clientWidth - 85,
        5,
        80,
        80
      );
      this.viewer.scene.primitives.add(viewportQuad);

      viewportQuad.material = new Cesium.Material({
        fabric: {
          type: "Image",
          uniforms: {
            color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
            image: "images/qr.jpg"
          }
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#cesiumContainer {
  width: auto;
  height: calc(100vh);
}
.cesium-widget-credits {
  display: none !important;
  visibility: hide !important;
}
</style>
