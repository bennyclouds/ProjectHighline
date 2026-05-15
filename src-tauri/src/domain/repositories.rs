use async_trait::async_trait;

use crate::domain::{Trip, Reservation, Vehicle, Driver};

#[async_trait]
pub trait TripRepository: Send + Sync {
    async fn save(&self, trip: Trip) -> anyhow::Result<()>;
    async fn get_by_id(&self, id: &str) -> anyhow::Result<Option<Trip>>;
    async fn get_by_trip_number(&self, trip_number: &str) -> anyhow::Result<Option<Trip>>;
    async fn all(&self) -> anyhow::Result<Vec<Trip>>;
}

#[async_trait]
pub trait ReservationRepository: Send + Sync {
    async fn save(&self, r: Reservation) -> anyhow::Result<()>;
    async fn get_by_id(&self, id: &str) -> anyhow::Result<Option<Reservation>>;
    async fn get_by_confirmation_number(
        &self,
        num: &str,
    ) -> anyhow::Result<Option<Reservation>>;
    async fn all(&self) -> anyhow::Result<Vec<Reservation>>;
}

#[async_trait]
pub trait VehicleRepository: Send + Sync {
    async fn save(&self, v: Vehicle) -> anyhow::Result<()>;
    async fn get_by_id(&self, id: &str) -> anyhow::Result<Option<Vehicle>>;
    async fn get_by_car_number(&self, car_number: &str) -> anyhow::Result<Option<Vehicle>>;
    async fn all(&self) -> anyhow::Result<Vec<Vehicle>>;
}

#[async_trait]
pub trait DriverRepository: Send + Sync {
    async fn save(&self, d: Driver) -> anyhow::Result<()>;
    async fn get_by_id(&self, id: &str) -> anyhow::Result<Option<Driver>>;
    async fn all(&self) -> anyhow::Result<Vec<Driver>>;
}
