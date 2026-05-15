use serde::{Serialize, Deserialize};
use crate::domain::ReservationState;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reservation {
    pub id: String,
    pub confirmation_number: String,
    pub passenger_name: String,
    pub pickup_time_ms: i64,
    pub flight_status: Option<String>,
    pub pickup_location: String,
    pub dropoff_location: String,
    pub state: ReservationState,
    pub trip_id: Option<String>,
}

impl Reservation {
    pub fn new(
        id: String,
        confirmation_number: String,
        passenger_name: String,
        pickup_time_ms: i64,
        pickup_location: String,
        dropoff_location: String,
    ) -> Self {
        Reservation {
            id,
            confirmation_number,
            passenger_name,
            pickup_time_ms,
            flight_status: None,
            pickup_location,
            dropoff_location,
            state: ReservationState::New,
            trip_id: None,
        }
    }

    pub fn pickup_time_iso(&self) -> String {
        chrono::DateTime::<chrono::Utc>::from_timestamp_millis(self.pickup_time_ms)
            .unwrap_or_else(|| chrono::Utc::now())
            .to_rfc3339()
    }

    pub fn assign_to_trip(&mut self, trip_id: String) {
        self.trip_id = Some(trip_id);
        self.state = ReservationState::Assigned;
    }

    pub fn mark_checked_in(&mut self) {
        self.state = ReservationState::CheckedIn;
    }

    pub fn mark_pax_onboard(&mut self) {
        self.state = ReservationState::PaxOnboard;
    }

    pub fn complete(&mut self) {
        self.state = ReservationState::Completed;
    }
}
