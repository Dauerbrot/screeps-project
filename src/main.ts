import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester } from "./roles/role.harvester";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
const HARVESTER = "harvester";
const creepsInGame = Game.creeps;

export const loop = ErrorMapper.wrapLoop(() => {
  // fallback when a creep was spawned without a purpose
  // This utility uses source maps to get the line numbers and file names of the original, TS source code
  const harvesterCounter = _.filter(creepsInGame, creeps => HARVESTER === creeps.memory.role);

  if (harvesterCounter.length < 2 || determineToCreateANewHarvester(harvesterCounter)) {
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
function removeMissingCreeps(): void {
  for (const name in Memory.creeps) {
    console.log(name);
    if (
      !(name in creepsInGame) ||
      creepsInGame[name].memory === undefined ||
      creepsInGame[name].memory.role === undefined
    ) {
      delete Memory.creeps[name];
    }
  }
}

function determineToCreateANewHarvester(harvesterCounter: Creep[]): void {
  // empty element
}

function spawnHarvesterCreep(spawn: StructureSpawn): void {
  const name = "Harvester" + Game.time.toString(10);
  spawn.spawnCreep([WORK, CARRY, MOVE], name, {memory: {role: HARVESTER}});
}

function checkSpawningCreep(spawn: StructureSpawn): void {
  if (spawn.spawning) {
    const name = spawn.spawning.name;
    const role = creepsInGame[name].memory.role;
    // in case the role couldn´t be set in the spawning creeper, set it seperately here
    if (role === undefined) {
      creepsInGame[name].memory.role = HARVESTER;
    }
    spawn.room.visual.text("building" + name + " with role: " + role, spawn.pos.x + 1, spawn.pos.y, {
      align: "left",
      opacity: 0.8
    });
  }
}

function showTickFromServer(): void {
  console.log("Current game tick is " + Game.time.toString(10));
}
