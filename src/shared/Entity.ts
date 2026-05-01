// src/shared/Entity.ts
import { DomainEvent } from "./DomainEvent";

/**
 * Base aggregate/entity that collects domain events.
 * Aggregates call addEvent(...) whenever something happens that other parts of the system should know about
 */
export abstract class Entity {
  private domainEvents: DomainEvent[] = [];

  protected addEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Pulls and clears accumulated domain events.
   * Call this at the command boundary after handling a command.
   */
  pullEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  /**
   * Peek without clearing for testing and debug
   */
  peekEvents(): readonly DomainEvent[] {
    return [...this.domainEvents];
  }
}
