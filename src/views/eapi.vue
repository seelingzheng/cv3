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
    <div class="btn-box" style="top:40px">
      <div
        v-for="(item, index) in Object.keys(properties)"
        :key="index"
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName==item}"
        @click="getProperty(item)"
      >{{item}}</div>
    </div>
    <base-cesium @getViewer="getViewer" :options="options" :imgurl="imgurl"></base-cesium>
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

      silhouetteGreen: null,
      nameOverlay: null,
      imgurl: "", //"/images/world.jpg",
      defaultPoint: [110.2, 34.55, 3000000],
      entities: {},
      starttime: null,
      stoptime: null,
      entitiyOption: null,
      properties: null,
      options: {
        timeline: true, //是否显示时间轴
        animation: true
      }
    };
  },

  mounted() {},
  beforeMount() {
    this.starttime = Cesium.JulianDate.fromIso8601("2019-03-01T00:00:00.00Z");
    this.stoptime = Cesium.JulianDate.fromIso8601("2019-03-05T00:00:00.00Z");

    this.entitiyOption = {
      point: {
        position: Cesium.Cartesian3.fromDegrees(
          this.defaultPoint[0],
          this.defaultPoint[1]
        ),
        point: {
          pixelSize: 10,
          color: Cesium.Color.YELLOW
        }
      },
      box: {
        name: "Blue box",
        position: Cesium.Cartesian3.fromDegrees(
          this.defaultPoint[0],
          this.defaultPoint[1],
          0
        ),
        box: {
          dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
          material: Cesium.Color.BLUE
        }
      },
      circle: {
        position: Cesium.Cartesian3.fromDegrees(111.0, 40.0, 150000.0),
        name: "Green circle at height",
        ellipse: {
          semiMinorAxis: 300000.0,
          semiMajorAxis: 300000.0,
          height: 200000.0,
          material: Cesium.Color.GREEN
        }
      },
      ellipse: {
        position: Cesium.Cartesian3.fromDegrees(103.0, 40.0),
        name: "Red ellipse on surface with outline",
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.RED
        }
      },
      corridor: {
        name: "Red corridor on surface with rounded corners and outline",
        corridor: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            100.0,
            40.0,
            105.0,
            40.0,
            105.0,
            35.0
          ]),
          width: 200000.0,
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.RED
        }
      },
      cylinder: {
        name: "Green cylinder with black outline",
        position: Cesium.Cartesian3.fromDegrees(100.0, 40.0, 200000.0),
        cylinder: {
          length: 400000.0,
          topRadius: 200000.0,
          bottomRadius: 200000.0,
          material: Cesium.Color.GREEN.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.DARK_GREEN
        }
      },
      cone: {
        name: "Red cone",
        position: Cesium.Cartesian3.fromDegrees(105.0, 40.0, 200000.0),
        cylinder: {
          length: 400000.0,
          topRadius: 0.0,
          bottomRadius: 200000.0,
          material: Cesium.Color.RED
        }
      },
      polygon: {
        name: "Red polygon on surface",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            115.0,
            37.0,
            115.0,
            32.0,
            107.0,
            33.0,
            102.0,
            31.0,
            102.0,
            35.0
          ]),
          material: Cesium.Color.RED
        }
      },
      polyline: {
        name: "Red line on the surface",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([75, 35, 125, 35]),
          width: 5,
          material: Cesium.Color.RED
        }
      },
      polylineVolume: {
        name: "Red tube with rounded corners",
        polylineVolume: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            85.0,
            32.0,
            85.0,
            36.0,
            89.0,
            36.0
          ]),
          shape: this.computeCircle(60000.0),
          material: Cesium.Color.RED
        }
      },
      rectangle: {
        name: "Red translucent rectangle with outline",
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(80.0, 20.0, 110.0, 25.0),
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.RED
        }
      },
      sphere: {
        name: "Red sphere with black outline",
        position: Cesium.Cartesian3.fromDegrees(107.0, 40.0, 300000.0),
        ellipsoid: {
          radii: new Cesium.Cartesian3(300000.0, 300000.0, 300000.0),
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }
      },
      ellipsoid: {
        name: "Blue ellipsoid",
        position: Cesium.Cartesian3.fromDegrees(114.0, 40.0, 300000.0),
        ellipsoid: {
          radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0),
          material: Cesium.Color.BLUE
        }
      },
      wall: {
        name: "Green wall from surface with outline",
        wall: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            107.0,
            43.0,
            100000.0,
            97.0,
            43.0,
            100000.0,
            97.0,
            40.0,
            100000.0,
            107.0,
            40.0,
            100000.0,
            107.0,
            43.0,
            100000.0
          ]),
          material: Cesium.Color.GREEN
        }
      },
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
    };
    this.properties = {
      sampleProperty: {
        name: "box",
        type: "box"
      },
      positionProperty: {
        name: "gltf",
        type: "model"
      },
      compositeProperty: {
        name: "box",
        type: "box"
      }
    };
  },
  methods: {
    getViewer(v) {
      this.viewer = v;
      this.addNameOverLay();

      this.rejectPickerEvent();
    },
    initEntity(name) {
      let entity = this.entities[name];
      if (entity) {
        this.viewer.entities.add(entity);
      } else {
        let option = this.entitiyOption[name];
        entity = this.viewer.entities.add(option);
      }
      return entity;
    },
    initTime() {
      this.viewer.clock.startTime = this.starttime.clone();
      this.viewer.clock.stopTime = this.stoptime.clone();
      this.viewer.clock.currentTime = this.starttime.clone();
      this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      this.viewer.clock.multiplier = 50000;
      this.viewer.clock.shouldAnimate = true;
      this.viewer.timeline.zoomTo(this.starttime, this.stoptime);
    },
    getEntity(n) {
      this.viewer.entities.removeAll();
      this.curName = n;
      let entity = this.initEntity(n);
      this.viewer.zoomTo(entity);
      this.viewer.clock.shouldAnimate = false;
    },

    computeCircle(radius) {
      var positions = [];
      for (var i = 0; i < 360; i++) {
        var radians = Cesium.Math.toRadians(i);
        positions.push(
          new Cesium.Cartesian2(
            radius * Math.cos(radians),
            radius * Math.sin(radians)
          )
        );
      }
      return positions;
    },
    getProperty(n) {
      this.viewer.entities.removeAll();
      this.curName = n;
      let p = this.properties[n];
      let entity = this.initEntity(p.name);
      if (n == "compositeProperty") {
        this.getCompositeProperty(entity, p.type);
      } else if (n == "positionProperty") {
        this.getPositionProperty(entity, p.type);
      } else {
        this.getSampleProperty(entity, p.type);
      }
    },

    getSampleProperty(entityObj, type) {
      this.initTime();
      var property = new Cesium.SampledProperty(Cesium.Cartesian3);
      property.addSample(
        this.starttime,
        new Cesium.Cartesian3(100000.0, 100000.0, 200000.0)
      );
      property.addSample(
        this.stoptime,
        new Cesium.Cartesian3(400000.0, 300000.0, 700000.0)
      );

      //blueBox.box.dimensions = property;
      entityObj[type].dimensions = property;

      var colorProperty = new Cesium.SampledProperty(Cesium.Color);
      colorProperty.addSample(this.starttime, new Cesium.Color(0, 1, 0));
      colorProperty.addSample(this.stoptime, new Cesium.Color(0, 0, 1));

      entityObj[type].material = new Cesium.ColorMaterialProperty(
        colorProperty
      );

      this.viewer.zoomTo(entityObj);
    },
    getPositionProperty(entityObj, type) {
      this.initTime();
      var property = new Cesium.SampledPositionProperty();

      property.addSample(
        this.starttime,
        Cesium.Cartesian3.fromDegrees(
          this.defaultPoint[0],
          this.defaultPoint[1],
          300000.0
        )
      );

      property.addSample(
        this.stoptime,
        Cesium.Cartesian3.fromDegrees(
          this.defaultPoint[0] + 5,
          this.defaultPoint[1] + 5,
          300000.0
        )
      );

      //blueBox.box.dimensions = property;
      entityObj.position = property;
      this.viewer.zoomTo(entityObj);
    },
    getCompositeProperty(entityObj, type) {
      this.initTime();
      var sampledProperty = new Cesium.SampledProperty(Cesium.Cartesian3);
      sampledProperty.addSample(
        Cesium.JulianDate.fromIso8601("2019-03-01T00:00:00.00Z"),
        new Cesium.Cartesian3(400000.0, 300000.0, 200000.0)
      );

      sampledProperty.addSample(
        Cesium.JulianDate.fromIso8601("2019-03-02T00:00:00.00Z"),
        new Cesium.Cartesian3(400000.0, 300000.0, 400000.0)
      );
      var ticProperty = new Cesium.TimeIntervalCollectionProperty();
      ticProperty.intervals.addInterval(
        Cesium.TimeInterval.fromIso8601({
          iso8601: "2019-03-02T00:00:00.00Z/2019-03-02T06:00:00.00Z",
          isStartIncluded: true,
          isStopIncluded: false,
          data: new Cesium.Cartesian3(400000.0, 300000.0, 400000.0)
        })
      );
      ticProperty.intervals.addInterval(
        Cesium.TimeInterval.fromIso8601({
          iso8601: "2019-03-02T06:00:00.00Z/2019-03-04T12:00:00.00Z",
          isStartIncluded: true,
          isStopIncluded: false,
          data: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0)
        })
      );
      ticProperty.intervals.addInterval(
        Cesium.TimeInterval.fromIso8601({
          iso8601: "2019-03-04T12:00:00.00Z/2019-03-04T18:00:00.00Z",
          isStartIncluded: true,
          isStopIncluded: false,
          data: new Cesium.Cartesian3(400000.0, 300000.0, 600000.0)
        })
      );
      ticProperty.intervals.addInterval(
        Cesium.TimeInterval.fromIso8601({
          iso8601: "2019-03-04T18:00:00.00Z/2019-03-05T23:00:00.00Z",
          isStartIncluded: true,
          isStopIncluded: true,
          data: new Cesium.Cartesian3(400000.0, 300000.0, 700000.0)
        })
      );
      var compositeProperty = new Cesium.CompositeProperty();
      compositeProperty.intervals.addInterval(
        Cesium.TimeInterval.fromIso8601({
          iso8601: "2019-03-01T00:00:00.00Z/2019-03-02T00:00:00.00Z",
          data: sampledProperty
        })
      );
      compositeProperty.intervals.addInterval(
        Cesium.TimeInterval.fromIso8601({
          iso8601: "2019-03-02T00:00:00.00Z/2019-03-05T00:00:00.00Z",
          isStartIncluded: false,
          isStopIncluded: false,
          data: ticProperty
        })
      );

      //blueBox.box.dimensions = property;
      entityObj[type].dimensions = compositeProperty;
      this.viewer.zoomTo(entityObj);
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

