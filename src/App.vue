<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- This renders the active component based on the URL -->
  <RouterView />
</template>

<style>
/* 
  Since we are using Tailwind classes in DashboardView.vue, 
  we don't need global styles here. 
*/
</style>