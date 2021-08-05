<template>
  <div id="map" v-loading="fullscreenLoading"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { MarkerClusterGroup } from "leaflet.markercluster/src";
import MyNewPopup from "./MyPopup.vue";

import { createApp, defineComponent, ref, nextTick } from "vue";
import axios from "axios";
import ElementPlus from "element-plus";
import { ElCard, ElMessage } from "element-plus";

export default {
  data() {
    return {
      fullscreenLoading: false,
    };
  },
  mounted() {
    this.map = L.map("map").setView([35, 110], 6);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(this.map);
    const markers = new MarkerClusterGroup({ chunkedLoading: true });
    // const loading = this.$loading({
    //   lock: true,
    //   text: "Loading",
    //   spinner: "el-icon-loading",
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    this.fullscreenLoading = true;
    axios
      .get("/api/cars")
      .then((response) => {
        // handle success
        console.log(response);
        ElMessage.success("地图载入成功！");

        markers.addLayer(
          L.geoJSON(response.data, {
            style: (feature) => {
              return { color: feature.properties.color };
            },
            onEachFeature: (feature, layer) => {
              // does this feature have a property named popupContent?
              if (feature.properties && feature.properties.name) {
                // layer.bindPopup(feature.properties.name);
                layer.bindPopup(`
                <div id="popup-content">
                  <div class="wrapper">Now Loading...</div>
                </div>`);
              }
            },
            // pointToLayer: (feature, latlng) => {
            //   return L.circleMarker(latlng, geojsonMarkerOptions);
            // },
          })
        );

        this.map.addLayer(markers);
      })
      .catch((err) => {
        // handle error
        console.log(err);
        ElMessage.error(err?.response?.data.error ?? err.message);
      })
      .then(() => {
        // always executed
        // loading.close();
        this.fullscreenLoading = false;
      });

    markers.on("popupopen", (e) => {
      // All members of FeatureGroup share single popup instance
      // the popup close and recreated itself when direct click on another marker
      // magic timeout to prevent mount before recreated
      setTimeout(() => {
        createApp(MyNewPopup, e.layer.feature.properties)
          .use(ElementPlus)
          .mount("#popup-content");
      }, 250);
    });
  },
};
</script>

<style>
#map {
  height: 90vh;
}

.wrapper {
  min-width: 240px;
}
</style>