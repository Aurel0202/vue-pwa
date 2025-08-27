<template>
  <div style="height: 50vh; width: 100vw">
    <l-map ref="map" v-model:zoom="zoom" :center="position" style="height: 100%; width: 100%">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
      <l-marker v-if="position" :lat-lng="position">
        <template #default>
          <span>Moi</span>
        </template>
      </l-marker>
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
    defaultCenter: {
      type: Array,
      default: () => [50.4739, 4.4532], // Gosselies
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
      position: this.defaultCenter,
      watchId: null,
    }
  },
  mounted() {
    if ('geolocation' in navigator) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          this.position = [pos.coords.latitude, pos.coords.longitude]
          this.recenterMap()
        },
        (err) => {
          // Affiche l'erreur dans la console, mais garde la position par défaut
          console.warn('Erreur géolocalisation : ' + err.message)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        },
      )
    }
  },
  beforeUnmount() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
    }
  },
  methods: {
    recenterMap() {
      if (this.$refs.map && this.$refs.map.mapObject && this.position) {
        this.$refs.map.mapObject.setView(this.position, this.zoom)
      }
    },
  },
}
</script>
