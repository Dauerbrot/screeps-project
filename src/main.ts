import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester } from "./roles/role.harvester";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
const HARVESTER = "harvester";
const creepsInGame = Game.creeps;

export const loop = ErrorMapper.wrapLoop(() => {
  // fallback when a creep was spawned without a purpose
  // This utility uses source maps to get the line numbers and file names of the original, TS source code
  const harvesterCounter = _.filter(creepsInGame, creeps => HARVESTER === creeps.memory.role);
  if (harvesterCounter.length < 10) {
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];
      spawnHarvesterCreep(spawn);
    }
  }
  showTickFromServer();
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

function generateCreepRoleByCreep(creepsInGameElement: Creep) {
  const harvesterName = creepsInGameElement.name.toString();
  const role = new RoleHarvester(creepsInGameElement);
}

function generateHarvesterBySituation(harvesterCounter: Creep[]) {
  for (const spawnsIndex in Game.spawns) {
    const spawn = Game.spawns[spawnsIndex];
    const energy = spawn.energy;
    const energyCapacity = spawn.energyCapacity;
    if (energyCapacity === energy && harvesterCounter.length < 5) {
      spawnHarvesterCreep(spawn);
    }
  }
}

function spawnHarvesterCreep(spawn: StructureSpawn) {
  spawn.spawnCreep([WORK, CARRY, MOVE], "Harvester" + Game.time.toString(10), {
    memory: {
      role: "harvester"
    }
  });
}

function showTickFromServer() {
  console.log("Current game tick is " + Game.time.toString(10));
}
