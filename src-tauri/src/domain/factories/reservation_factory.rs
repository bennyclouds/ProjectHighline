use std::sync::Arc;
use uuid::Uuid;

use crate::domain::Reservation;
use crate::infrastructure::ReservationNumberGeneratorMemory;

pub struct ReservationFactory {
    reservation_numbers: Arc<ReservationNumberGeneratorMemory>,
}

impl ReservationFactory {
    pub fn new(reservation_numbers: Arc<ReservationNumberGeneratorMemory>) -> Self {
        ReservationFactory { reservation_numbers }
    }

    pub async fn create(
        &self,
        passenger_name: String,
        pickup_time_ms: i64,
        pickup_location: String,
        dropoff_location: String,
    ) -> Reservation {
        let id = Uuid::new_v4().to_string();
        let confirmation_number = self.reservation_numbers.next().await;

        Reservation::new(
            id,
            confirmation_number,
            passenger_name,
            pickup_time_ms,
            pickup_location,
            dropoff_location,
        )
    }
}
