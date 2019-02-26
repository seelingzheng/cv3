<template>
  <div id="app">
    <el-row
      type="flex"
      class="row-bg"
    >
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <!-- <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/cesium">cesium</router-link>
          </div> -->
          <div>
            <div
              v-if="!isCollapse"
              @click="showHide()"
            >
              Cesium 案例集 <i class="el-icon-menu"></i>
            </div>
            <div
              v-else
              @click="showHide()"
            >
              <i class="el-icon-menu"></i></div>

          </div>
          <el-menu
            default-active="1-1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            router
          >

            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">官方案例</span>
              </template>
              <el-menu-item-group>
                <span slot="title">官方案例</span>
                <el-menu-item
                  index="1-1"
                  :route='{path:"/"}'
                >Hello
                </el-menu-item>
                <el-menu-item
                  index="1-2"
                  :route='{path:"/eapi"}'
                >EntityAPI</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <router-view />
        </div>
      </el-col>

    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    showHide() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpen() {},
    handleClose() {}
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  user-select: none;

  min-height: calc(100vh);
}
</style>
