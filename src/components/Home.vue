<template>
  <div class="fixed top-right">
    <MyProvence />
  </div>
  <div id="map" v-loading="fullscreenLoading"></div>
</template>

<script setup>
import MyProvence from "./MyProvence.vue";
</script>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
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
    L.Marker.prototype.options.icon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
    });
    this.map = L.map("map", {
      minZoom: 4,
      maxZoom: 12,
    }).setView([35, 110], 6);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(this.map);
    const markers = new MarkerClusterGroup({ chunkedLoading: true });
    this.fullscreenLoading = true;
    this.$loadScript("/js/CanvasFlowmapLayer.js");
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

        var oneToManyFlowmapLayer = L.canvasFlowmapLayer(
          geoJsonFeatureCollection,
          {
            // required property for this custom layer,
            // which relies on the property names of your own data
            originAndDestinationFieldIds: {
              // all kinds of important stuff here...see docs below
              // however, this isn't required if your own data
              // is in the same format as the layer source code
              originUniqueIdField: "origin_id",
              originGeometry: {
                x: "origin_lon",
                y: "origin_lat",
              },
              destinationUniqueIdField: "destination_id",
              destinationGeometry: {
                x: "destination_lon",
                y: "destination_lat",
              },
            },
            pathDisplayMode: "selection",
            animationStarted: true,
            animationEasingFamily: "Cubic",
            animationEasingType: "In",
            animationDuration: 2000,
          }
        ).addTo(this.map);

        // since this demo is using the optional "pathDisplayMode" as "selection",
        // it is up to the developer to wire up a click or mouseover listener
        // and then call the "selectFeaturesForPathDisplay()" method to inform the layer
        // which Bezier paths need to be drawn
        oneToManyFlowmapLayer.on("click", (e) => {
          if (e.layer.feature.properties && e.layer.feature.properties.name) {
            const div = document.createElement("div");
            createApp(MyNewPopup, e.layer.feature.properties)
              .use(ElementPlus)
              .mount(div);
            L.popup().setLatLng(e.latlng).setContent(div).openOn(this.map);
          }
          if (e.sharedOriginFeatures.length) {
            oneToManyFlowmapLayer.selectFeaturesForPathDisplay(
              e.sharedOriginFeatures,
              "SELECTION_NEW"
            );
          }
          if (e.sharedDestinationFeatures.length) {
            oneToManyFlowmapLayer.selectFeaturesForPathDisplay(
              e.sharedDestinationFeatures,
              "SELECTION_NEW"
            );
          }
          oneToManyFlowmapLayer.selectFeaturesForPathDisplayById(
            "origin_id",
            0,
            false,
            "SELECTION_ADD"
          );
        });

        markers.addLayer(oneToManyFlowmapLayer);

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

.fixed {
  position: fixed;
  z-index: 1000;
}

.top-right {
  padding: 10px;
  right: 10px;
}
</style>