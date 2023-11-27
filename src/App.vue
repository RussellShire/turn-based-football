<script setup>
  import { ref } from 'vue';

  const rows = ref(10)
  const cols = ref(5)

  const range = (start, end) => {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
  }
  
  const findAdjacent = (startLocation, distance) => {
    const distanceRange = range(distance *-1, distance).filter(num => num != 0);

    const adjacentArray = [startLocation];

    // Change X axis of startLocation by each element in Range and add to adjacentArray
    distanceRange.map(modifier => {
      adjacentArray.push([startLocation[0] + modifier, startLocation[1]])
    })

    // Take each elem in adjecentArray and modify by each elem in Range and add to adjacentArray 
    adjacentArray.map(adjacentBox => {
      distanceRange.map(modifier => {
        adjacentArray.push([adjacentBox[0], adjacentBox[1] + modifier])
      })
    })

    return adjacentArray;
  }

  // TESTING
  console.log(findAdjacent([1,1], 1))
</script>

<template>
  <div class="flex flex-col-reverse w-auto border-2">
    <div 
      v-for="(row, indexYaxis) in rows"
      :key="indexYaxis"
      class="flex flex-row justify-center" 
    >
      <div 
        v-for="(box, indexXaxis) in cols" 
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
