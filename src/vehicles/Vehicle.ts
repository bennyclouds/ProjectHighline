export class Vehicle {
  readonly id: string;
  readonly plate: string;
  readonly type: string;
  readonly capacity: number;
  readonly makeModel?: string;
  readonly assignedDriverId?: string;

  constructor(id: string, plate: string, type: string, capacity: number, makeModel?: string) {
    this.id = id;
    this.plate = plate;
    this.type = type;
    this.capacity = capacity;
    this.makeModel = makeModel;
  }

  getCapacity() { return this.capacity; }
}
