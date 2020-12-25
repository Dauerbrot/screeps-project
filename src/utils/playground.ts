export class Playground {
  private element: string;
  public constructor() {
    this.element = "";
  }

  /**
   public generateHarvesterBySituation:void (harvesterCounter: Creep[]) {
    for (const spawnsIndex in Game.spawns) {
      const spawn = Game.spawns[spawnsIndex];
      const energy = spawn.energy;
      const energyCapacity = spawn.energyCapacity;
      if (energyCapacity === energy && harvesterCounter.length < 5) {
        spawnHarvesterCreep(spawn);
      }
    }
  }
   */
  /**
   public generateCreepRoleByCreep:void (creepsInGameElement: Creep) {
    const harvesterName = creepsInGameElement.name.toString();
    const role = new RoleHarvester(creepsInGameElement);
  }
   */
}
