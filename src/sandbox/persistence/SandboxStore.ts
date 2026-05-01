import { DomainEvent } from "../../shared/DomainEvent";

export class SandboxStore {
  readonly events: DomainEvent[] = [];
  readonly state = new Map<string, unknown>();

  reset(): void {
    this.events.length = 0;
    this.state.clear();
  }
}
