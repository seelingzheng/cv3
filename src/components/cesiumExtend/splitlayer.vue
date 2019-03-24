<template>
  <div id="slider"></div>
</template>


<script>
import Cesium from "cesium/Cesium";
export default {
  name: "",
  inject: ["getViewer"],

  data() {
    return {};
  },
  mounted() {
    var vm = this;
    vm.getViewer(viewer => {
      var layers = viewer.imageryLayers;

      var balckMarble = layers.addImageryProvider(
        new Cesium.createTileMapServiceImageryProvider({
          url: "https://cesiumjs.org/blackmarble",
          credit: "Black Marble imagery courtesy NASA Earth Observatory",
          flipXY: true
        })
      );

      balckMarble.splitDirection = Cesium.ImagerySplitDirection.RIGHT;

      var slider = document.getElementById("slider");
      viewer.scene.imagerySplitPosition =
        slider.offsetLeft / slider.parentElement.offsetWidth;

      var handler = new Cesium.ScreenSpaceEventHandler(slider);
      var moveActive = false;
      function move(movement) {
        if (!moveActive) {
          return;
        }
        var relativeOffset = movement.endPosition.x;
        var splitPosition =
          (slider.offsetLeft + relativeOffset) /
          slider.parentElement.offsetWidth;
        slider.style.left = 100 * splitPosition + "%";
        viewer.scene.imagerySplitPosition = splitPosition;
        console.log("splitPosition", splitPosition);
      }

      handler.setInputAction(function() {
        moveActive = true;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      handler.setInputAction(function() {
        moveActive = true;
      }, Cesium.ScreenSpaceEventType.PINCH_START);

      handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

      handler.setInputAction(function() {
        moveActive = false;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
      handler.setInputAction(function() {
        moveActive = false;
      }, Cesium.ScreenSpaceEventType.PINCH_END);
    });
  },
  methods: {}
};
</script>

<style lang = 'scss' scoped >
#slider {
  position: absolute;
  left: 50%;
  /* top: 0px; */
  background-color: #d3d3d3;
  width: 5px;
  height: 100%;
  z-index: 9999;
}

#slider:hover {
  cursor: ew-resize;
}
</style>