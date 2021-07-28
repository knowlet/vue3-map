<template>
  <div id="map" />
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { MarkerClusterGroup } from "leaflet.markercluster/src";
import MyNewPopup from "./MyPopup.vue";

import { createApp, defineComponent, ref, nextTick } from "vue";

export default {
  data() {
    return {
      geojson: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [105.6, 25.1],
          },
          properties: {
            name: "Dinagat Islands",
            popupContent: "zxc",
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [105.6, 25.2],
          },
          properties: {
            name: "Dinagat Islands2",
            popupContent: "asd",
          },
        },
      ],
    };
  },
  mounted() {
    this.map = L.map("map").setView([30, 110], 6);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(this.map);
    const markers = new MarkerClusterGroup({ chunkedLoading: true });
    markers.addLayer(
      L.geoJSON(this.geojson, {
        style: (feature) => {
          return { color: feature.properties.color };
        },
        onEachFeature: (feature, layer) => {
          // does this feature have a property named popupContent?
          if (feature.properties && feature.properties.popupContent) {
            // layer.bindPopup(feature.properties.popupContent);
            layer.bindPopup(`<div id="popup-content">Now Loading...</div>`);
          }
        },
        // pointToLayer: (feature, latlng) => {
        //   return L.circleMarker(latlng, geojsonMarkerOptions);
        // },
      })
    );
    markers.on("popupopen", (e) => {
      // All members of FeatureGroup share single popup instance
      // the popup close and recreated itself when direct click on another marker
      // magic timeout to prevent mount before recreated
      setTimeout(() => {
        createApp(MyNewPopup, e.layer.feature.properties).mount(
          "#popup-content"
        );
      }, 250);
    });
    this.map.addLayer(markers);
  },
};
</script>

<style>
#map {
  height: 90vh;
}
</style>