<script setup>
  import { ref } from 'vue';

  const rows = ref(15)
  const cols = ref(5)
  const ballPosition = ref('3-7');

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
      const newXaxis = startLocation[0] + modifier;

      if (newXaxis > 0 && newXaxis <= cols.value) { // check result is in bounds of the grid
        adjacentArray.push([newXaxis, startLocation[1]])
      }
    })

    // Take each elem in adjecentArray and modify by each elem in Range and add to adjacentArray 
    adjacentArray.map(adjacentBox => {
      distanceRange.map(modifier => {
        const newYaxis = adjacentBox[1] + modifier;

        if (newYaxis > 0 && newYaxis <= rows.value) {
          adjacentArray.push([adjacentBox[0], newYaxis])
        }
      })
    })

    return adjacentArray;
  }

  const currentlyHighlighted = ref([]);

  const highLightAdjacent = (box, distance) => {
    currentlyHighlighted.value = findAdjacent(box, distance);
  }

  const isHighlighted = (box) => {
    let match = false;

    currentlyHighlighted.value.map(highlighted => {
      if (highlighted[0] === box[0] && highlighted[1] === box[1]){
        match = true
      }

    })
    return match;
  }

  // FYNN's first code
  // const pressCount = ref(0)
  // const showButton = ref(true)

  // const test = () => {
  //   pressCount.value = pressCount.value + 1

    // if (pressCount.value < 5) {
    //   console.log("Ouch! Hey don't press me!-I might say press but still it REALLY HURTS")
    // } else if (pressCount.value < 15 ) {
    //   console.log("You really don't quit!")
    // } else if (pressCount.value < 30 ) {
    //   console.log("for the millionth time, STOP IT!!!!")
    // } else if (pressCount.value < 100 ) {
    //   console.log("Im in hospital now!") 
    // }else if (pressCount.value < 101 )  {
    //   console.log("WILL YOU STOP DESTROYING ME!!!")
    //   console.log("That's it, I'm off!")
    //   showButton.value = false
    // }
    // }

  
  function dragstartHandler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
    console.log('Hello Fynn')
  }

  function dropHandler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("text/plain");
    console.log(data);
    ballPosition.value = data;
    // ev.target.appendChild(document.getElementById(data));
  
  }

  window.addEventListener("DOMContentLoaded", () => {
    // Get the element by id
    const element = document.getElementById(ballPosition.value);
    // Add the ondragstart event listener
    element.addEventListener("dragstart", dragstartHandler);
  });
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
        :key="indexXaxis"
        :class="isHighlighted([(indexXaxis+1), (indexYaxis+1)]) ? ' bg-red-600' : ((indexXaxis+1) + (indexYaxis+1)) % 2 === 0 ? 'bg-green-700' : 'bg-green-900'"
        class="border border-red w-20 h-20 pl-1"  
        @click="highLightAdjacent([(indexXaxis+1), (indexYaxis+1)], 2)"

      >
        {{indexXaxis+1}}-{{indexYaxis+1}}
        <div 
          class="flex justify-center items-center" 
        >
          <div 
            v-if="ballPosition === (indexXaxis+1)+'-'+(indexYaxis+1)" 
            :id="(indexXaxis+1)+'-'+(indexYaxis+1)"
            class="w-8 h-8 bg-white rounded-3xl"
            draggable="true"
            @ondrop="dropHandler(event)"
          >
          <!-- <div class="text-red-500">hello</div>
          <button @click="test" v-if="showButton" class="px-2 bg-black rounded">press</button> -->
          </div>  
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*  */
</style>