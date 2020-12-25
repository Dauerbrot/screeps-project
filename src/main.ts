import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester } from "./roles/role.harvester";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change

const HARVESTER = "harvester";
let harvesterCounterName = 0;
const creepsInGame = Game.creeps;
type mapIdentifierType = Record<string, RoleHarvester>;
const mapOfHarvesterCreeps: mapIdentifierType = {};

function removeMissingCreeps() {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in creepsInGame)) {
      delete Memory.creeps[name];
    }
  }
}

function generateCreepRoleByCreep(creepsInGameElement: Creep) {
  const harvesterName = creepsInGameElement.name.toString();
  // fallback when a creep was spawned without a purpose
  if (creepsInGameElement.memory.role === undefined) {
    creepsInGameElement.memory.role = HARVESTER;
  }

  if (HARVESTER === creepsInGameElement.memory.role && mapOfHarvesterCreeps[harvesterName] === undefined) {
    mapOfHarvesterCreeps[harvesterName] = new RoleHarvester(creepsInGameElement);
  }
}

function generateHarvesterBySituation(harvesterCounter: Creep[]) {
  for (const spawnsIndex in Game.spawns) {
    const spawn = Game.spawns[spawnsIndex];
    const energy = spawn.energy;
    const energyCapacity = spawn.energyCapacity;
    if (energyCapacity === energy && harvesterCounter.length < 10) {
      spawnHarvesterCreep(spawn);
    }
  }
}

function spawnHarvesterCreep(spawn: StructureSpawn) {
  spawn.spawnCreep([WORK, CARRY, MOVE], "Harvester" + harvesterCounterName.toString(10), {
    memory: {
      role: "harvester"
    }
  });
  harvesterCounterName++;
}
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  const harvesterCounter = _.filter(creepsInGame, creeps => HARVESTER === creeps.memory.role);

  generateHarvesterBySituation(harvesterCounter);

  if (harvesterCounter.length < 3) {
    const spawn = Game.spawns["Spawn1"];
    spawnHarvesterCreep(spawn);
  }
  // initialize all creeps as objects
  for (const creepName in creepsInGame) {
    generateCreepRoleByCreep(creepsInGame[creepName]);
  }

  for (const key in mapOfHarvesterCreeps) {
    mapOfHarvesterCreeps[key].runForTick();
  }
  //showTickFromServer();
  removeMissingCreeps();
});

function showTickFromServer() {
  console.log(`Current game tick is ${Game.time}`);
}
