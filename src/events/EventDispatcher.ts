// src/events/DomainEventCollector.ts
import { DomainEvent } from "../shared/DomainEvent";
import { Entity } from "../shared/Entity";

/**
 * Collects events from multiple aggregates during a command.
 * After command completes, call all() to get deterministic ordering.
 */

export class DomainEventCollector {
  private readonly events: DomainEvent[] = [];

  collectFrom(entity: Entity): void {
    this.events.push(...entity.pullEvents());
  }

  collectMany(entities: Entity[]): void {
    for (const e of entities) this.collectFrom(e);
  }

  all(): readonly DomainEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events.length = 0;
  }
}
