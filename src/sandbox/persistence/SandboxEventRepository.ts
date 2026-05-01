import { DomainEvent } from "../../shared/DomainEvent";
import { SandboxStore } from "./SandboxStore";

export class SandboxEventRepository {
  constructor(private readonly store: SandboxStore) {}

  append(events: readonly DomainEvent[]): void {
    this.store.events.push(...events);
  }

  getAll(): readonly DomainEvent[] {
    return [...this.store.events];
  }
}
