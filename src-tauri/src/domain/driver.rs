use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Driver {
    pub id: String,
    pub name: String,
    pub phone: Option<String>,
    pub home_city: Option<String>,
    pub languages: Vec<String>,
    pub real_id: bool,
    pub chicago_license: bool,
    pub rating: Option<f32>,
}

impl Driver {
    pub fn new(id: String, name: String) -> Self {
        Driver {
            id,
            name,
            phone: None,
            home_city: None,
            languages: Vec::new(),
            real_id: false,
            chicago_license: false,
            rating: None,
        }
    }
}
