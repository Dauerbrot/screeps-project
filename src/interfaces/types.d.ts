// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room?: string;
  working?: boolean;
  // id from which energy source the creep consumes
  sourceId?: string;
  // id from game objects which will consume the energy
  targetId?: string;

  /** Specific properties of harvester **/
  // true = start transfer from resource, false = is completed
  transfer?: boolean;

  /** Specific properties of builder **/
  // true = start transfer from resource, false = is completed
  building?: boolean;
}

interface SpawnMemory {
  isBuilding: boolean;
}

interface Memory {
  uuid: number;
  log: any;
  lastUpgradeTime: number;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
