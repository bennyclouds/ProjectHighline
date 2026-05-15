use std::sync::Arc;
use uuid::Uuid;

use crate::domain::Trip;
use crate::infrastructure::TripNumberGeneratorMemory;

pub struct TripFactory {
    trip_numbers: Arc<TripNumberGeneratorMemory>,
}

impl TripFactory {
    pub fn new(trip_numbers: Arc<TripNumberGeneratorMemory>) -> Self {
        TripFactory { trip_numbers }
    }

    pub async fn create(&self) -> Trip {
        let id = Uuid::new_v4().to_string();
        let trip_number = self.trip_numbers.next().await;
        Trip::new(id, trip_number)
    }
}
