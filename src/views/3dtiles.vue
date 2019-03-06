<template>
  <div>
    <div class="btn-box">
      <div
        v-for="(item, index) in Object.keys(entitiyOption)"
        :key="index"
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName==item}"
        @click="getEntity(item)"
      >{{item}}</div>
    </div>
    <base-cesium @getViewer="getViewer" :imgurl="imgurl"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import BaseCesium from "../components/BaseCesium";
import { lxzx3, lxzx2 } from "@/assets/data/graphics.js";
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
      silhouetteBlue: null,
      silhouetteGreen: null,
      nameOverlay: null,
      imgurl: "", //"/images/world.jpg"
      entities: {},
      entitiyOption: {
        lxzx3: {
          id: "lxzx3",
          name: "理想中心三栋",
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(this.getLXZX3()),
            height: 0, //离地高度
            extrudedHeight: 100, //物体高度
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK
          },
          description: `这里是成都市高新区理想中心3栋`
        },
        gltf: {
          name: "Spider",
          position: Cesium.Cartesian3.fromDegrees(104.063321, 30.59552, 0),
          orientation: Cesium.Transforms.headingPitchRollQuaternion(
            Cesium.Cartesian3.fromDegrees(104.063321, 30.59552, 0),
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(135), 0, 0)
          ),
          model: {
            uri: "/data/gltf/Spider.gltf",
            minimumPixelSize: 28,
            maximumScale: 200
          }
        }
      }
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      this.addNameOverLay();
      this.addShaderStage();
      this.rejectPickerEvent();
    },
    getEntity(n) {
      this.viewer.entities.removeAll();
      var entity = this.entities[n];
      if (entity) {
        this.viewer.entities.add(entity);
      } else {
        let option = this.entitiyOption[n];
        entity = this.viewer.entities.add(option);
      }
      this.viewer.zoomTo(entity);
    },

    rejectPickerEvent() {
      let vm = this;
      var handler = new Cesium.ScreenSpaceEventHandler(vm.viewer.scene.canvas);
      handler.setInputAction(movement => {
        var pick = vm.viewer.scene.pick(movement.position);
        if (Cesium.defined(pick)) {
          vm.pikcedEntity(pick);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.setInputAction(movement => {
        var pickedFeature = vm.viewer.scene.pick(movement.endPosition);

        if (!Cesium.defined(pickedFeature)) {
          this.hideNameOverLay();
          this.silhouetteBlue.selected = [];
          return;
        }
        var name = "";
        if (typeof pickedFeature.id == "string") {
          name = pickedFeature.id;
        } else {
          name = pickedFeature.id.name;
          if (!Cesium.defined(name)) {
            name = pickedFeature.id.id;
          }
        }
        vm.showNameOverLay(name, movement.endPosition);

        // vm.highlightEntity(pickedFeature);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    pikcedEntity(pick) {
      if (typeof pick.id == "string") {
        pick.primitive.material = Cesium.Color.GREEN.withAlpha(0.5);
      } else {
        pick.id.polygon.material = Cesium.Color.GREEN.withAlpha(0.5);
        pick.id.polygon.outlineColor = Cesium.Color.RED;
      }
    },
    highlightEntity(pickedFeature) {
      let vm = this;
      this.silhouetteBlue.selected = [pickedFeature];
    },
    addShaderStage() {
      //mouseover
      this.silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      this.silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
      this.silhouetteBlue.uniforms.length = 0.01;
      this.silhouetteBlue.selected = [];
      //mouse click
      this.silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      this.silhouetteGreen.uniforms.color = Cesium.Color.LIME;
      this.silhouetteGreen.uniforms.length = 0.01;
      this.silhouetteGreen.selected = [];

      this.viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createSilhouetteStage([
          this.silhouetteBlue,
          this.silhouetteGreen
        ])
      );
    },
    addNameOverLay() {
      this.nameOverlay = document.createElement("div");
      this.viewer.container.appendChild(this.nameOverlay);
      this.nameOverlay.className = "backdrop";
      this.nameOverlay.style.display = "none";
      this.nameOverlay.style.position = "absolute";
      this.nameOverlay.style.bottom = "0";
      this.nameOverlay.style.left = "0";
      this.nameOverlay.style["pointer-events"] = "none";
      this.nameOverlay.style.padding = "4px";
      this.nameOverlay.style.backgroundColor = "black";
    },
    hideNameOverLay() {
      this.nameOverlay.style.display = "none";
    },
    showNameOverLay(content, point) {
      this.nameOverlay.style.display = "block";
      this.nameOverlay.style.bottom =
        this.viewer.canvas.clientHeight - point.y + "px";
      this.nameOverlay.style.left = point.x + 200 + "px";
      this.nameOverlay.textContent = content;
    },
    transferToWGS84(data) {
      var newdata = [];
      _.forEach(data, item => {
        newdata.push(gcj02towgs84(item[0], item[1]));
      });
      return _.flatten(newdata);
    },
    getLXZX3() {
      return this.transferToWGS84(lxzx3);
    },
    getLXZX2() {
      return this.transferToWGS84(lxzx2);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>

