<template>
  <div id="app">
    <el-row class="row-bg tac">
      <el-col :span="4" class="menu-container">
        <div class="grid-content bg-purple">
          <div class="banner">
            <img src="images/cesium.png" alt="cesium">
            Cesium 案例集
          </div>

          <el-menu
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="fa fa-map"></i>
                <span slot="title">&nbsp;基础使用</span>
              </template>
              <!-- <el-menu-item-group> -->
              <span slot="title"></span>
              <el-menu-item index="1-1" :route="{path:'/'}">Hello</el-menu-item>
              <el-menu-item index="1-2" :route="{path:'/basepick'}">BaseLayerPicker</el-menu-item>
              <el-menu-item index="1-3" :route="{path:'/terrain'}">TerrainProvider</el-menu-item>
              <el-menu-item index="1-4" :route="{path:'/imagery'}">ImageryProvider</el-menu-item>
              <el-menu-item index="1-5" :route="{path:'/eapi'}">EntityAPI</el-menu-item>
              <el-menu-item index="1-6" :route="{path:'/primitives'}">PrimitiveAPI</el-menu-item>
              <el-menu-item index="1-7" :route="{path:'/materials'}">Materials</el-menu-item>
              <el-menu-item index="1-8" :route="{path:'/event'}">Event</el-menu-item>
              <!-- </el-menu-item-group> -->
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="fa fa-internet-explorer"></i>
                <span slot="title">&nbsp;工具使用</span>
              </template>
              <el-menu-item index="2-1" :route="{path:'/tip'}">ToolTip</el-menu-item>
              <el-menu-item index="2-2" :route="{path:'/t_cthree'}">Cesium&Three</el-menu-item>
              <el-menu-item index="2-3" :route="{path:'/t_aqi'}">AQI</el-menu-item>
              <!-- <el-menu-item index="2-3" :route="{path:'/threed'}">ThreeDemo</el-menu-item> -->
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="fa fa-internet-explorer"></i>
                <span slot="title">&nbsp;服务使用</span>
              </template>
              <el-menu-item index="3-1" :route="{path:'/geojson_ds'}">GeoJSON</el-menu-item>
              <!-- <el-menu-item index="2-2" :route="{path:'/t_cthree'}">Cesium&Three</el-menu-item>
              <el-menu-item index="2-3" :route="{path:'/t_aqi'}">AQI</el-menu-item>
              <el-menu-item index="2-3" :route="{path:'/threed'}">ThreeDemo</el-menu-item>-->
            </el-submenu>
            <el-submenu index="10">
              <template slot="title">
                <i class="fa fa-internet-explorer"></i>
                <span slot="title">&nbsp;综合案例</span>
              </template>
              <el-menu-item-group>
                <span slot="title">Shader</span>
                <el-menu-item index="3-1" :route="{path:'/shaders'}">Shaders</el-menu-item>
                <!-- <el-menu-item index="2-2" :route="{path:'/materials'}">Materials</el-menu-item> -->
                <!-- <el-menu-item
                  index="2-3"
                  :route='{path:"/heatmap"}'
                >Heatmap
                </el-menu-item>-->
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <router-view/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false,
      pullV: 0
    };
  },
  methods: {
    showHide() {
      this.isCollapse = !this.isCollapse;
      if (isCollapse) {
        this.pullV = 2;
      } else {
        this.pullV = 0;
      }
    },
    handleSelect(index, indexPath) {
      console.log(index, indexPath);
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
};
</script>

<style lang='scss' scope>
body {
  margin: 0;
  padding: 0;
}
#app {
  user-select: none;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  .el-menu {
    border-right: 0;
  }
  .menu-container {
    background-color: #545c64;
    color: #fff;
    height: calc(100vh);
  }
  .banner {
    display: flex;
    line-height: 60px;
    margin-left: 25px;
    img {
      width: 60px;
      height: 60px;
    }
  }
  .btn-box {
    user-select: none;
    position: absolute;
    width: 80%;
    right: 10px;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    background: #0c0c7566;
    border-radius: 5px;
    &-item {
      cursor: pointer;
      padding: 3px;
      color: white;
      &:hover,
      &-selected {
        color: aqua;
      }
    }
  }
}
</style>
