<template>
  <div>
    <base-cesium @getViewer="getViewer"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import BaseCesium from "@/components/BaseCesium";

export default {
  name: "HelloCessium",
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: null
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      // 删除默认的影像图层
      v.imageryLayers.remove(v.imageryLayers.get(0));

      // 增加谷歌影像底图
      v.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: "http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}",
          tilingScheme: new Cesium.WebMercatorTilingScheme()
        })
      );
      v.terrainProvider = Cesium.createWorldTerrain({
        requestWaterMask: true, // required for water effects
        requestVertexNormals: true // required for terrain lighting
      });
      // 打开深度检测，那么在地形以下的对象不可见
      v.scene.globe.depthTestAgainstTerrain = true;
      // 开启全球光照
      v.scene.globe.enableLighting = true;
      this.addRainShader(v);
    },
    addRainShader(v) {
      var snow = `uniform sampler2D colorTexture;//输入的场景渲染照片
varying vec2 v_textureCoordinates;

float hash(float x){
    return fract(sin(x*133.3)*13.13);
 }
 
 void main(void){
 
    float time = czm_frameNumber / 60.0;
    vec2 resolution = czm_viewport.zw;
 
    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
    vec3 c=vec3(.6,.7,.8);
  
    float a=-.4;
    float si=sin(a),co=cos(a);
    uv*=mat2(co,-si,si,co);
    uv*=length(uv+vec2(0,4.9))*.3+1.;
 
    float v=1.-sin(hash(floor(uv.x*100.))*2.);
    float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;
    c*=v*b; //屏幕上雨的颜色

    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5); //将雨和三维场景融合
}`;

      v.scene.postProcessStages.add(
        new Cesium.PostProcessStage({
          fragmentShader: snow
        })
      );
      v.scene.skyAtmosphere.hueShift = -0.8;
      v.scene.skyAtmosphere.saturationShift = -0.7;
      v.scene.skyAtmosphere.brightnessShift = -0.33;

      v.scene.fog.density = 0.001;
      v.scene.fog.minimumBrightness = 0.8;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
