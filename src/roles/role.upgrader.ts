export class RoleUpgrader {
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

  public static runCreepLogic(creep: Creep): void {
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
      const creepTarget = RoleUpgrader.getTarget(creep);
      if (creepTarget === null) {
        return;
      }
      if (creep.upgradeController(creepTarget) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creepTarget, {
          visualizePathStyle: {
            stroke: "#ffffff"
          }
        });
      }
    }
  }

  private static getTarget(creep: Creep): StructureController | null {
    if (creep.memory.targetId === undefined) {
      const target = creep.room.controller;
      creep.memory.targetId = target?.id;
      if (target === undefined) {
        return null;
      }
      return target;
    } else {
      return Game.getObjectById(creep.memory.targetId);
    }
  }
}
