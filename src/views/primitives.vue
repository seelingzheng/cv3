<template>
  <div>
    <div class="btn-box">
      <div
        v-for="(item, index) in Object.keys(geometries)"
        :key="index"
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName==item}"
        @click="addPrimitives(item)"
      >{{item}}</div>
    </div>
    <base-cesium @getViewer="getViewer" :imgurl="imgurl"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import BaseCesium from "../components/BaseCesium";
import mixin from "../utils/mixin.js";
import { lxzx3, lxzx2 } from "@/assets/data/graphics.js";

export default {
  components: {
    BaseCesium
  },
  mixins: [mixin],
  data() {
    return {
      viewer: null,
      curName: null,
      geometries: null,
      outlinegeometries: null,
      defaultPoint: [104.063305, 30.59577, 3000],
      imgurl: "" //"/images/world.jpg"
    };
  },

  beforeMount() {
    let geoLxzx = this.getLXZX3();
    this.geometries = {
      BoxGeometry: {
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0)
      },
      // {
      //   geometry: Cesium.BoxGeometry.fromDimensions({
      //     vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
      //     dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0)
      //   }),
      //   modelMatrix: Cesium.Matrix4.multiplyByTranslation(
      //     Cesium.Transforms.eastNorthUpToFixedFrame(
      //       Cesium.Cartesian3.fromDegrees(105.0, 45.0)
      //     ),
      //     new Cesium.Cartesian3(0.0, 0.0, 250000),
      //     new Cesium.Matrix4()
      //   ),
      //   attributes: {
      //     color: Cesium.ColorGeometryInstanceAttribute.fromColor(
      //       Cesium.Color.RED.withAlpha(0.5)
      //     )
      //   }
      // },
      // {
      //   geometry: new Cesium.BoxOutlineGeometry({
      //     maximum: new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
      //     minimum: new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0)
      //   }),
      //   modelMatrix: Cesium.Matrix4.multiplyByTranslation(
      //     Cesium.Transforms.eastNorthUpToFixedFrame(
      //       Cesium.Cartesian3.fromDegrees(115.0, 45.0)
      //     ),
      //     new Cesium.Cartesian3(0.0, 0.0, 250000),
      //     new Cesium.Matrix4()
      //   )
      // },
      rectangle: {
        ellipsoid: Cesium.Ellipsoid.WGS84,
        rectangle: Cesium.Rectangle.fromDegrees(120.0, 39.0, 125.0, 42.0),
        height: 10000.0,
        extrudedHeight: 300000
      },
      // {
      //   geometry: new Cesium.RectangleOutlineGeometry({
      //     ellipsoid: Cesium.Ellipsoid.WGS84,
      //     rectangle: Cesium.Rectangle.fromDegrees(123.0, 39.0, 128.0, 42.0),
      //     height: 10000.0
      //   })
      // }
      polygons: [
        {
          geometry: new Cesium.PolygonGeometry({
            extrudedHeight: 100,
            polygonHierarchy: new Cesium.PolygonHierarchy(
              Cesium.Cartesian3.fromDegreesArray(geoLxzx)
            ),
            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
          }),
          id: "理想中心三栋"
        }
      ]
    };
  },
  methods: {
    getViewer(v) {
      this.viewer = v;
      this.addNameOverLay();
      // this.rejectPickerEvent();
      // this.viewer.camera.flyTo({
      //   destination: Cesium.Cartesian3.fromDegrees(
      //     this.defaultPoint[0],
      //     this.defaultPoint[1],
      //     this.defaultPoint[2]
      //   )
      //   // orientation: {
      //   //   heading: Cesium.Math.toRadians(0.0),
      //   //   pitch: Cesium.Math.toRadians(-45.0),
      //   //   roll: 0.0
      //   // }
      // });
      // this.addLXZX();
    },
    addPrimitives(n) {
      this.curName = n;
      let geometryInstances = this.getGeometryInstance(n);
      this.viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances,
          appearance: new Cesium.PerInstanceColorAppearance()
        })
      );
      // this.viewer.flyTo(this.viewer.scene.primitives);
    },
    addLXZX() {
      var graphic = this.getLXZX2();
      var polygonInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.PolygonGeometry({
          extrudedHeight: 100,
          polygonHierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(graphic)
          ),
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
        }),
        id: "理想中心二栋",
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 0.5)
        }
      });
      let g = this.viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: [polygonInstance],
          appearance: new Cesium.PerInstanceColorAppearance()
        })
      );
    },
    getGeometry(n) {
      let geoOption = this.geometries[n];
      let geo = new Cesium[n](geoOption);
      return Cesium[n].createGeometry(geo);
    },
    getOutlineGeometry(n) {
      let geoOption = this.geometries[n];
      let geo = new Cesium[n](geoOption);
      return Cesium[n].createGeometry(geo);
    },

    getGeometryInstance(n) {
      let geometry = this.getGeometry(n);
      let geometryInstances = [];

      var gInstance = new Cesium.GeometryInstance({
        geometry,
        id: n,
        attributes: {
          color: new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 0.5)
        }
      });
      geometryInstances.push(gInstance);

      let outlineGeometry = this.getOutlineGeometry();

      return geometryInstances;
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

