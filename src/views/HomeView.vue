<script setup>
import { ref, onMounted } from 'vue'
import UserForm from '@/components/UserForm.vue'
import UserList from '@/components/UserList.vue'
import MyMap from '@/components/MapView.vue'

const pseudo = ref('')
const lat = ref(null)
const long = ref(null)
const apiMessage = ref('')
const users = ref([])
let watchId = null

function startWatchPosition() {
  if (navigator.geolocation) {
    if (watchId) navigator.geolocation.clearWatch(watchId)
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        lat.value = pos.coords.latitude
        long.value = pos.coords.longitude
      },
      (err) => {
        apiMessage.value = 'Erreur géolocalisation : ' + err.message
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    )
  } else {
    apiMessage.value = "La géolocalisation n'est pas supportée par ce navigateur."
  }
}

async function fetchUsers() {
  try {
    const res = await fetch(
      'https://ingrwf12.cepegra-frontend.xyz/cockpit2/api/content/items/users',
    )
    const data = await res.json()
    users.value = data.entries || []
  } catch (e) {
    apiMessage.value = 'Erreur lors du chargement des utilisateurs.'
  }
}

async function postUser(pseudoValue) {
  apiMessage.value = ''
  if (!pseudoValue || lat.value === null || long.value === null) {
    apiMessage.value = 'Pseudo ou position manquante.'
    return
  }
  try {
    const res = await fetch(
      'https://ingrwf12.cepegra-frontend.xyz/cockpit2/api/content/item/users',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            pseudo: pseudoValue,
            lat: lat.value,
            long: long.value,
          },
        }),
      },
    )
    if (!res.ok) throw new Error('Erreur API')
    apiMessage.value = 'Utilisateur ajouté !'
    await fetchUsers()
  } catch (e) {
    apiMessage.value = 'Erreur API : ' + e.message
  }
}

onMounted(() => {
  startWatchPosition()
  fetchUsers()
  // Rafraîchit la liste toutes les 10 secondes pour voir les autres en temps réel
  setInterval(fetchUsers, 10000)
})
</script>

<template>
  <div>
    <UserForm :lat="lat" :long="long" :apiMessage="apiMessage" @submit="postUser" />
    <h2>Carte des utilisateurs</h2>
    <MyMap :users="users" :defaultCenter="[50.4739, 4.4532]" />
    <UserList :users="users" />
  </div>
</template>

<style scoped>
.api-message {
  margin-top: 1em;
  color: #007700;
}
</style>
