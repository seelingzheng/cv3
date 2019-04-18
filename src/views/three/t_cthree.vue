<template>
  <div>
    <base-cesium @getViewer="getViewer" :imgurl="imgurl" :options="options"></base-cesium>
    <base-three @getThree="getThree" :options="threeoptions"></base-three>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import * as THREE from "three";

import { BaseCesium, BaseThree } from "@/components";
export default {
  components: {
    BaseCesium,
    BaseThree
  },
  data() {
    return {
      isCesium: false,
      isThree: false,
      // imgurl: "/images/world.jpg",
      // boundaries in WGS84 around the object
      minWGS84: [115.23, 39.55],
      maxWGS84: [116.23, 41.55],

      objects3D: [], //Could be any Three.js object mesh
      viewer: null,
      three: {
        scene: null,
        camera: null,
        renderer: null,
        threeDom: null
      },
      options: {
        useDefaultRenderLoop: false,
        selectionIndicator: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        infoBox: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        allowTextureFilterAnisotropic: false,
        contextOptions: {
          webgl: {
            alpha: false,
            antialias: true,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
            depth: true,
            stencil: false,
            anialias: false
          }
        },
        targetFrameRate: 60,
        resolutionScale: 0.1,
        orderIndependentTranslucency: true,
        imageryProvider: undefined,
        baseLayerPicker: false,
        geocoder: false,
        automaticallyTrackDataSourceClocks: false,
        dataSources: null,
        clock: null,
        terrainShadows: Cesium.ShadowMode.DISABLED
      },
      threeoptions: {
        far: 10 * 1000 * 1000,
        near: 1,
        alpha: true
      }
    };
  },
  mounted() {},
  methods: {
    getViewer(v) {
      this.isCesium = true;
      this.viewer = v;
      //center Cartesian3
      let x = (this.minWGS84[0] + this.maxWGS84[0]) / 2;
      let y = (this.minWGS84[1] + this.maxWGS84[1]) / 2 - 1;
      let center = Cesium.Cartesian3.fromDegrees(x, y, 2000);
      //zoom point
      this.viewer.camera.flyTo({
        destination: center,
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-60),
          roll: Cesium.Math.toRadians(0)
        },
        duration: 3
      });
      this.doInit();
    },
    getThree(threeObj) {
      this.isThree = true;
      this.three = threeObj;
      this.doInit();
    },

    doInit() {
      if (this.isCesium && this.isThree) {
        this.init3DObject();
        this.loop();
      }
    },
    Object3D() {
      //THREEJS 3DObject.mesh
      this.threeMesh = null;
      //location bounding box
      this.minWGS84 = null;
      this.maxWGS84 = null;
    },
    init3DObject() {
      let vm = this;

      //Cesium entity
      var entity = {
        name: "Polygon",
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            vm.minWGS84[0],
            vm.minWGS84[1],
            vm.maxWGS84[0],
            vm.minWGS84[1],
            vm.maxWGS84[0],
            vm.maxWGS84[1],
            vm.minWGS84[0],
            vm.maxWGS84[1]
          ]),
          material: Cesium.Color.RED.withAlpha(0.2)
        }
      };
      var Polygon = vm.viewer.entities.add(entity);

      //Three.js Objects
      // Lathe geometry

      var geometry = new THREE.BoxGeometry(100, 100, 100);
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      var cubeMesh = new THREE.Mesh(geometry, material);

      cubeMesh.scale.set(1500, 1500, 1500); //scale object to be visible at planet scale
      cubeMesh.position.z += 15000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
      cubeMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system
      var cubeup = new THREE.Group();
      cubeup.add(cubeMesh);
      vm.three.scene.add(cubeMesh);

      let boxObject3D = new vm.Object3D();
      boxObject3D.threeMesh = cubeMesh;
      boxObject3D.minWGS84 = vm.minWGS84;
      boxObject3D.maxWGS84 = vm.maxWGS84;
      vm.objects3D.push(boxObject3D);
      vm.three.renderer.render(vm.three.scene, vm.three.camera);
    },

    renderThreeObj(Obj) {
      let vm = this;
      var cartToVec = function(cart) {
        return new THREE.Vector3(cart.x, cart.y, cart.z);
      };
      var center = Cesium.Cartesian3.fromDegrees(
        (Obj.minWGS84[0] + Obj.maxWGS84[0]) / 2,
        (Obj.minWGS84[1] + Obj.maxWGS84[1]) / 2
      );

      // get forward direction for orienting model
      var centerHigh = Cesium.Cartesian3.fromDegrees(
        (Obj.minWGS84[0] + Obj.maxWGS84[0]) / 2,
        (Obj.minWGS84[1] + Obj.maxWGS84[1]) / 2,
        1
      );

      // use direction from bottom left to top left as up-vector
      var bottomLeft = cartToVec(
        Cesium.Cartesian3.fromDegrees(Obj.minWGS84[0], Obj.minWGS84[1])
      );
      var topLeft = cartToVec(
        Cesium.Cartesian3.fromDegrees(Obj.minWGS84[0], Obj.maxWGS84[1])
      );
      var latDir = new THREE.Vector3()
        .subVectors(bottomLeft, topLeft)
        .normalize();

      // configure entity position and orientation
      Obj.threeMesh.position.copy(center);
      Obj.threeMesh.lookAt(centerHigh);
      Obj.threeMesh.up.copy(latDir);
    },
    resetThreeCamera() {
      let vm = this;
      // register Three.js scene with Cesium
      vm.three.camera.fov = Cesium.Math.toDegrees(
        vm.viewer.camera.frustum.fovy
      ); // ThreeJS FOV is vertical
      vm.three.camera.updateProjectionMatrix();

      if (vm.objects3D.length > 0) {
        vm.objects3D.forEach(o => {
          vm.renderThreeObj(o);
        });
      }

      // Clone Cesium Camera projection position so the
      // Three.js Object will appear to be at the same place as above the Cesium Globe
      vm.three.camera.matrixAutoUpdate = false;
      var cvm = vm.viewer.camera.viewMatrix;
      var civm = vm.viewer.camera.inverseViewMatrix;
      vm.three.camera.matrixWorld.set(
        civm[0],
        civm[4],
        civm[8],
        civm[12],
        civm[1],
        civm[5],
        civm[9],
        civm[13],
        civm[2],
        civm[6],
        civm[10],
        civm[14],
        civm[3],
        civm[7],
        civm[11],
        civm[15]
      );
      vm.three.camera.matrixWorldInverse.set(
        cvm[0],
        cvm[4],
        cvm[8],
        cvm[12],
        cvm[1],
        cvm[5],
        cvm[9],
        cvm[13],
        cvm[2],
        cvm[6],
        cvm[10],
        cvm[14],
        cvm[3],
        cvm[7],
        cvm[11],
        cvm[15]
      );
      vm.three.camera.lookAt(new THREE.Vector3(0, 0, 0));
      var width = vm.three.threeDom.clientWidth;
      var height = vm.three.threeDom.clientHeight;
      var aspect = width / height;
      vm.three.camera.aspect = aspect;
      vm.three.camera.updateProjectionMatrix();
      vm.three.renderer.setSize(width, height);
      vm.three.renderer.render(vm.three.scene, vm.three.camera);
    },
    loop() {
      requestAnimationFrame(this.loop);
      this.viewer.render();
      this.resetThreeCamera();
    }
  }
};
</script>

<style lang = 'scss' scoped >
</style>