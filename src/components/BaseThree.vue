<template>
  <div id="basethree"></div>
</template>
<script>
import * as THREE from "three";

export default {
  props: ["options"],
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null
    };
  },
  mounted() {
    let opt = {
      fov: 45,
      far: 1000,
      near: 0.1,
      aspect: window.innerWidth / window.innerHeight,
      alpha: false
    };

    opt = Object.assign(opt, this.options);

    var baseDom = document.getElementById("basethree");
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      opt.fov,
      opt.aspect,
      opt.near,
      opt.far
    );

    this.renderer = new THREE.WebGLRenderer({
      alpha: opt.alpha
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    baseDom.appendChild(this.renderer.domElement);

    this.$emit("getThree", {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      threeDom: baseDom
    });
  }
};
</script>

<style lang="scss"  scoped>
#basethree {
  position: absolute;
   width: 84%;
  height: calc(100vh);
  pointer-events: none;
}
</style>
