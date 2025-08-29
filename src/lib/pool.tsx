import { randFromArray } from "@lingdocs/pashto-inflector";
import equal from "fast-deep-equal";

/**
 *
 * @param poolBase an array of things you want to use as the pool to pick from
 * @param removalLaxity If set, thery will be a n% chance that the pick will NOT
 * be removed after use. Defaults to 0, meaning that every time an item is picked
 * it is removed from the pool. 100 means that items will never be removed from the pool.
 * @returns
 */
export function makePool<P>(poolBase: P[], removalLaxity = 0): () => P {
  let pool = [...poolBase];
  function shouldStillKeepIt() {
    if (!removalLaxity) return false;
    return Math.random() < removalLaxity / 100;
  }
  function pickRandomFromPool(): P {
    // Pick an item from the pool;
    const pick = randFromArray(pool);
    // Remove the (first occurance of) the item from the pool
    // This step might be skipped if the removal laxity is set
    if (shouldStillKeepIt()) {
      return pick;
    }
    const index = pool.findIndex((v) => equal(v, pick));
    if (index === -1) throw new Error("could not find pick from pool");
    pool.splice(index, 1);
    // If the pool is empty, reset it
    if (pool.length === 0) {
      pool = [...poolBase];
    }
    return pick;
  }
  return pickRandomFromPool;
}
