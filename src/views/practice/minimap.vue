<template>
  <div class="minimap">
    <div id='main'></div>
    <div id='mini'></div>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import world from "@/assets/images/world.jpg";
import { clone } from "lodash";
export default {
  name: "",
  data() {
    return {
      main: null,
      mini: null
    };
  },
  mounted() {
    let vm = this;

    let imgProvider = new Cesium.SingleTileImageryProvider({
      url: world
    });
    let gaodeImgProvider = new Cesium.WebMapTileServiceImageryProvider({
      url:
        "http://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={TileCol}&y={TileRow}&z={TileMatrix}",
      layer: "tdtVecBasicLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "",
      show: false
    });

    let option = {
      homeButton: false,
      sceneModePicker: false, //投影方式显示
      navigationHelpButton: false,
      // creditContainer: "credit",
      fullscreenButton: false,
      vrButton: false,
      animation: false, //动画控制不显示
      baseLayerPicker: false, //图层控制显示
      geocoder: false, //地名查找不显示
      timeline: false //时间线不显示
    };
    let mainOption = clone(option);
    mainOption.imageryProvider = gaodeImgProvider;
    let miniOption = clone(option);
    miniOption.imageryProvider = imgProvider;

    vm.main = new Cesium.Viewer("main", mainOption);
    vm.mini = new Cesium.Viewer("mini", miniOption);

    var cameraControl = vm.mini.scene.screenSpaceCameraController;
    // cameraControl.enableRotate = false;
    // cameraControl.enableTranslate = false;
    // cameraControl.enableZoom = false;
    // cameraControl.enableTilt = false;
    // cameraControl.enableLook = false;
    let syncViewer = function() {
      vm.mini.camera.flyTo({
        destination: vm.main.camera.position,
        orientation: {
          heading: vm.main.camera.heading,
          pitch: vm.main.camera.pitch,
          roll: vm.main.camera.roll
        },
        duration: 0.0
      });
    };
    let syncMiniViewer = function() {
      vm.main.camera.flyTo({
        destination: vm.mini.camera.position,
        orientation: {
          heading: vm.mini.camera.heading,
          pitch: vm.mini.camera.pitch,
          roll: vm.mini.camera.roll
        },
        duration: 0.0
      });
    };
    // this.main.camera.changed.addEventListener(syncViewer);
    vm.main.scene.preRender.addEventListener(syncViewer);
    vm.mini.scene.preRender.addEventListener(syncMiniViewer);
  },
  methods: {}
};
</script>

<style lang = 'scss' scoped >
.minimap {
  #main {
    width: 100%;
    height: calc(100vh);
  }
  #mini {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
  }
}
</style>