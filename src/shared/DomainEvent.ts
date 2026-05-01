import type { Timestamp } from "../shared/Time";

export abstract class DomainEvent {
  readonly id: string;
  readonly type: string;
  readonly occurredAt: Timestamp;

  protected constructor(type: string, occurredAt: Timestamp) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.occurredAt = occurredAt;
  }
}
