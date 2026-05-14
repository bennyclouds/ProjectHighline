// src-tauri/src/state.rs

use std::sync::Arc;

use crate::infrastructure::{
    TripRepositoryMemory,
    ReservationRepositoryMemory,
    VehicleRepositoryMemory,
    DriverRepositoryMemory,
    TripNumberGeneratorMemory,
    ReservationNumberGeneratorMemory,
};

pub struct AppState {
    pub trips: Arc<TripRepositoryMemory>,
    pub reservations: Arc<ReservationRepositoryMemory>,
    pub vehicles: Arc<VehicleRepositoryMemory>,
    pub drivers: Arc<DriverRepositoryMemory>,
    pub trip_numbers: Arc<TripNumberGeneratorMemory>,
    pub reservation_numbers: Arc<ReservationNumberGeneratorMemory>,
}

impl AppState {
    pub fn new() -> Self {
        AppState {
            trips: Arc::new(TripRepositoryMemory::new()),
            reservations: Arc::new(ReservationRepositoryMemory::new()),
            vehicles: Arc::new(VehicleRepositoryMemory::new()),
            drivers: Arc::new(DriverRepositoryMemory::new()),
            trip_numbers: Arc::new(TripNumberGeneratorMemory::new()),
            reservation_numbers: Arc::new(ReservationNumberGeneratorMemory::new()),
        }
    }
}
