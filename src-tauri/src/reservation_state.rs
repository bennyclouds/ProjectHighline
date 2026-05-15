use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum ReservationState {
    New,
    Assigned,
    CheckedIn,
    PaxOnboard,
    Completed,
    Cancelled,
}

impl ToString for ReservationState {
    fn to_string(&self) -> String {
        match self {
            ReservationState::New => "NEW",
            ReservationState::Assigned => "ASSIGNED",
            ReservationState::CheckedIn => "CHECKED_IN",
            ReservationState::PaxOnboard => "PAX_ONBOARD",
            ReservationState::Completed => "COMPLETED",
            ReservationState::Cancelled => "CANCELLED",
        }
        .into()
    }
}
