<template>
  <div class="shaders">
    <btn class="btn-box">
      <div
        class="btn-box-item"
        :class="{'btn-box-item-selected':curShaderName=='rain'}"
        @click="getRain('rain')"
      >Rain</div>
      <div
        class="btn-box-item"
        :class="{'btn-box-item-selected':curShaderName=='snow'}"
        @click="getSnow('snow')"
      >Snow</div>
    </btn>
    <base-cesium @getViewer="getViewer"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import BaseCesium from "@/components/BaseCesium";
import { snow, rain } from "@/assets/libs/Shaders.js";
export default {
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: null,
      curShaderStage: null,
      curShaderName: "rain"
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      this.getRain("rain");
    },
    addShader() {
      if (this.curShaderStage)
        this.viewer.scene.postProcessStages.add(this.curShaderStage);
      this.viewer.scene.skyAtmosphere.hueShift = -0.8;
      this.viewer.scene.skyAtmosphere.saturationShift = -0.7;
      this.viewer.scene.skyAtmosphere.brightnessShift = -0.33;

      this.viewer.scene.fog.density = 0.001;
      this.viewer.scene.fog.minimumBrightness = 0.8;
    },
    removeShaderStage() {
      if (this.curShaderStage)
        this.viewer.scene.postProcessStages.remove(this.curShaderStage);
    },
    resetShaderStage(shader) {
      this.removeShaderStage();
      this.curShaderStage = new Cesium.PostProcessStage({
        fragmentShader: shader
      });
      this.addShader();
    },
    getRain(n) {
      this.curShaderName = n;
      this.resetShaderStage(rain);
    },
    getSnow(n) {
      this.curShaderName = n;
      this.resetShaderStage(snow);
    }
  }
};
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>
