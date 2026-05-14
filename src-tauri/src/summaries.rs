// src-tauri/src/summaries.rs

use serde::{Serialize, Deserialize};

use crate::domain::{
    Trip,
    Reservation,
    Vehicle,
    Driver,
};

//
// TripSummary
//

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TripSummary {
    pub id: String,
    pub trip_number: String,
    pub vehicle_id: String,
    pub driver_id: Option<String>,
    pub state: String,
    pub start: String,
    pub end: String,
    pub reservations: Vec<String>, // confirmation numbers
}

impl From<Trip> for TripSummary {
    fn from(t: Trip) -> Self {
        TripSummary {
            id: t.id.clone(),
            trip_number: t.trip_number.clone(),
            vehicle_id: t.vehicle_id.clone(),
            driver_id: t.driver_id.clone(),
            state: t.state.to_string(),
            start: t.start_iso(),
            end: t.end_iso(),
            reservations: t
                .reservations
                .iter()
                .map(|r| r.confirmation_number.clone())
                .collect(),
        }
    }
}

//
// ReservationSummary
//

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReservationSummary {
    pub id: String,
    pub confirmation_number: String,
    pub passenger_name: String,
    pub pickup_time: String,
    pub flight_status: Option<String>,
    pub pickup_location: String,
    pub dropoff_location: String,
    pub state: String,
    pub trip_id: Option<String>,
}

impl From<Reservation> for ReservationSummary {
    fn from(r: Reservation) -> Self {
        ReservationSummary {
            id: r.id.clone(),
            confirmation_number: r.confirmation_number.clone(),
            passenger_name: r.passenger_name.clone(),
            pickup_time: r.pickup_time_iso(),
            flight_status: r.flight_status.clone(),
            pickup_location: r.pickup_location.clone(),
            dropoff_location: r.dropoff_location.clone(),
            state: r.state.to_string(),
            trip_id: r.trip_id.clone(),
        }
    }
}

//
// VehicleSummary
//

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VehicleSummary {
    pub id: String,
    pub car_number: String,
    pub plate: String,
    pub make: String,
    pub model: String,
    pub color: String,
    pub capacity: u32,
}

impl From<Vehicle> for VehicleSummary {
    fn from(v: Vehicle) -> Self {
        VehicleSummary {
            id: v.id.clone(),
            car_number: v.car_number.clone(),
            plate: v.plate.clone(),
            make: v.make.clone(),
            model: v.model.clone(),
            color: v.color.clone(),
            capacity: v.capacity,
        }
    }
}

//
// DriverSummary
//

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DriverSummary {
    pub id: String,
    pub name: String,
    pub phone: Option<String>,
    pub home_city: Option<String>,
    pub languages: Vec<String>,
    pub real_id: bool,
    pub chicago_license: bool,
    pub rating: Option<f32>,
}

impl From<Driver> for DriverSummary {
    fn from(d: Driver) -> Self {
        DriverSummary {
            id: d.id.clone(),
            name: d.name.clone(),
            phone: d.phone.clone(),
            home_city: d.home_city.clone(),
            languages: d.languages.clone(),
            real_id: d.real_id,
            chicago_license: d.chicago_license,
            rating: d.rating,
        }
    }
}
