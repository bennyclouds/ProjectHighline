use serde::{Serialize, Deserialize};

use crate::domain::{TripState, Reservation};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Trip {
    pub id: String,
    pub trip_number: String,
    pub vehicle_id: String,
    pub driver_id: Option<String>,
    pub state: TripState,
    pub start: i64,
    pub end: i64,
    pub reservations: Vec<ReservationRef>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReservationRef {
    pub id: String,
    pub confirmation_number: String,
}

impl Trip {
    pub fn new(id: String, trip_number: String) -> Self {
        let now = chrono::Utc::now().timestamp_millis();
        Trip {
            id,
            trip_number,
            vehicle_id: String::new(),
            driver_id: None,
            state: TripState::Draft,
            start: now,
            end: now,
            reservations: Vec::new(),
        }
    }

    pub fn start_ms(&self) -> i64 {
        self.start
    }

    pub fn end_ms(&self) -> i64 {
        self.end
    }

    pub fn start_iso(&self) -> String {
        chrono::DateTime::<chrono::Utc>::from_timestamp_millis(self.start)
            .unwrap_or_else(|| chrono::Utc::now())
            .to_rfc3339()
    }

    pub fn end_iso(&self) -> String {
        chrono::DateTime::<chrono::Utc>::from_timestamp_millis(self.end)
            .unwrap_or_else(|| chrono::Utc::now())
            .to_rfc3339()
    }

    pub fn mark_ready(&mut self) {
        self.state = TripState::Ready;
    }

    pub fn assign(&mut self, vehicle_id: String, driver_id: String, _capacity: u32) {
        self.vehicle_id = vehicle_id;
        self.driver_id = Some(driver_id);
    }

    pub fn add_reservation(&mut self, r: &Reservation) {
        self.reservations.push(ReservationRef {
            id: r.id.clone(),
            confirmation_number: r.confirmation_number.clone(),
        });

        let t = r.pickup_time_ms;
        if self.reservations.len() == 1 {
            self.start = t;
            self.end = t;
        } else {
            if t < self.start {
                self.start = t;
            }
            if t > self.end {
                self.end = t;
            }
        }
    }

    pub fn complete(&mut self) {
        self.state = TripState::Completed;
    }

    pub fn on_reservation_pax_onboard(&mut self, _reservation_id: &str) {
        if self.state == TripState::Ready {
            self.state = TripState::EnRoute;
        }
    }
}
