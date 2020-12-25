import { Roles } from "../interfaces/roles";

export class RoleHarvester implements Roles {
  private creep: Creep;

  public constructor(creep: Creep) {
    this.creep = creep;
  }

  public runForTick(): void {
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
        const target = targets[0];
        if (this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target, {
            visualizePathStyle: {
              stroke: "#ffffff"
            }
          });
        }
      }
    }
  }
}
