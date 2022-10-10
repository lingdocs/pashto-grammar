// https://stackoverflow.com/a/2450976

import { randFromArray } from "@lingdocs/ps-react";

function shuffleArray<T>(arr: Readonly<Array<T>>): Array<T> {
    let currentIndex = arr.length, temporaryValue, randomIndex;

    const array = [...arr];

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

export function maybeShuffleArray<T>(arr: Array<T>): Array<T> {
  const shuffle = randFromArray([true, false, true, false, false]);
  if (shuffle) {
    return shuffleArray(arr);
  }
  return arr;
}

export default shuffleArray;