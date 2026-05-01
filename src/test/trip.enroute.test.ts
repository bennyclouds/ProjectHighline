import { describe, it, expect } from "vitest";
import { Trip } from "../trips/Trip";
import { Reservation } from "../reservations/Reservation";
import { ReservationType } from "../reservations/ReservationType";

it("becomes EN_ROUTE only after all reservations are PAX_ONBOARD", () => {
  const trip = new Trip("trip-1");
  const r1 = new Reservation({ id: "r1", orgId: "orgA", type: ReservationType.Shared, paxCount: 3, pickupLocation: "A", dropoffLocation: "X", requestedWindowStart: 1000, requestedWindowEnd: 2000 });
  const r2 = new Reservation({ id: "r2", orgId: "orgA", type: ReservationType.Shared, paxCount: 3, pickupLocation: "A", dropoffLocation: "X", requestedWindowStart: 1000, requestedWindowEnd: 2000 });
  trip.addReservation(r1);
  trip.addReservation(r2);
  trip.markReady();
  trip.assign("veh-1", "drv-1", 6);
  trip.markReservationPaxOnboard("r1");
  expect(trip.getState()).not.toBe("EN_ROUTE");
  trip.markReservationPaxOnboard("r2");
  expect(trip.getState()).toBe("EN_ROUTE");
});
