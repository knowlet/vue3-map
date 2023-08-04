<template>
  <div class="fixed top-right">
    <MyProvence />
  </div>
  <div id="map" v-loading="fullscreenLoading"></div>
</template>

<script setup lang="ts">
import MyProvence from "./MyProvence.vue";
</script>

<script lang="ts">
import { geoJSON, latLng, layerGroup, map, popup, tileLayer } from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet/dist/leaflet.css";

import { MarkerClusterGroup } from "leaflet.markercluster/src";
import MyNewPopup from "./MyPopup.vue";

import axios from "axios";
import ElementPlus, { ElMessage } from "element-plus";
import { createApp } from "vue";

export default {
  data() {
    return {
      value: "",
      provinces: [],
      fullscreenLoading: false,
      loading: false,
    };
  },
  mounted() {
    interface MapOptions {
      center: [number, number];
      zoom: number;
      // other properties
    }

    const options: MapOptions = {
      center: latLng(35, 110),
      zoom: 6,
    };
    const mymap = map("map", options);
    //控制地图底图
    layerGroup([
      tileLayer('https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
      tileLayer('https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
    ]).addTo(mymap);
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
        var l = geoJSON(geoJsonFeatureCollection, {
          style: (feature) => {
            return { color: feature.properties.color };
          },
        }).addTo(mymap);

        l.on("click", e => {
          if (e.layer.feature.properties && e.layer.feature.properties.name) {
            const div = document.createElement("div");
            createApp(MyNewPopup, e.layer.feature.properties)
              .use(ElementPlus)
              .mount(div);
            popup().setLatLng(e.latlng).setContent(div).openOn(mymap);
          }
        })

        markers.addLayer(l);
        mymap.addLayer(markers);
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

.fixed {
  position: fixed;
  z-index: 1000;
}

.top-right {
  padding: 10px;
  right: 10px;
}
</style>