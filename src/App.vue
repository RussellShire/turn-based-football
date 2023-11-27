<script setup>
// 
</script>

<template>
  <div class="flex flex-col-reverse w-auto border-2">
    <div 
      v-for="(row, indexYaxis) in 10"
      :key="indexYaxis"
      class="flex flex-row justify-center" 
    >
      <div 
        v-for="(box, indexXaxis) in 5" 
        :id="(indexXaxisi+1)+'-'+(indexYaxis+1)"
        :key="indexXaxis"
        :class="((indexXaxis+1) + (indexYaxis+1)) % 2 === 0 ? 'bg-green-700' : 'bg-green-900'"
        class="border border-black w-20 h-20 pl-1"  
      >
        {{indexXaxis+1}}-{{indexYaxis+1}}
      </div>
    </div>
  </div>
</template>

<style scoped>
/*  */
</style>
