import {
  gcj02towgs84
} from "@/utils/transfer.js";
export default {
  data() {
    return {
      nameOverlay: null,
    }
  },
  methods: {
    addNameOverLay() {
      this.nameOverlay = document.createElement("div");
      this.viewer.container.appendChild(this.nameOverlay);
      this.nameOverlay.className = "backdrop";
      this.nameOverlay.style.display = "none";
      this.nameOverlay.style.position = "absolute";
      this.nameOverlay.style.bottom = "0";
      this.nameOverlay.style.left = "0";
      this.nameOverlay.style["pointer-events"] = "none";
      this.nameOverlay.style.padding = "4px";
      this.nameOverlay.style.backgroundColor = "black";
    },
    hideNameOverLay() {
      this.nameOverlay.style.display = "none";
    },
    showNameOverLay(content, point) {
      this.nameOverlay.style.display = "block";
      this.nameOverlay.style.bottom =
        this.viewer.canvas.clientHeight - point.y + "px";
      this.nameOverlay.style.left = point.x + 200 + "px";
      this.nameOverlay.textContent = content;
    },
    transferToWGS84(data) {
      var newdata = [];
      _.forEach(data, item => {
        newdata.push(gcj02towgs84(item[0], item[1]));
      });
      return _.flatten(newdata);
    },

  },
}