<template>
  <div id="map" v-loading="fullscreenLoading"></div>
</template>

<script>
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

import { MarkerClusterGroup } from "leaflet.markercluster/src";
import MyNewPopup from "./MyPopup.vue";

import axios from "axios";
import ElementPlus, { ElMessage } from "element-plus";
import { createApp } from "vue";

export default {
  data() {
    return {
      fullscreenLoading: false,
    };
  },
  mounted() {
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
    });
    this.map = L.map("map", {
    }).setView([35, 110], 6);
    //控制地图底图
    L.layerGroup([
      L.tileLayer('http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
      L.tileLayer('http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
    ]).addTo(this.map);
    const markers = new MarkerClusterGroup({ chunkedLoading: true });
    this.fullscreenLoading = true;
    axios
      .get("/api/cars")
      .then((response) => {
        // handle success
        console.log(response);
        ElMessage.success("地图载入成功！");

        var geoJsonFeatureCollection = {
          // collection of GeoJSON point features
          // with origin and destination attribute properties
          type: "FeatureCollection",
          features: response.data,

          // see discussion above, demos, and CSV example data sources
        };
        var l = L.geoJSON(geoJsonFeatureCollection, {
          style: (feature) => {
            return { color: feature.properties.color };
          },
        }).addTo(this.map);

        l.on("click", e => {
          console.log(e)
          if (e.layer.feature.properties && e.layer.feature.properties.name) {
            const div = document.createElement("div");
            createApp(MyNewPopup, e.layer.feature.properties)
              .use(ElementPlus)
              .mount(div);
            L.popup().setLatLng(e.latlng).setContent(div).openOn(this.map);
          }
        })

        markers.addLayer(l);

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