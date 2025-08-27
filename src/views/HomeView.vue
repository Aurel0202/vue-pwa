<script setup>
import { ref, onMounted } from 'vue'
import InstallBtn from '@/components/UI/InstallBtn.vue'
import MyMap from '@/components/UI/MapView.vue'
import MapView from '@/components/UI/MapView.vue'
</script>

<template>
  <MapView />
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
