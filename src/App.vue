<script setup>
  const range = (start, end) => {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
  }
  
  const findAdjecent = (startLocation, distance) => {
    const distanceRange = range(distance *-1, distance).filter(num => num != 0)

    return distanceRange;
  }

  console.log(findAdjecent((3,5), 3))
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
        :id="(indexXaxis+1)+'-'+(indexYaxis+1)"
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
