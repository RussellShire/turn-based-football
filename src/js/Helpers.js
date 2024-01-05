const range = (start, end) => {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
  }

  const findAdjacent = (startLocation, distance, cols, rows) => {
    const distanceRange = range(distance *-1, distance).filter(num => num != 0);

    const adjacentArray = [startLocation];

    // Change X axis of startLocation by each element in Range and add to adjacentArray
    distanceRange.map(modifier => {
      const newXaxis = startLocation[0] + modifier;

      if (newXaxis > 0 && newXaxis <= cols) { // check result is in bounds of the grid
        adjacentArray.push([newXaxis, startLocation[1]])
      }
    })

    // Take each elem in adjecentArray and modify by each elem in Range and add to adjacentArray 
    adjacentArray.map(adjacentBox => {
      distanceRange.map(modifier => {
        const newYaxis = adjacentBox[1] + modifier;

        if (newYaxis > 0 && newYaxis <= rows) {
          adjacentArray.push([adjacentBox[0], newYaxis])
        }
      })
    })

    return adjacentArray;
  }

  export const isValidMove = (startLocation, endLocation, allowedDistance, cols, rows) => {
    if (typeof startLocation === 'string') {
      startLocation = startLocation.split('-').map(string => Number(string))
    }

    if (typeof endLocation === 'string') {
      endLocation = endLocation.split('-').map(string => Number(string))
    }

    const validMoves = findAdjacent(startLocation, allowedDistance, cols, rows)

    let isValid = false;

    validMoves.forEach(validMove => {
      if (validMove[0] === endLocation[0] && validMove[1] === endLocation[1] ) {
        isValid = true;
      }
    })

    return isValid;
  }

//   const currentlyHighlighted = ref([]);

//   const highLightAdjacent = (box, distance) => { 
//     currentlyHighlighted.value = findAdjacent(box, distance);
//   }

//   const isHighlighted = (box) => {
//     let match = false;

//     currentlyHighlighted.value.map(highlighted => {
//       if (highlighted[0] === box[0] && highlighted[1] === box[1]){
//         match = true
//       }

//     })
//     return match;
//   }
