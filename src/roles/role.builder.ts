function getMoveOpts() {
  return { visualizePathStyle: { stroke: "#ffaa00" } };
}

// TODO write logic that, if the no structure is available to be build, then store the actual energy in structures
export class RoleBuilder {
  private static readonly PERCENTAGE_OF_STRUCTURE_CAPACITY = 50;

  public static runCreepLogic(creep: Creep): void {
    this.setCreepStatus(creep);

    if (creep.memory.building) {
      const target = this.getTarget(creep);

      if (target) {
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      const sourcesStructures = creep.room.find(FIND_MY_STRUCTURES, {
        filter: structure => {
          return (
            structure.structureType === STRUCTURE_SPAWN &&
            (structure.store.getFreeCapacity(RESOURCE_ENERGY) / structure.store.getCapacity(RESOURCE_ENERGY)) * 100 <
            this.PERCENTAGE_OF_STRUCTURE_CAPACITY
          );
        }
      });

      const source: Source | null = creep.pos.findClosestByRange(sources);
      let sourceStructure: Structure | null = null;
      if (sourcesStructures) {
        const structure = creep.pos.findClosestByRange(sourcesStructures);
        // both structures are available now find the closest to from the creep
        if (structure && source) {
          const distanceStructureInRange = creep.pos.getRangeTo(structure);
          const distanceSourceInRange = creep.pos.getRangeTo(source);
          if (distanceStructureInRange < distanceSourceInRange) {
            sourceStructure = structure;
          }
        }
      }
      // run to the energy source or structure which is closer to the creep
      if (sourceStructure && creep.withdraw(sourceStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sourceStructure, getMoveOpts());
      } else if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, getMoveOpts());
      }
    }
  }

  private static getTarget(creep: Creep) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    const target = creep.pos.findClosestByRange(targets);
    return target;
  }

  /**
   * Is the storing capacity reached, start building the construtions in the room, otherwise start harvesting mode
   * @param creep Creep
   * @private
   */
  private static setCreepStatus(creep: Creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false;
      creep.say("start harvesting");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
      creep.say("start building");
    }
  }
}
