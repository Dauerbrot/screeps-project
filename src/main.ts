import { ErrorMapper } from "utils/ErrorMapper";
import { RoleHarvester } from "./roles/role.harvester";
import { RoleUpgrader } from "./roles/role.upgrader";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
const HARVESTER = "harvester";
const UPGRADER = "upgrader";
const creepsInGame = Game.creeps;

function getCreepsFromRole(filterRole: string) {
  return _.filter(creepsInGame, creeps => filterRole === creeps.memory.role);
}

function createNewCreep(creepsCounter: Creep[], creepRole: string) {
  if (creepsCounter.length < 2) {
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];
      spawnCreep(spawn, creepRole);
      checkSpawningCreep(spawn, creepRole);
    }
  }
}

// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  const harvesterCounter = getCreepsFromRole(HARVESTER);
  const upgraderCounter = getCreepsFromRole(UPGRADER);
  createNewCreep(harvesterCounter, HARVESTER);
  createNewCreep(upgraderCounter, UPGRADER);

  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];

    switch (creep.memory.role) {
      case HARVESTER:
        RoleHarvester.runCreepLogic(creep);
        break;
      case UPGRADER:
        RoleUpgrader.runCreepLogic(creep);
        break;
      default:
        // creep is incomplete and don't have any purpose
        creep.suicide();
        break;
    }
  }

  // showTickFromServer();
  removeMissingCreeps();
});

// Automatically delete memory of missing creeps
function removeMissingCreeps(): void {
  for (const name in Memory.creeps) {
    if (!(name in creepsInGame)) {
      delete Memory.creeps[name];
    }
  }
}

function determineToCreateANewHarvester(harvesterCounter: Creep[]): void {
  // empty element
}

function spawnCreep(spawn: StructureSpawn, roleCreep: string): void {
  const name = roleCreep + Game.time.toString(10);
  spawn.spawnCreep([WORK, CARRY, MOVE], name, {memory: {role: roleCreep}});
}

function checkSpawningCreep(spawn: StructureSpawn, expectedRole: string): void {
  if (spawn.spawning) {
    const name = spawn.spawning.name;
    const role = creepsInGame[name].memory.role;
    // in case the role couldn't be set in the spawning creeper, set it separately here
    if (role === undefined) {
      creepsInGame[name].memory.role = expectedRole;
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
