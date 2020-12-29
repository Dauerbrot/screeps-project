export class RoleUpgrader {
  /**
   * searches for the nearest energy source where the free capacity is atleast under 20%, in conclusion the store is
   * close at max capacity
   * @param creep creep from game
   * @private don´t even think about it
   */
  private static getSource(creep: Creep): Structure | null {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
          (structure.store.getFreeCapacity(RESOURCE_ENERGY) / structure.store.getCapacity(RESOURCE_ENERGY)) * 100 < 20
        );
      }
    });
    if (targets.length > 0) {
      const sourceStructure = creep.pos.findClosestByRange(targets);
      creep.memory.sourceId = sourceStructure?.id;
      return sourceStructure;
    }

    return null;
  }

  public static runCreepLogic(creep: Creep): void {
    this.setMemoryTransferByCapacityStatus(creep);
    if (creep.store.getFreeCapacity() > 0 && !creep.memory.transfer) {
      const source = this.getSource(creep);
      if (source === null) {
        return;
      }

      if (creep.withdraw(source, LOOK_ENERGY, creep.store.getCapacity()) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: {
            stroke: "#ffaa00"
          }
        });
      }
      // carry container is full, now upgrade the upgrade structure in this room
    } else {
      creep.memory.transfer = true;
      const creepTarget = this.getTarget(creep);
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

  /**
   * Is atleast 80% of the room energy available,and the upgrader is empty, then allow the upgrader to start a new
   * expedition to upgrade the upgrader structure
   * @param creep creep
   * @private
   */
  private static setMemoryTransferByCapacityStatus(creep: Creep) {
    const structureCapacityStatus = (creep.room.energyAvailable / creep.room.energyCapacityAvailable) * 100;
    // console.log("Capacity full at " + structureCapacityStatus.toString(10) + "%");
    if (
      structureCapacityStatus > 80 &&
      creep.memory.transfer &&
      creep.store.getFreeCapacity() === creep.store.getCapacity()
    ) {
      creep.memory.transfer = false;
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
