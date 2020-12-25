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

  public static runHarvester(creep: Creep): void {
    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES);
      const source = sources[0];
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: {
            stroke: "#ffaa00"
          }
        });
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: {
              stroke: "#ffffff"
            }
          });
        }
      }
    }
  }
}
