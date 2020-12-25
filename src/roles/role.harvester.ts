export class RoleHarvester {
  /**
   * searches for the nearest energy source and use this as your only source in your whole life
   * @param creep creep from game
   * @private don´t even think about it
   */
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

  private static getTarget(creep: Creep): Structure | null {
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
