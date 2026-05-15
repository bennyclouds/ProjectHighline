use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum TripState {
    Draft,
    Ready,
    EnRoute,
    Completed,
    Cancelled,
}

impl ToString for TripState {
    fn to_string(&self) -> String {
        match self {
            TripState::Draft => "DRAFT",
            TripState::Ready => "READY",
            TripState::EnRoute => "EN_ROUTE",
            TripState::Completed => "COMPLETED",
            TripState::Cancelled => "CANCELLED",
        }
        .into()
    }
}
