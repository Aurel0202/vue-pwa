<template>
  <div style="margin-top: 2em">
    <h3>Liste des utilisateurs</h3>
    <ul>
      <li v-for="user in users" :key="user._id">
        {{ user.pseudo }} — ({{ user.lat }}, {{ user.long }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['users'])
</script>
