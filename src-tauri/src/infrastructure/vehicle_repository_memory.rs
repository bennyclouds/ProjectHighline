use std::sync::RwLock;

use async_trait::async_trait;

use crate::domain::{Vehicle, VehicleRepository};

pub struct VehicleRepositoryMemory {
    by_id: RwLock<Vec<Vehicle>>,
}

impl VehicleRepositoryMemory {
    pub fn new() -> Self {
        VehicleRepositoryMemory {
            by_id: RwLock::new(Vec::new()),
        }
    }
}

#[async_trait]
impl VehicleRepository for VehicleRepositoryMemory {
    async fn save(&self, v: Vehicle) -> anyhow::Result<()> {
        let mut vec = self.by_id.write().unwrap();
        if let Some(idx) = vec.iter().position(|x| x.id == v.id) {
            vec[idx] = v;
        } else {
            vec.push(v);
        }
        Ok(())
    }

    async fn get_by_id(&self, id: &str) -> anyhow::Result<Option<Vehicle>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.iter().find(|x| x.id == id).cloned())
    }

    async fn get_by_car_number(&self, car_number: &str) -> anyhow::Result<Option<Vehicle>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.iter().find(|x| x.car_number == car_number).cloned())
    }

    async fn all(&self) -> anyhow::Result<Vec<Vehicle>> {
        let vec = self.by_id.read().unwrap();
        Ok(vec.clone())
    }
}
