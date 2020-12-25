import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester } from "./roles/role.harvester";

const HARVESTER = "harvester";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
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
  console.log(harvesterName);
  console.log(mapOfHarvesterCreeps[harvesterName] === undefined);
  console.log(creepsInGameElement.memory.role);
  console.log(HARVESTER === creepsInGameElement.memory.role);
  if (HARVESTER === creepsInGameElement.memory.role && mapOfHarvesterCreeps[harvesterName] === undefined) {
    mapOfHarvesterCreeps[harvesterName] = new RoleHarvester(creepsInGameElement);
  }
}

function generateRoleName() {
  const id = Game.time;
  const newName = "Harvester" + id.toString(10);
  console.log("Spawning new harvester: " + newName);
  return newName;
}

// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  const harvesterCounter = _.filter(creepsInGame, creeps => HARVESTER === creeps.memory.role);

  for (const spawnsIndex in Game.spawns) {
    const spawn = Game.spawns[spawnsIndex];
    const energy = spawn.energy;
    const energyCapacity = spawn.energyCapacity;
    if (energyCapacity === energy && harvesterCounter.length < 10) {
      const harvesterName = generateRoleName();
      console.log("i spawn with the name" + harvesterName);
      spawnHarvesterCreep(spawn, harvesterName);
    }
  }

  function spawnHarvesterCreep(spawn: StructureSpawn, newName: string) {
    spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: {
        role: "harvester"
      }
    });
  }

  if (harvesterCounter.length < 2) {
    const newName = generateRoleName();
    const spawn = Game.spawns["Spawn1"];
    spawnHarvesterCreep(spawn, newName);
  }
  // initialize all creeps as objects
  for (const creepName in creepsInGame) {
    generateCreepRoleByCreep(creepsInGame[creepName]);
  }

  for (const key in mapOfHarvesterCreeps) {
    mapOfHarvesterCreeps[key].runForTick();
  }
  console.log(`Current game tick is ${Game.time}`);
  removeMissingCreeps();
});
