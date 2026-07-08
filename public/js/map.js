// public/js/map.js
// Expects global variables: mapToken, listingLat, listingLng
// (set via inline <script> in show.ejs before this file loads)

mapboxgl.accessToken = mapToken;

const coordinates = [listingLng, listingLat]; // [lng, lat]

const map = new mapboxgl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      "osm-tiles": {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      {
        id: "osm-tiles-layer",
        type: "raster",
        source: "osm-tiles",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  center: coordinates,
  zoom: 9,
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .addTo(map);

map.on("load", () => {
  map.resize();
});
