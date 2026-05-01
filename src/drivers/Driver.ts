export class Driver {
  readonly id: string;
  name?: string;
  phone?: string;
  driverNumber?: string;
  realId?: boolean;
  address?: string;
  rating?: number;

  constructor(id: string, name?: string) { this.id = id; this.name = name; }
}
