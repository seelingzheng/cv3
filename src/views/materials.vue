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
    <base-cesium @getViewer="getViewer" :imgurl="imgurl"></base-cesium>
    <video id="trailer" muted autoplay loop crossorigin controls>
      <source src="/video/big-buck-bunny_trailer.webm" type="video/webm">
      <source src="/video/big-buck-bunny_trailer.mp4" type="video/mp4">
      <source src="/video/big-buck-bunny_trailer.mov" type="video/quicktime">Your browser does not support the
      <code>video</code> element.
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
      entity: null,
      imgurl: "" //"/images/world.jpg"
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      // this.rejectPickerEvent();
      this.initEntity();
    },
    getEntity(n) {
      // this.initEntity();
      if (n == "video") {
        this.addVideoMaterial("wall");
      } else if (n == "canvas") {
        this.addCanvasMaterial("wall");
      }
      this.curName = n;
    },
    initEntity() {
      var graphic = this.transferToWGS84();
      let option = {
        wall: {
          name: "Red wall at height",
          wall: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              121.444409,
              31.247417,
              200.0,
              121.533521,
              31.235685,
              200.0,
              121.563273,
              31.190347,
              200.0,
              121.546744,
              31.194054,
              200.0,
              121.516705,
              31.191459,
              200.0,
              121.502188,
              31.203074,
              200.0
            ]),
            minimumHeights: [3000.0, 2000.0, 2000, 2000, 2000, 3000],
            material: Cesium.Color.RED.withAlpha(0.5)
          }
        },
        lxzx: {
          id: "lxzx3",
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(graphic),
            height: 0, //离地高度
            extrudedHeight: 50, //物体高度
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK
          },
          description: `这里是成都市高新区理想中心3栋`
        }
      };
      this.entity = this.viewer.entities.add(option.wall);

      this.viewer.zoomTo(this.entity);
    },

    addVideoMaterial(type) {
      var videoElement = document.getElementById("trailer");
      var isRepeating = true;
      this.entity[type].material = videoElement;
      this.entity[type].material.repeat = new Cesium.CallbackProperty(function(
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
    },

    addCanvasMaterial(type) {
      let c = document.createElement("canvas");
      c.width = 100;
      c.height = 100;
      let ctx = c.getContext("2d");
      let rgd = ctx.createRadialGradient(50, 50, 50, 50, 50, 0);
      rgd.addColorStop(0, "red");
      rgd.addColorStop(0.25, "yellow");
      rgd.addColorStop(0.5, "green");
      rgd.addColorStop(0.75, "purple");
      rgd.addColorStop(1, "blue");
      ctx.fillStyle = rgd;
      ctx.fillRect(0, 0, 100, 100);
      this.entity[type].material = c;
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
</style>

