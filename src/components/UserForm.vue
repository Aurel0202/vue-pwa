<template>
  <div class="user-api-form">
    <form @submit.prevent="postUser">
      <input v-model="pseudo" placeholder="Pseudo" required />
      <input v-model="lat" placeholder="Latitude" type="number" step="any" required readonly />
      <input v-model="long" placeholder="Longitude" type="number" step="any" required readonly />
      <button type="submit">Partager ma localisation</button>
    </form>
    <div v-if="apiMessage" class="api-message">{{ apiMessage }}</div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
const props = defineProps(['lat', 'long', 'apiMessage'])
const emit = defineEmits(['submit'])
const pseudo = ref('')
function submitForm() {
  emit('submit', pseudo.value)
}
</script>

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
