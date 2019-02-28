<template>
  <div>
    <btn class="btn-box">
      <div
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName=='video'}"
        @click="getEntity('video')"
      >Video</div>
      <div
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName=='canvas'}"
        @click="getEntity('canvas')"
      >Canvas</div>
    </btn>
    <base-cesium
      @getViewer="getViewer"
      :imgurl="imgurl"
    ></base-cesium>
    <video
      id="trailer"
      muted=""
      autoplay=""
      loop=""
      crossorigin=""
      controls=""
    >
      <source
        src="video/big-buck-bunny_trailer.webm"
        type="video/webm"
      >
      <source
        src="video/big-buck-bunny_trailer.mp4"
        type="video/mp4"
      >
      <source
        src="video/big-buck-bunny_trailer.mov"
        type="video/quicktime"
      >
      Your browser does not support the <code>video</code> element.
    </video>

  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import BaseCesium from "@/components/BaseCesium";
import { lxzx3 } from "@/assets/data/graphics.js";
import { gcj02towgs84 } from "@/utils/transfer.js";
export default {
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: null,
      curName: null,
      oldMouseOverPick: null,
      imgurl: "" //"/images/world.jpg"
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      // this.rejectPickerEvent();
      this.addEntity();
    },
    getEntity(n) {},
    addEntity() {
      var videoElement = document.getElementById("trailer");
      var graphic = this.transferToWGS84();
      var wyoming = this.viewer.entities.add({
        id: "lxzx3",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(graphic),
          height: 0, //离地高度
          extrudedHeight: 50, //物体高度
          material: videoElement,
          outline: true,
          outlineColor: Cesium.Color.BLACK
        },
        description: `这里是成都市高新区理想中心3栋`
      });
      var isRepeating = true;
      wyoming.polygon.material.repeat = new Cesium.CallbackProperty(function(
        time,
        result
      ) {
        if (!Cesium.defined(result)) {
          result = new Cesium.Cartesian2();
        }
        if (isRepeating) {
          result.x = 8;
          result.y = 8;
        } else {
          result.x = 1;
          result.y = 1;
        }
        return result;
      },
      false);
      this.viewer.zoomTo(wyoming);
    },

    rejectPickerEvent() {
      let vm = this;
      var handler = new Cesium.ScreenSpaceEventHandler(vm.viewer.scene.canvas);
      handler.setInputAction(movement => {
        var pick = vm.viewer.scene.pick(movement.position);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.setInputAction(movement => {},
      Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    transferToWGS84() {
      var newLXZX3 = [];
      _.forEach(lxzx3, item => {
        newLXZX3.push(gcj02towgs84(item[0], item[1]));
      });
      return _.flatten(newLXZX3);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.btn-box {
  user-select: none;
  position: absolute;
  right: 10px;
  z-index: 1;
  display: flex;
  background: #0c0c7566;
  border-radius: 5px;
  &-item {
    cursor: pointer;
    padding: 3px;
    color: white;
    &:hover,
    &-selected {
      color: aqua;
    }
  }
}
</style>

