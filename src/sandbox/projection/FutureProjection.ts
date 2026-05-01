import { SimulatedClock } from "../time/SimulatedClock";
import { DomainEvent } from "../../shared/DomainEvent";

export class FutureProjection {
  readonly events: DomainEvent[] = [];

  constructor(private readonly clock: SimulatedClock) {}

  step(ms: number): void {
    this.clock.advance(ms);
  }

  record(event: DomainEvent): void {
    this.events.push(event);
  }
}
