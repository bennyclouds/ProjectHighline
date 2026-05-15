use std::sync::RwLock;

use async_trait::async_trait;

use crate::domain::{Trip, TripRepository};

pub struct TripRepositoryMemory {
    by_id: RwLock<Vec<Trip>>,
}

impl TripRepositoryMemory {
    pub fn new() -> Self {
        TripRepositoryMemory {
            by_id: RwLock::new(Vec::new()),
        }
    }
}

#[async_trait]
impl TripRepository for TripRepositoryMemory {
    async fn save(&self, trip: Trip) -> anyhow::Result<()> {
        let mut vec = self.by_id.write().unwrap();
        if let Some(idx) = vec.iter().position(|t| t.id == trip.id) {
            vec[idx] = trip;
        } else {
            vec.push(trip);
        }
        Ok(())
    }

    async fn get_by_id(&self, id: &str) -> anyhow::Result<Option<Trip>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.iter().find(|t| t.id == id).cloned())
    }

    async fn get_by_trip_number(&self, trip_number: &str) -> anyhow::Result<Option<Trip>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.iter().find(|t| t.trip_number == trip_number).cloned())
    }

    async fn all(&self) -> anyhow::Result<Vec<Trip>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.clone())
    }
}
