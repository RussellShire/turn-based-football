<script setup>

</script>

<template>
  <div class="w-auto border-2">
    <div v-for="(boxi, indexYaxis) in 5" class="flex flex-row justify-center font-bold">
      <div v-for="(boxii, indexXaxis) in 3" :id="(indexXaxisi+1)+'-'+(indexYaxis+1)" class="border p-5">{{indexXaxis+1}}-{{indexYaxis+1}}</div>
    </div>
  </div>
</template>

<style scoped>
/*  */
</style>
