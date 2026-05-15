use std::sync::RwLock;

use async_trait::async_trait;

use crate::domain::{Reservation, ReservationRepository};

pub struct ReservationRepositoryMemory {
    by_id: RwLock<Vec<Reservation>>,
}

impl ReservationRepositoryMemory {
    pub fn new() -> Self {
        ReservationRepositoryMemory {
            by_id: RwLock::new(Vec::new()),
        }
    }
}

#[async_trait]
impl ReservationRepository for ReservationRepositoryMemory {
    async fn save(&self, r: Reservation) -> anyhow::Result<()> {
        let mut vec = self.by_id.write().unwrap();
        if let Some(idx) = vec.iter().position(|x| x.id == r.id) {
            vec[idx] = r;
        } else {
            vec.push(r);
        }
        Ok(())
    }

    async fn get_by_id(&self, id: &str) -> anyhow::Result<Option<Reservation>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.iter().find(|x| x.id == id).cloned())
    }

    async fn get_by_confirmation_number(
        &self,
        num: &str,
    ) -> anyhow::Result<Option<Reservation>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.iter().find(|x| x.confirmation_number == num).cloned())
    }

    async fn all(&self) -> anyhow::Result<Vec<Reservation>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.clone())
    }
}
