// src/domain/services/TripAssignmentService.ts
import type { TripRepository } from "../repositories/TripRepository";
import type { ReservationRepository } from "../repositories/ReservationRepository";
import type { VehicleRepository } from "../repositories/VehicleRepository";
import type { TripFactory } from "../factories/TripFactory";
import type { DomainEventEmitter } from "../events/DomainEventEmitter";

export class TripAssignmentService {
  constructor(
    private readonly trips: TripRepository,
    private readonly reservations: ReservationRepository,
    private readonly vehicles: VehicleRepository,
    private readonly tripFactory: TripFactory,
    private readonly events: DomainEventEmitter
  ) {}

  async assignReservationToCar(reservationId: string, carNumber: string) {
    const reservation = await this.reservations.getById(reservationId);
    if (!reservation) {
      throw new Error("Reservation not found");
    }

    const vehicle = await this.vehicles.getByCarNumber(carNumber);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    const activeTrip = await this.trips.getActiveTripForCar(carNumber);

    // CASE 1: No active trip → create new trip
    if (!activeTrip) {
      const newTrip = this.tripFactory.create({
        carNumber,
        reservations: [reservation],
      });

      reservation.assignToTrip(newTrip.tripNumber);

      await this.trips.save(newTrip);
      await this.reservations.save(reservation);

      this.events.emit("TripCreated", { tripNumber: newTrip.tripNumber });
      this.events.emit("ReservationAssignedToTrip", {
        reservationId,
        tripNumber: newTrip.tripNumber,
      });

      return newTrip;
    }

    // CASE 2: Active trip exists but is locked
    if (activeTrip.status === "EnRoute" || activeTrip.status === "Completed") {
      const newTrip = this.tripFactory.create({
        carNumber,
        reservations: [reservation],
      });

      reservation.assignToTrip(newTrip.tripNumber);

      await this.trips.save(newTrip);
      await this.reservations.save(reservation);

      this.events.emit("TripCreated", { tripNumber: newTrip.tripNumber });
      this.events.emit("ReservationAssignedToTrip", {
        reservationId,
        tripNumber: newTrip.tripNumber,
      });

      return newTrip;
    }

    // CASE 3: Active trip is Ready or Assigned → add reservation
    activeTrip.addReservation(reservation);
    reservation.assignToTrip(activeTrip.tripNumber);

    await this.trips.save(activeTrip);
    await this.reservations.save(reservation);

    this.events.emit("TripUpdated", { tripNumber: activeTrip.tripNumber });
    this.events.emit("ReservationAssignedToTrip", {
      reservationId,
      tripNumber: activeTrip.tripNumber,
    });

    return activeTrip;
  }
}
