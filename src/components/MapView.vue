<template>
  <div style="height: 600px; width: 800px">
    <l-map ref="map" v-model:zoom="zoom" :center="position" style="height: 100%; width: 100%">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
      <l-marker :lat-lng="position" />
      <l-marker v-for="user in users" :key="user._id" :lat-lng="[user.lat, user.long]">
        <template #default>
          <span>{{ user.pseudo }}</span>
        </template>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

export default {
  props: {
    users: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      zoom: 13,
      position: [47.41322, -1.219482], // Position initiale
      watchId: null,
    }
  },
  mounted() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          this.position = [pos.coords.latitude, pos.coords.longitude]
          this.recenterMap()
        },
        (err) => {
          console.error('Erreur géolocalisation : ', err)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        },
      )
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.")
    }
  },
  beforeUnmount() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
    }
  },
  methods: {
    recenterMap() {
      if (this.$refs.map && this.$refs.map.mapObject) {
        this.$refs.map.mapObject.setView(this.position, this.zoom)
      }
    },
  },
}
</script>
