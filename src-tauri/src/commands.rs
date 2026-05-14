use tauri::State;

use crate::state::{
    AppState,
};

use crate::summaries::{
    TripSummary,
    ReservationSummary,
    VehicleSummary,
    DriverSummary,
};

use crate::services::{
    CombinedTripAssignmentService,
    DispatcherWorkflowService,
};

// ---------------------------------------------------------
// Fetch Trips
// ---------------------------------------------------------

#[tauri::command]
pub async fn fetch_trips(
    start: String,
    end: String,
    state: State<'_, AppState>,
) -> Result<Vec<TripSummary>, String> {
    let trips = state.trips.all().await.map_err(|e| e.to_string())?;

    let start_ms = chrono::DateTime::parse_from_rfc3339(&start)
        .map_err(|e| e.to_string())?
        .timestamp_millis();

    let end_ms = chrono::DateTime::parse_from_rfc3339(&end)
        .map_err(|e| e.to_string())?
        .timestamp_millis();

    let filtered = trips
        .into_iter()
        .filter(|t| {
            let s = t.start_ms();
            let e = t.end_ms();
            e >= start_ms && s <= end_ms
        })
        .map(TripSummary::from)
        .collect();

    Ok(filtered)
}

// ---------------------------------------------------------
// Fetch Trip by tripNumber
// ---------------------------------------------------------

#[tauri::command]
pub async fn fetch_trip_by_number(
    trip_number: String,
    state: State<'_, AppState>,
) -> Result<Option<TripSummary>, String> {
    let trip = state
        .trips
        .get_by_trip_number(&trip_number)
        .await
        .map_err(|e| e.to_string())?;

    Ok(trip.map(TripSummary::from))
}

// ---------------------------------------------------------
// Create Trip + Assign + Add Reservations
// ---------------------------------------------------------

#[tauri::command]
pub async fn create_trip_assign_and_add_reservations(
    confirmation_numbers: Vec<String>,
    car_number: String,
    driver_id: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let service = CombinedTripAssignmentService::new(
        state.trips.clone(),
        state.reservations.clone(),
        state.vehicles.clone(),
        state.drivers.clone(),
        state.trip_numbers.clone(),
    );

    let trip_number = service
        .create_trip_assign_and_add_reservations(
            confirmation_numbers,
            car_number,
            driver_id,
        )
        .await
        .map_err(|e| e.to_string())?;

    Ok(trip_number)
}

// ---------------------------------------------------------
// Assign Reservation to Trip
// ---------------------------------------------------------

#[tauri::command]
pub async fn assign_reservation_to_trip(
    confirmation_number: String,
    trip_number: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let service = DispatcherWorkflowService::new(
        state.trips.clone(),
        state.reservations.clone(),
        state.vehicles.clone(),
        state.drivers.clone(),
        state.trip_numbers.clone(),
        state.reservation_numbers.clone(),
    );

    service
        .add_reservation_to_trip(&confirmation_number, &trip_number)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

// ---------------------------------------------------------
// Fetch Unassigned Reservations
// ---------------------------------------------------------

#[tauri::command]
pub async fn fetch_unassigned_reservations(
    state: State<'_, AppState>,
) -> Result<Vec<ReservationSummary>, String> {
    let all = state
        .reservations
        .all()
        .await
        .map_err(|e| e.to_string())?;

    let unassigned = all
        .into_iter()
        .filter(|r| r.trip_id().is_none())
        .map(ReservationSummary::from)
        .collect();

    Ok(unassigned)
}

// ---------------------------------------------------------
// Fetch Reservation by confirmationNumber
// ---------------------------------------------------------

#[tauri::command]
pub async fn fetch_reservation_by_confirmation(
    confirmation_number: String,
    state: State<'_, AppState>,
) -> Result<Option<ReservationSummary>, String> {
    let r = state
        .reservations
        .get_by_confirmation_number(&confirmation_number)
        .await
        .map_err(|e| e.to_string())?;

    Ok(r.map(ReservationSummary::from))
}

// ---------------------------------------------------------
// Vehicles
// ---------------------------------------------------------

#[tauri::command]
pub async fn fetch_vehicles(
    state: State<'_, AppState>,
) -> Result<Vec<VehicleSummary>, String> {
    let v = state
        .vehicles
        .all()
        .await
        .map_err(|e| e.to_string())?;

    Ok(v.into_iter().map(VehicleSummary::from).collect())
}

#[tauri::command]
pub async fn fetch_vehicle_by_car_number(
    car_number: String,
    state: State<'_, AppState>,
) -> Result<Option<VehicleSummary>, String> {
    let v = state
        .vehicles
        .get_by_car_number(&car_number)
        .await
        .map_err(|e| e.to_string())?;

    Ok(v.map(VehicleSummary::from))
}

// ---------------------------------------------------------
// Drivers
// ---------------------------------------------------------

#[tauri::command]
pub async fn fetch_drivers(
    state: State<'_, AppState>,
) -> Result<Vec<DriverSummary>, String> {
    let d = state
        .drivers
        .all()
        .await
        .map_err(|e| e.to_string())?;

    Ok(d.into_iter().map(DriverSummary::from).collect())
}

#[tauri::command]
pub async fn fetch_driver_by_id(
    driver_id: String,
    state: State<'_, AppState>,
) -> Result<Option<DriverSummary>, String> {
    let d = state
        .drivers
        .get_by_id(&driver_id)
        .await
        .map_err(|e| e.to_string())?;

    Ok(d.map(DriverSummary::from))
}

// ---------------------------------------------------------
// Ping
// ---------------------------------------------------------

#[tauri::command]
pub async fn ping() -> Result<String, String> {
    Ok("pong".into())
}
