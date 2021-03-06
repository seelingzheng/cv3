<template>
  <div class="draw-page">
    <div id="cesiumContainer"></div>
    <div id="toolbar"></div>
    <div id="logging"></div>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import DrawHelper from "@/assets/libs/DrawHelper/DrawHelper.js";
import "@/assets/libs/DrawHelper/DrawHelper.css";

import { BaseCesium } from "@/components";
import marker from "@/assets/libs/DrawHelper/img/glyphicons_242_google_maps.png";
export default {
  components: {
    BaseCesium
  },
  data() {
    return {
      logging: null
    };
  },

  mounted() {
    this.initDrawHelper();
    this.logging = document.getElementById("logging");
  },
  methods: {
    initDrawHelper() {
      let vm = this;
      // create the almighty cesium widget
      var cesiumWidget = new Cesium.CesiumWidget("cesiumContainer", {
        scene3DOnly: true
      });
      var scene = cesiumWidget.scene;
      scene.globe.depthTestAgainstTerrain = false; //地形遮挡
      var drawHelper = new DrawHelper(cesiumWidget);
      var toolbar = drawHelper.addToolbar(document.getElementById("toolbar"), {
        buttons: ["marker", "polyline", "polygon", "circle", "extent"] //
      });
      toolbar.addListener("markerCreated", function(event) {
        vm.loggingMessage("Marker created at " + event.position.toString());
        // create one common billboard collection for all billboards
        var b = new Cesium.BillboardCollection();
        scene.primitives.add(b);
        var billboard = b.add({
          show: true,
          position: event.position,
          pixelOffset: new Cesium.Cartesian2(0, 0),
          eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          scale: 1.0,
          image: marker,

          color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
        });
        billboard.setEditable();
      });
      toolbar.addListener("polylineCreated", function(event) {
        vm.loggingMessage(
          "Polyline created with " + event.positions.length + " points"
        );
        var polyline = new DrawHelper.PolylinePrimitive({
          positions: event.positions,
          width: 5,
          geodesic: true
        });
        scene.primitives.add(polyline);
        polyline.setEditable();
        polyline.addListener("onEdited", function(event) {
          vm.loggingMessage(
            "Polyline edited, " + event.positions.length + " points"
          );
        });
      });
      toolbar.addListener("polygonCreated", function(event) {
        vm.loggingMessage(
          "Polygon created with " + event.positions.length + " points"
        );
        var polygon = new DrawHelper.PolygonPrimitive({
          positions: event.positions,
          material: Cesium.Material.fromType("Checkerboard")
        });
        scene.primitives.add(polygon);
        polygon.setEditable();
        polygon.addListener("onEdited", function(event) {
          vm.loggingMessage(
            "Polygon edited, " + event.positions.length + " points"
          );
        });
      });
      toolbar.addListener("circleCreated", function(event) {
        vm.loggingMessage(
          "Circle created: center is " +
            event.center.toString() +
            " and radius is " +
            event.radius.toFixed(1) +
            " meters"
        );
        var circle = new DrawHelper.CirclePrimitive({
          center: event.center,
          radius: event.radius,
          material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
        });
        scene.primitives.add(circle);
        circle.setEditable();
        circle.addListener("onEdited", function(event) {
          vm.loggingMessage(
            "Circle edited: radius is " + event.radius.toFixed(1) + " meters"
          );
        });
      });
      toolbar.addListener("extentCreated", function(event) {
        var extent = event.extent;
        vm.loggingMessage(
          "Extent created (N: " +
            extent.north.toFixed(3) +
            ", E: " +
            extent.east.toFixed(3) +
            ", S: " +
            extent.south.toFixed(3) +
            ", W: " +
            extent.west.toFixed(3) +
            ")"
        );
        var extentPrimitive = new DrawHelper.ExtentPrimitive({
          extent: extent,
          material: Cesium.Material.fromType(Cesium.Material.StripeType)
        });
        scene.primitives.add(extentPrimitive);
        extentPrimitive.setEditable();
        extentPrimitive.addListener("onEdited", function(event) {
          loggingMessage(
            "Extent edited: extent is (N: " +
              event.extent.north.toFixed(3) +
              ", E: " +
              event.extent.east.toFixed(3) +
              ", S: " +
              event.extent.south.toFixed(3) +
              ", W: " +
              event.extent.west.toFixed(3) +
              ")"
          );
        });
      });
    },

    loggingMessage(message) {
      this.logging.innerHTML = message;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.draw-page {
  #cesiumContainer {
    // position: absolute;
    top: 0px;
    left: 0;
    height: calc(100vh);
    width: 100%;
    margin: 0;
    overflow: hidden;
    padding: 0;
    font-family: sans-serif;
  }
  #toolbar {
    position: absolute;
    top: 10px;
    display: inline;
    margin: 10px;
    padding: 0px;
    background: white;
  }
  #logging {
    position: absolute;
    bottom: 0px;
    right: 0;
    display: inline;
    margin: 10px;
    padding: 10px;
    background: white;
  }
}
</style>

