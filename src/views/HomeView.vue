<script setup>
import { ref, onMounted } from 'vue'
import MyMap from '@/components/MapView.vue'

const pseudo = ref('')
const lat = ref(null)
const long = ref(null)
const apiMessage = ref('')
const users = ref([])

function startWatchPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
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

async function postUser() {
  apiMessage.value = ''
  if (!pseudo.value || lat.value === null || long.value === null) {
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
            pseudo: pseudo.value,
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
})
</script>

<template>
  <div>
    <div class="user-api-form">
      <form @submit.prevent="postUser">
        <input v-model="pseudo" placeholder="Pseudo" required />
        <input v-model="lat" placeholder="Latitude" type="number" step="any" required readonly />
        <input v-model="long" placeholder="Longitude" type="number" step="any" required readonly />
        <button type="submit">Partager ma localisation</button>
      </form>
      <div v-if="apiMessage" class="api-message">{{ apiMessage }}</div>
    </div>
    <h2>Carte des utilisateurs</h2>
    <MyMap :users="users" />
    <div style="margin-top:2em">
      <h3>Liste des utilisateurs</h3>
      <ul>
        <li v-for="user in users" :key="user._id">
          {{ user.pseudo }} — ({{ user.lat }}, {{ user.long }})
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.user-api-form {
  margin: 2em auto;
  max-width: 400px;
  padding: 1em;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafbfc;
}
.user-api-form input {
  margin: 0.5em 0;
  padding: 0.5em;
  width: 100%;
  box-sizing: border-box;
}
.user-api-form button {
  margin-top: 1em;
}
.api-message {
  margin-top: 1em;
  color: #007700;
}
</style>
