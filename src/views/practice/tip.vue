<template>
  <div>
    <btn class="btn-box">
      <div
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName=='label'}"
        @click="getTooltip('label')"
      >Label</div>
      <div
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName=='div'}"
        @click="getTooltip('div')"
      >DivTooltip</div>
    </btn>
    <base-cesium @getViewer="getViewer" :imgurl="imgurl"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import {BaseCesium} from "@/components";

//初始化LabeTooltip

var LabelTooltip = (() => {
  let isInit = false,
    viewer = null,
    labelEntity = null;
  function LabelTooltip() {}
  LabelTooltip.Init = _viewer => {
    if (isInit) return;
    viewer = _viewer;
    labelEntity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(0, 0),
      label: {
        text: "提示",
        font: "15px sans-serif",
        pixelOffset: new Cesium.Cartesian2(8, 8), //y大小根据行数和字体大小改变
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        showBackground: true,
        backgroundColor: new Cesium.Color(0.3, 0.3, 0.3, 0.5)
      }
    });
    labelEntity.show = false;
    isInit = true;
  };
  LabelTooltip.setVisible = v => {
    if (!isInit) {
      return;
    }
    labelEntity.show = v ? true : false;
  };
  LabelTooltip.showAt = (position, info) => {
    if (!isInit) {
      return;
    }
    if (position && info) {
      labelEntity.show = true;
      var cartesian = viewer.camera.pickEllipsoid(
        position,
        viewer.scene.globe.ellipsoid
      );
      if (cartesian) {
        labelEntity.position = cartesian;
        labelEntity.show = true;
        labelEntity.label.text = info;
      } else {
        labelEntity.show = false;
      }
    }
  };

  return LabelTooltip;
})();

var TooltipDiv = (() => {
  let isInit = false;
  function TooltipDiv() {}
  TooltipDiv.Init = function(frameDiv) {
    if (isInit) {
      return;
    }

    var div = document.createElement("DIV");
    div.className = "tooltipdiv right"; //

    var arrow = document.createElement("DIV");
    arrow.className = "tooltipdiv-arrow";
    div.appendChild(arrow);

    var title = document.createElement("DIV");
    title.className = "tooltipdiv-inner";
    div.appendChild(title);

    this._div = div;
    this._title = title;

    frameDiv.appendChild(div);

    isInit = true;
  };

  TooltipDiv.setVisible = function(visible) {
    if (!isInit) {
      return;
    }
    this._div.style.display = visible ? "block" : "none";
  };

  TooltipDiv.showAt = function(position, message) {
    if (!isInit) {
      return;
    }
    if (position && message) {
      this.setVisible(true);
      this._title.innerHTML = message;
      this._div.style.position = "absolute";
      this._div.style.left = position.x + 10 + "px";
      this._div.style.color = "#FFFFFF";
      this._div.style.top = position.y - this._div.clientHeight / 2 + "px";
    }
  };
  return TooltipDiv;
})();

export default {
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: null,
      curName: "",
      LabelTooltip,
      TooltipDiv,
      imgurl: "/images/world.jpg"
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      v.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask: true, // required for water effects
        requestVertexNormals: true // required for terrain lighting
      });
      // 打开深度检测，那么在地形以下的对象不可见
      v.scene.globe.depthTestAgainstTerrain = true;
      // 开启全球光照
      v.scene.globe.enableLighting = true;
    },
    getTooltip(type) {
      this.curName = type;
      this.rejectEvent();
      if (this.curName == "label") this.LabelTooltip.Init(this.viewer);
      else this.TooltipDiv.Init(this.viewer.cesiumWidget.container);
    },
    rejectEvent() {
      let vm = this;
      let handler = vm.viewer.cesiumWidget.screenSpaceEventHandler;
      // let handler = new Cesium.ScreenSpaceEventHandler(
      //   this.viewer.scene.canvas
      // );
      let ellipsoid = vm.viewer.scene.globe.ellipsoid;
      handler.setInputAction(function(movement) {
        let cartesian = vm.viewer.camera.pickEllipsoid(
          movement.endPosition,
          ellipsoid
        );
        if (cartesian) {
          if (vm.curName == "label")
            vm.LabelTooltip.showAt(
              movement.endPosition,
              `move:${movement.endPosition}`
            );
          else {
            vm.TooltipDiv.showAt(
              movement.endPosition,
              `move:${movement.endPosition}`
            );
          }
        } else {
          if (vm.curName == "label") vm.LabelTooltip.setVisible(false);
          else vm.TooltipDiv.setVisible(false);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.tooltipdiv {
  display: block;
  position: absolute;
  visibility: visible;
  max-width: 200px;
  min-width: 100px;
  padding: 1px 1px 1px 25px;
  font-size: 11px;
  z-index: 1000;
  opacity: 0.8;
  -khtml-opacity: 0.8;
  -moz-opacity: 0.8;

  filter: alpha(opacity=80);
}
.tooltipdiv.left .tooltipdiv-arrow {
  top: 50%;
  right: 0;
  margin-top: -5px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 25px solid #000000;
}
.tooltipdiv.right .tooltipdiv-arrow {
  top: 50%;
  left: 0;
  margin-top: -5px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 25px solid #000000;
}
.tooltipdiv-inner {
  padding: 3px 8px;
  color: white;
  background: rgba(12, 12, 12, 0.5);
  text-align: center;
  max-width: 200px;
  text-decoration: none;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.tooltipdiv-arrow {
  position: absolute;
  width: 0;
  height: 0;
}
</style>
