<template>
  <div style="height: 50vh; width: 100vw">
    <l-map ref="map" v-model:zoom="zoom" :center="center" style="height: 100%; width: 100%">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
      <!-- Marqueur de l'utilisateur courant -->
      <l-marker v-if="myPosition" :lat-lng="myPosition">
        <template #default>
          <span style="color: red; font-weight: bold">Moi</span>
        </template>
      </l-marker>
      <!-- Marqueurs des autres utilisateurs -->
      <l-marker v-for="user in users" :key="user._id" :lat-lng="[user.lat, user.long]">
        <template #default>
          <span>{{ user.pseudo }}</span>
        </template>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import { ref, watch, defineProps } from 'vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  defaultCenter: {
    type: Array,
    default: () => [50.4739, 4.4532], // Gosselies
  },
  myPosition: Array,
})

const zoom = ref(13)
const center = ref(props.defaultCenter)

watch(
  () => props.myPosition,
  (val) => {
    if (val && val.length === 2) {
      center.value = val
    }
  },
  { immediate: true },
)
</script>
