import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester } from "./roles/role.harvester";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
const HARVESTER = "harvester";
const creepsInGame = Game.creeps;

export const loop = ErrorMapper.wrapLoop(() => {
  // fallback when a creep was spawned without a purpose
  // This utility uses source maps to get the line numbers and file names of the original, TS source code
  const harvesterCounter = _.filter(creepsInGame, creeps => HARVESTER === creeps.memory.role);
  if (harvesterCounter.length < 2) {
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];
      spawnHarvesterCreep(spawn);
      checkSpawningCreep(spawn);
    }
  }

  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];

    if (HARVESTER === creep.memory.role) {
      RoleHarvester.runHarvester(creep);
    }
  }

  // showTickFromServer();
  removeMissingCreeps();
});

// Automatically delete memory of missing creeps
function removeMissingCreeps() {
  for (const name in Memory.creeps) {
    if (!(name in creepsInGame)) {
      delete Memory.creeps[name];
    }
  }
}

function spawnHarvesterCreep(spawn: StructureSpawn) {
  const name = "Harvester" + Game.time.toString(10);
  spawn.spawnCreep([WORK, CARRY, MOVE], name);
}

function checkSpawningCreep(spawn: StructureSpawn) {
  if (spawn.spawning) {
    const name = spawn.spawning.name;
    const role = creepsInGame[name].memory.role;
    if (role === undefined) {
      creepsInGame[name].memory.role = HARVESTER;
    }
    spawn.room.visual.text("building" + name + " with role: " + role, spawn.pos.x + 1, spawn.pos.y, {
      align: "left",
      opacity: 0.8
    });
  }
}

function showTickFromServer() {
  console.log("Current game tick is " + Game.time.toString(10));
}
