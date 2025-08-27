<script setup>
import { ref } from 'vue'
import InstallBtn from '@/components/InstallBtn.vue'
import MyMap from '@/components/MapView.vue'

const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
const email = ref('')
const password = ref('')
const error = ref('')

function login() {
  if (email.value === 'demo@demo.com' && password.value === 'demo') {
    localStorage.setItem('isAuthenticated', 'true')
    isAuthenticated.value = true
    error.value = ''
  } else {
    error.value = 'Identifiants incorrects'
  }
}
function logout() {
  localStorage.removeItem('isAuthenticated')
  isAuthenticated.value = false
  email.value = ''
  password.value = ''
}
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
      <MyMap />
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
.error {
  color: red;
  margin-top: 1em;
}
</style>
