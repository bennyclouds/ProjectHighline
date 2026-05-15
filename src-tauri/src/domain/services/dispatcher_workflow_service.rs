use std::sync::Arc;

use crate::domain::{
    TripRepository,
    ReservationRepository,
    VehicleRepository,
    DriverRepository,
    Trip,
    Reservation,
};

use crate::infrastructure::{
    TripNumberGeneratorMemory,
    ReservationNumberGeneratorMemory,
};

pub struct DispatcherWorkflowService {
    trips: Arc<dyn TripRepository>,
    reservations: Arc<dyn ReservationRepository>,
    vehicles: Arc<dyn VehicleRepository>,
    drivers: Arc<dyn DriverRepository>,
    trip_numbers: Arc<TripNumberGeneratorMemory>,
    reservation_numbers: Arc<ReservationNumberGeneratorMemory>,
}

impl DispatcherWorkflowService {
    pub fn new(
        trips: Arc<dyn TripRepository>,
        reservations: Arc<dyn ReservationRepository>,
        vehicles: Arc<dyn VehicleRepository>,
        drivers: Arc<dyn DriverRepository>,
        trip_numbers: Arc<TripNumberGeneratorMemory>,
        reservation_numbers: Arc<ReservationNumberGeneratorMemory>,
    ) -> Self {
        DispatcherWorkflowService {
            trips,
            reservations,
            vehicles,
            drivers,
            trip_numbers,
            reservation_numbers,
        }
    }

    pub async fn add_reservation_to_trip(
        &self,
        confirmation_number: &str,
        trip_number: &str,
    ) -> anyhow::Result<()> {
        let mut trip = self
            .trips
            .get_by_trip_number(trip_number)
            .await?
            .ok_or_else(|| anyhow::anyhow!("Trip not found"))?;

        let mut res = self
            .reservations
            .get_by_confirmation_number(confirmation_number)
            .await?
            .ok_or_else(|| anyhow::anyhow!("Reservation not found"))?;

        trip.add_reservation(&res);
        res.assign_to_trip(trip.id.clone());

        self.trips.save(trip).await?;
        self.reservations.save(res).await?;

        Ok(())
    }
}
