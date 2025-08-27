<script setup>
import { ref, onMounted } from 'vue'
import InstallBtn from '@/components/InstallBtn.vue'
import MyMap from '@/components/MapView.vue'

const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
const email = ref('')
const password = ref('')
const error = ref('')

// Pour le pseudo et la position
const pseudo = ref('')
const lat = ref(null)
const long = ref(null)
const apiMessage = ref('')
const users = ref([])

function login() {
  if (email.value === 'demo@demo.com' && password.value === 'demo') {
    localStorage.setItem('isAuthenticated', 'true')
    isAuthenticated.value = true
    error.value = ''
    getCurrentPosition() // récupère la position dès la connexion
  } else {
    error.value = 'Identifiants incorrects'
  }
}
function logout() {
  localStorage.removeItem('isAuthenticated')
  isAuthenticated.value = false
  email.value = ''
  password.value = ''
  pseudo.value = ''
  lat.value = null
  long.value = null
  apiMessage.value = ''
}

function getCurrentPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat.value = pos.coords.latitude
        long.value = pos.coords.longitude
      },
      (err) => {
        apiMessage.value = 'Erreur géolocalisation : ' + err.message
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
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
    // Optionnel : afficher une erreur
  }
}

onMounted(() => {
  if (isAuthenticated.value) getCurrentPosition()
  if (isAuthenticated.value) fetchUsers()
})

// Après ajout d'un utilisateur, on recharge la liste
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
  if (isAuthenticated.value) getCurrentPosition()
})
</script>

<template>
  <div>
    <template v-if="!isAuthenticated">
      <div class="login-container">
        <h2>Connexion</h2>
        <form @submit.prevent="login">
          <div>
            <label>Email :</label>
            <input v-model="email" type="email" required />
          </div>
          <div>
            <label>Mot de passe :</label>
            <input v-model="password" type="password" required />
          </div>
          <button type="submit">Se connecter</button>
          <div v-if="error" class="error">{{ error }}</div>
        </form>
      </div>
    </template>
    <template v-else>
      <p>Page d'accueil</p>
      <button @click="logout" style="float: right">Déconnexion</button>
      <InstallBtn />
      <h2>Carte avec VueLeaflet</h2>
      <MyMap :users="users" />
      <div class="user-api-form">
        <h3>Enregistrer mon pseudo et ma position</h3>
        <form @submit.prevent="postUser">
          <input v-model="pseudo" placeholder="Pseudo" required />
          <input v-model="lat" placeholder="Latitude" type="number" step="any" required />
          <input v-model="long" placeholder="Longitude" type="number" step="any" required />
          <button type="submit">Envoyer</button>
        </form>
        <div v-if="apiMessage" class="api-message">{{ apiMessage }}</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 350px;
  margin: 60px auto;
  padding: 2em;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  opacity: 1 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
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
.error {
  color: red;
  margin-top: 1em;
}
</style>
