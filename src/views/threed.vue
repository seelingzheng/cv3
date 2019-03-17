<template>
  <div>
    <base-three @getThree="getThree"></base-three>
    <base-three @getThree="getThree"></base-three>
  </div>
</template>

<script>
import * as THREE from "three";
import { BaseThree } from "@/components";
export default {
  name: "",
  components: {
    BaseThree
  },

  data() {
    return {
      three: {
        scene: null,
        camera: null,
        renderer: null,
        threeDom: null
      }
    };
  },

  methods: {
    getThree(t) {
      this.three = t;
      var geometry = new THREE.BoxGeometry(100, 100, 100);
      var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      var cube = new THREE.Mesh(geometry, material);
      console.log(cube);
      this.three.scene.add(cube);
      this.three.renderer.render(this.three.scene, this.three.camera);
    }
  }
};
</script>

<style lang = 'scss' scoped >
</style>