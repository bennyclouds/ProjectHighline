use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vehicle {
    pub id: String,
    pub car_number: String,
    pub plate: String,
    pub make: String,
    pub model: String,
    pub color: String,
    pub capacity: u32,
}

impl Vehicle {
    pub fn new(
        id: String,
        car_number: String,
        plate: String,
        make: String,
        model: String,
        color: String,
        capacity: u32,
    ) -> Self {
        Vehicle {
            id,
            car_number,
            plate,
            make,
            model,
            color,
            capacity,
        }
    }
}
