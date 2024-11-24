<script setup>
  import { onMounted, ref } from 'vue'
  import {players} from '../src/js/Data'
  import {isValidMove, nextMoveArray, getPlayerFromMove} from '../src/js/Helpers'

  const rows = ref(9)
  const cols = ref(6)
  const ballPosition = ref('3-6')
  const ballMoveMarkerPosition = ref()
  const dragTarget = ref()

  const moves = ref([])

  const makeMoves = () => {
    console.log(moves.value, moves.value.length)
    if (moves.value.length) {
      moves.value.forEach(move => {
        const nextMoveAsArray = nextMoveArray(move.start, move.destination)[0]
        const nextMoveString = nextMoveAsArray[0] + '-' + nextMoveAsArray[1]
        move.start = nextMoveString
        let player = null

        if (move.target === 'ball') {
          ballPosition.value = nextMoveString
        } else if (move.target === 'ball-move-marker') {
          ballMoveMarkerPosition.value = nextMoveString
        } else {
          player = getPlayerFromMove(players, move)

          player.position = nextMoveString
        }

        if (move.start === move.destination) {
          // Add a new move from the next move
          if (move.nextMove) {
            moves.value.push({
              target: move.target,
              start: move.start,
              destination: move.nextMove.shift(),
              nextMove: move.nextMove.length ? move.nextMove : [],
            })
          }

          // Remove move from moves array
          moves.value = moves.value.filter(item => item !== move)

          // Remove move marker from screen
          let divToRemove = document.getElementById(player ? player.name + '-move-marker' : 'ball-move-marker')
          if (divToRemove) {
            divToRemove.remove()
          }
        }

        if (player) {
          // Set player ready to move again
          player.hasMoved = false
        }
      })

      placePlayers()
    }
  }

  const placePlayers = () => {
    let ballDiv = document.getElementById('ball')

    if (!ballDiv) {
      ballDiv = document.createElement('div')
      ballDiv.id = 'ball'
      ballDiv.setAttribute('class', 'w-8 h-8 bg-white rounded-3xl')
      ballDiv.setAttribute('draggable', true)
    }

    const ballLocationDiv = document.getElementById('ball-slot' + ballPosition.value)
    ballLocationDiv.appendChild(ballDiv)

    players.forEach(player => {
      let playerBodyDiv = document.getElementById(player.name)

      if (!playerBodyDiv) {
        playerBodyDiv = document.createElement('div')
        const playerHeadDiv = document.createElement('div')
        playerBodyDiv.id = player.name
        playerBodyDiv.appendChild(playerHeadDiv)
        playerBodyDiv.setAttribute('class', 'px-4 rounded-xl ' + player.shirtColour)
        playerBodyDiv.setAttribute('draggable', true)
        playerHeadDiv.setAttribute('class', 'p-3 rounded-xl ' + player.hairColour)
      }

      const playerLocation = document.getElementById(player.direction + '-player' + player.position)
      playerLocation.appendChild(playerBodyDiv)
    })
  }

  
  const placeMoveMarkers = (moves) => {
    moves.value.forEach(move => {
      // Handle ball
      let ballMoveMarkerDiv = document.getElementById('ball-move-marker')
     
      if (move.target === 'ball' || move.target === 'ball-move-marker') {
        // Create Div if doesn't exist        
        if (!ballMoveMarkerDiv) {
          ballMoveMarkerDiv = document.createElement('div')
          ballMoveMarkerDiv.id = 'ball-move-marker'
          ballMoveMarkerDiv.setAttribute('class', 'w-8 h-8 bg-white rounded-3xl opacity-50')
          // ballDiv.setAttribute('draggable', false)
        }

        ballMoveMarkerPosition.value = move.destination

        const ballLocationDiv = document.getElementById('ball-slot' + move.destination)
        ballLocationDiv.appendChild(ballMoveMarkerDiv)
      } else { // Handle Players
        const player = getPlayerFromMove(players, move)

        let playerBodyMarkerDiv = document.getElementById(player.name + '-move-marker')

        if (!playerBodyMarkerDiv) {
          playerBodyMarkerDiv = document.createElement('div')
          const playerHeadMarkerDiv = document.createElement('div')
          playerBodyMarkerDiv.id = player.name + '-move-marker'
          playerBodyMarkerDiv.appendChild(playerHeadMarkerDiv)
          playerBodyMarkerDiv.setAttribute('class', 'px-4 rounded-xl opacity-50 ' + player.shirtColour)
          playerBodyMarkerDiv.setAttribute('draggable', true)
          playerHeadMarkerDiv.setAttribute('class', 'p-3 rounded-xl opacity-50 ' + player.hairColour)
        }

        const playerLocation = document.getElementById(player.direction + '-player' + move.destination)
        playerLocation.appendChild(playerBodyMarkerDiv)

        // Make ball move marker interactable if player or playerMoveMarker in same position
        // TODO isn't working once ball has been passed to a new player
        const hasPlayerPositionTop = document.getElementById('top-player' + ballMoveMarkerPosition.value).hasChildNodes()
        const hasPlayerPositionBottom = document.getElementById('bottom-player' + ballMoveMarkerPosition.value).hasChildNodes()

        if (hasPlayerPositionTop || hasPlayerPositionBottom) {
          ballMoveMarkerDiv.setAttribute('draggable', true)
          ballMoveMarkerDiv.addEventListener("dragstart", () =>
            dragTarget.value = 'ball'
          )
        }
      }
    })
  }

  // Store moves dropHandler
  function dropHandler(location) {
    console.log(moves.value)
    let ballMove = moves.value.filter(move => move.target === 'ball')[0];

    players.forEach(player => {
      // Only allow the ball to move if a player is on the same square
      if (dragTarget.value === 'ball' && player.position === ballPosition.value && isValidMove(ballMoveMarkerPosition.value ?? ballPosition.value, location, 2, cols.value, rows.value)) {
        // if (ballMoveMarkerPosition.value) { // Handle moving ball after moving
        //   secondaryMove.value.push({
        //     target: 'ball',
        //     start: ballMoveMarkerPosition.value,
        //     destination: location,
        //   })
        // } else {
        //   moves.value.push({
        //     target: 'ball',
        //     start: ballPosition.value,
        //     destination: location,
        //   })
        // }

        if (!ballMove) {
          moves.value.push({
            target: 'ball',
            start: ballPosition.value,
            destination: location,
          })
        } else {
          ballMove.nextMove = [location]
        }
      }

      if (player.name === dragTarget.value && !player.hasMoved && isValidMove(player.position, location, player.movement, cols.value, rows.value)) {
        // Move the ball with the player if they start with it
        if (player.position === ballPosition.value) {
          moves.value.push({
            target: 'ball',
            start: ballPosition.value,
            destination: location,
          })
        }

        if (player.position === ballMoveMarkerPosition.value) {
            ballMove.nextMove = [location]
        }

        moves.value.push({
          target: player.name,
          start: player.position,
          destination: location,
        })

        player.hasMoved = true
      }
    })

    placeMoveMarkers(moves)
  }


  // // Instant Move dropHandler (depreciated by kept for testing)
  // function dropHandler(location) {
  //   players.forEach(player => {
  //     // Only allow the ball to move if a player is on the same square
  //     if (dragTarget.value === 'ball' && player.position === ballPosition.value && isValidMove(ballPosition.value, location, 2, cols.value, rows.value)) {
  //       ballPosition.value = location
  //     }

  //     if (player.name === dragTarget.value && isValidMove(player.position, location, player.movement, cols.value, rows.value)) {
  //       // Move the ball with the player if they start with it
  //       if (player.position === ballPosition.value) {
  //         ballPosition.value = location
  //       }

  //       player.position = location
  //     }
  //   })

  //   placePlayers()
  // }

  onMounted(() => {
    placePlayers()

    const draggableElements = document.querySelectorAll('[draggable="true"]')

    draggableElements.forEach(draggableElement => {
      draggableElement.addEventListener("dragstart", (event) =>
      dragTarget.value = event.target.id
    )}
  )
})

</script>

<template>
  <div class="flex justify-center w-full">
    <button 
      @click="makeMoves"
      class="p-3 bg-white w-fit text-green-500 rounded m-2"
    >
      Make Moves
    </button>
  </div>

  <div class="flex flex-col-reverse w-auto border-2">
    <div 
      v-for="(row, indexYaxis) in rows"
      :key="indexYaxis"
      class="flex flex-row justify-center" 
    >
    <!-- :class="isHighlighted([(indexXaxis+1), (indexYaxis+1)]) ? ' bg-blue-600' : ((indexXaxis+1) + (indexYaxis+1)) % 2 === 0 ? 'bg-green-700' : 'bg-green-900'" -->
      <div 
        v-for="(box, indexXaxis) in cols"
        :key="indexXaxis"
        :class="((indexXaxis+1) + (indexYaxis+1)) % 2 === 0 ? 'bg-green-700' : 'bg-green-900'"
        class="border border-black w-20 h-20 pl-1 flex flex-col justify-center items-center relative"  
        :id="(indexXaxis+1)+'-'+(indexYaxis+1)"
        @drop="dropHandler((indexXaxis+1)+'-'+(indexYaxis+1))"
        @dragenter.prevent
        @dragover.prevent
      >
      <!-- @drop="isHighlighted([(indexXaxis+1), (indexYaxis+1)]) ? dropHandler((indexXaxis+1)+'-'+(indexYaxis+1)) : ''" -->

      <div class="absolute top-0 left-1">{{indexXaxis+1}}-{{indexYaxis+1}}</div> <!-- numbers -->
        <div :id="'top-player' + (indexXaxis+1)+'-'+(indexYaxis+1)"></div>
        <div :id="'ball-slot' + (indexXaxis+1)+'-'+(indexYaxis+1)"></div>
          <!-- @mousedown="highLightAdjacent([(indexXaxis+1), (indexYaxis+1)], 2)" -->

        <div :id="'bottom-player' + (indexXaxis+1)+'-'+(indexYaxis+1)"></div>
          <!-- <button @click="test" v-if="showButton" class="px-2 bg-black rounded">press</button> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/*  */
</style>

<!-- // FYNN's first code
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
  // } -->