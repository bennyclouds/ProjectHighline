use std::sync::RwLock;

use async_trait::async_trait;

use crate::domain::{Driver, DriverRepository};

pub struct DriverRepositoryMemory {
    by_id: RwLock<Vec<Driver>>,
}

impl DriverRepositoryMemory {
    pub fn new() -> Self {
        DriverRepositoryMemory {
            by_id: RwLock::new(Vec::new()),
        }
    }
}

#[async_trait]
impl DriverRepository for DriverRepositoryMemory {
    async fn save(&self, d: Driver) -> anyhow::Result<()> {
        let mut vec = self.by_id.write().unwrap();
        if let Some(idx) = vec.iter().position(|x| x.id == d.id) {
            vec[idx] = d;
        } else {
            vec.push(d);
        }
        Ok(())
    }

    async fn get_by_id(&self, id: &str) -> anyhow::Result<Option<Driver>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.iter().find(|x| x.id == id).cloned())
    }

    async fn all(&self) -> anyhow::Result<Vec<Driver>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.clone())
    }
}
