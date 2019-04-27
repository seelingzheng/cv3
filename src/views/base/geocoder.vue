<template>
  <div>
    <div class="btn-box">
      <div
        v-for="(item, index) in services"
        :key="index"
        class="btn-box-item"
        :class="{'btn-box-item-selected':curName==item}"
        @click="changeServer(item)"
      >{{item}}</div>
    </div>
    <base-cesium @getViewer="getViewer" :options="options"></base-cesium>
  </div>
</template>

<script>
import Cesium from "cesium/Cesium";
import { BaseCesium } from "@/components";
import { gcj02towgs84 } from "./../../utils//transfer";
export default {
  components: {
    BaseCesium
  },
  data() {
    return {
      viewer: undefined,
      geocoder: undefined,
      options: {
        geocoder: true
      },
      services: ["超图POI", "高德"],
      curName: "超图POI"
    };
  },

  mounted() {},
  methods: {
    getViewer(v) {
      this.viewer = v;
      this.geocoder = this.viewer.geocoder.viewModel;

      this.resetGeocoder();
    },
    changeServer(n) {
      this.curName = n;
    },
    resetGeocoder() {
      let vm = this;
      vm.geocoder._searchCommand = Cesium.createCommand(() => {
        if (vm.geocoder.isSearchInProgress) {
          vm.cancelGeocode(vm.geocoder);
        } else {
          vm.geocode(vm.geocoder);
        }
      });
    },
    cancelGeocode(viewModel) {
      viewModel._isSearchInProgress = false;
      if (Cesium.defined(viewModel._geocodeInProgress)) {
        viewModel._geocodeInProgress.cancel = true;
        viewModel._geocodeInProgress = undefined;
      }
    },
    geocode(viewModel) {
      var query = viewModel.searchText;
      if (/^\s*$/.test(query)) {
        //whitespace string
        return;
      }
      // If the user entered (longitude, latitude, [height]) in degrees/meters,
      // fly without calling the geocoder.
      var splitQuery = query.match(/[^\s,\n]+/g);
      if (splitQuery.length === 2 || splitQuery.length === 3) {
        var longitude = +splitQuery[0];
        var latitude = +splitQuery[1];
        var obj = gcj02towgs84(longitude, latitude);
        var height = splitQuery.length === 3 ? +splitQuery[2] : 300.0;
        if (!isNaN(longitude) && !isNaN(latitude) && !isNaN(height)) {
          updateCamera(
            viewModel,
            Cesium.Cartesian3.fromDegrees(obj.lon, obj.lat, height)
          );
          return;
        }
      }
      viewModel._isSearchInProgress = true;
      if (this.curName == "超图POI") {
        this.useSM_POI(viewModel, query);
      } else {
        this.useAMap(viewModel, query);
      }
    },
    useSM_POI(viewModel, query) {
      let vm = this;
      var smPOI =
        "http://www.supermapol.com/iserver/services/localsearch/rest/searchdatas/China/poiinfos.jsonp";
      var promise = Cesium.Resource.fetchJsonp({
        url: smPOI,
        queryParameters: {
          keywords: query,
          city: "北京市",
          location: "",
          radius: "",
          leftLocation: "",
          rightLocation: "",
          pageSize: 50,
          pageNum: 1,
          key: "CmjIKHpkMDoXiXe1ow1KGeLy" // your personal key, you can get it from SuperMap Online
        },
        callbackParameterName: "callback",
        jsonpName: "callBack"
      });
      var geocodeInProgress = (viewModel._geocodeInProgress = Cesium.when(
        promise,
        function(result) {
          if (geocodeInProgress.cancel) {
            return;
          }
          viewModel._isSearchInProgress = false;
          if (result.length === 0 || result.totalHints === 0) {
            viewModel.searchText = viewModel._searchText + " (not found)";
            return;
          }
          if (Cesium.defined(viewModel.entities)) {
            for (var i = 0; i < viewModel.entities.length; i++) {
              vm.viewer.entities.remove(viewModel.entities[i]);
            }
          }
          viewModel.entities = [];
          var obj;
          for (var i = 0; i < result.poiInfos.length; i++) {
            var resource = result.poiInfos[i];
            viewModel._searchText = resource.name;
            var location = resource.location;
            obj = gcj02towgs84(location.x, location.y);
            var entity = {
              id: resource.name + i,
              position: Cesium.Cartesian3.fromDegrees(obj[0], obj[1]),
              point: {
                show: true, // default
                color: Cesium.Color.SKYBLUE, // default: WHITE
                pixelSize: 10, // default: 1
                outlineColor: Cesium.Color.YELLOW, // default: BLACK
                outlineWidth: 3 // default: 0
              }
            };
            entity.description = new Cesium.ConstantProperty(resource.name);
            viewModel.entities.push(entity);
            vm.viewer.entities.add(entity);
          }
          vm.updateCamera(
            viewModel,
            Cesium.Cartesian3.fromDegrees(obj[0], obj[1], 200)
          );
        },
        function() {
          if (geocodeInProgress.cancel) {
            return;
          }
          viewModel._isSearchInProgress = false;
          viewModel.searchText = viewModel._searchText + " (error)";
        }
      ));
    },
    useAMap(viewModel, address) {
      let vm = this;
      var amapAPI = "http://restapi.amap.com/v3/geocode/geo";
      var promise = Cesium.Resource.fetchJsonp({
        url: amapAPI,
        queryParameters: {
          address: address,
          s: "rsv3",
          key: "93c0cc318d273dc0cbb8536ae36d636f" // your personal key, you can get it from SuperMap Online
        }
      });
      var geocodeInProgress = (viewModel._geocodeInProgress = Cesium.when(
        promise,
        function(result) {
          if (geocodeInProgress.cancel) {
            return;
          }
          viewModel._isSearchInProgress = false;
          if (result.length === 0 || result.totalHints === 0) {
            viewModel.searchText = viewModel._searchText + " (not found)";
            return;
          }
          if (Cesium.defined(viewModel.entities)) {
            for (var i = 0; i < viewModel.entities.length; i++) {
              viewer.entities.remove(viewModel.entities[i]);
            }
          }
          viewModel.entities = [];
          var obj;
          for (var i = 0; i < result.geocodes.length; i++) {
            var resource = result.geocodes[i];
            // viewModel._searchText = resource.adcode;
            var location =
              resource.location && resource.location.split(",").map(a => a * 1);
            obj = gcj02towgs84(location[0], location[1]);
            var entity = {
              id: resource.adcode + i,
              position: Cesium.Cartesian3.fromDegrees(obj[0], obj[1]),
              point: {
                show: true, // default
                color: Cesium.Color.SKYBLUE, // default: WHITE
                pixelSize: 10, // default: 1
                outlineColor: Cesium.Color.YELLOW, // default: BLACK
                outlineWidth: 3 // default: 0
              }
            };
            entity.description = new Cesium.ConstantProperty(resource.name);
            viewModel.entities.push(entity);
            vm.viewer.entities.add(entity);
          }
          vm.updateCamera(
            viewModel,
            Cesium.Cartesian3.fromDegrees(obj[0], obj[1], 200)
          );
        },
        function() {
          if (geocodeInProgress.cancel) {
            return;
          }
          viewModel._isSearchInProgress = false;
          viewModel.searchText = viewModel._searchText + " (error)";
        }
      ));
    },
    updateCamera(viewModel, destination) {
      viewModel._scene.camera.flyTo({
        destination: destination,
        complete: function() {
          viewModel._complete.raiseEvent();
        },
        duration: viewModel._flightDuration,
        endTransform: Cesium.Matrix4.IDENTITY
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>
