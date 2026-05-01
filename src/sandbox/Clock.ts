export type Timestamp = number;

export interface Clock {
  now(): Timestamp;
}
