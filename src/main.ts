import {ErrorMapper} from "utils/ErrorMapper";
import json = Mocha.reporters.json;

const HARVESTER = "harvester";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
function removeMissingCreeps() {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}

// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  const harvesterCounter = _.filter(Game.creeps, creeps => HARVESTER === creeps.memory.role);

  if (harvesterCounter.length < 2) {
    const id = Game.time;
    const newName = "Harvester" + id.toString(10);
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: "harvester"
      }
    });
  }

  console.log(`Current game tick is ${Game.time}`);
  removeMissingCreeps();
});
