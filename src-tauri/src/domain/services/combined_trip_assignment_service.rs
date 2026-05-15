use std::sync::Arc;
use uuid::Uuid;

use crate::domain::{
    TripRepository,
    ReservationRepository,
    VehicleRepository,
    DriverRepository,
    Trip,
};

use crate::infrastructure::TripNumberGeneratorMemory;

pub struct CombinedTripAssignmentService {
    trips: Arc<dyn TripRepository>,
    reservations: Arc<dyn ReservationRepository>,
    vehicles: Arc<dyn VehicleRepository>,
    drivers: Arc<dyn DriverRepository>,
    trip_numbers: Arc<TripNumberGeneratorMemory>,
}

impl CombinedTripAssignmentService {
    pub fn new(
        trips: Arc<dyn TripRepository>,
        reservations: Arc<dyn ReservationRepository>,
        vehicles: Arc<dyn VehicleRepository>,
        drivers: Arc<dyn DriverRepository>,
        trip_numbers: Arc<TripNumberGeneratorMemory>,
    ) -> Self {
        CombinedTripAssignmentService {
            trips,
            reservations,
            vehicles,
            drivers,
            trip_numbers,
        }
    }

    pub async fn create_trip_assign_and_add_reservations(
        &self,
        confirmation_numbers: Vec<String>,
        car_number: String,
        driver_id: String,
    ) -> anyhow::Result<String> {
        let vehicle = self
            .vehicles
            .get_by_car_number(&car_number)
            .await?
            .ok_or_else(|| anyhow::anyhow!("Vehicle not found"))?;

        let _driver = self
            .drivers
            .get_by_id(&driver_id)
            .await?
            .ok_or_else(|| anyhow::anyhow!("Driver not found"))?;

        let trip_id = Uuid::new_v4().to_string();
        let trip_number = self.trip_numbers.next().await;
        let mut trip = Trip::new(trip_id, trip_number.clone());

        let mut reservations = Vec::new();
        for num in confirmation_numbers {
            let r = self
                .reservations
                .get_by_confirmation_number(&num)
                .await?
                .ok_or_else(|| anyhow::anyhow!("Reservation not found: {}", num))?;
            reservations.push(r);
        }

        for mut r in reservations {
            trip.add_reservation(&r);
            r.assign_to_trip(trip.id.clone());
            self.reservations.save(r).await?;
        }

        trip.mark_ready();
        trip.assign(vehicle.id.clone(), driver_id, vehicle.capacity);

        self.trips.save(trip).await?;

        Ok(trip_number)
    }
}
