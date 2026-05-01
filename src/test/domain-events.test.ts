import { describe, it, expect } from "vitest";
import { Trip } from "../trips/Trip";
import { Reservation } from "../reservations/Reservation";
import { DomainEventCollector } from "../events/DomainEventCollector";

it("emits trip assigned and state changed events in deterministic order", () => {
  const trip = new Trip("t1");
  const r = new Reservation({ id: "r1", /* ... */ });
  trip.addReservation(r);
  trip.markReady();

  const collector = new DomainEventCollector();
  trip.assign("veh1", "drv1", 4);
  collector.collectFrom(trip);

  const events = collector.all();
  expect(events.length).toBeGreaterThanOrEqual(2);
  expect(events[0].type).toBe("trip.assigned");
  expect(events[1].type).toBe("trip.state_changed");
});
