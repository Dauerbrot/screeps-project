import { Roles } from "../interfaces/roles";

export class RoleHarvester implements Roles {
  private creep: Creep | null;

  public constructor();
  public constructor(creep?: Creep) {
    this.creep = creep || null;
  }

  public runForTick(): void {
    if (this.creep === null) {
      return;
    }

    if (this.creep.store.getFreeCapacity() > 0) {
      const sources = this.creep.room.find(FIND_SOURCES);
      const source = sources[0];
      if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(source, {
          visualizePathStyle: {
            stroke: "#ffaa00"
          }
        });
      }
    } else {
      const targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      if (targets.length > 0) {
        if (this.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], {
            visualizePathStyle: {
              stroke: "#ffffff"
            }
          });
        }
      }
    }
  }

  //
  private static getSource(creep: Creep): Source | null {
    if (creep.memory.sourceId === undefined) {
      const sources = creep.room.find(FIND_SOURCES);
      const source = creep.pos.findClosestByRange(sources);
      creep.memory.sourceId = source?.id;
      return source;
    } else {
      return Game.getObjectById(creep.memory.sourceId);
    }
  }

  public static runHarvester(creep: Creep): void {
    if (creep.store.getFreeCapacity() > 0) {
      const source = this.getSource(creep);
      if (source === null) {
        return;
      }

      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: {
            stroke: "#ffaa00"
          }
        });
      }
    } else {
      const creepTarget = RoleHarvester.getTarget(creep);
      if (creepTarget === null) {
        return;
      }
      if (creep.transfer(creepTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creepTarget, {
          visualizePathStyle: {
            stroke: "#ffffff"
          }
        });
      }
    }
  }

  private static getTarget(creep: Creep): Structure<StructureConstant> | null {
    if (creep.memory.targetId === undefined) {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      if (targets.length > 0) {
        const target = creep.pos.findClosestByRange(targets);
        creep.memory.targetId = target?.id;
        return target;
      }
    } else {
      return Game.getObjectById(creep.memory.targetId);
    }

    return null;
  }
}
