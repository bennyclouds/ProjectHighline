use std::sync::atomic::{AtomicU64, Ordering};

pub struct TripNumberGeneratorMemory {
    counter: AtomicU64,
}

impl TripNumberGeneratorMemory {
    pub fn new() -> Self {
        TripNumberGeneratorMemory {
            counter: AtomicU64::new(0),
        }
    }

    pub async fn next(&self) -> String {
        let n = self.counter.fetch_add(1, Ordering::SeqCst) + 1;
        format!("{:05}", n)
    }
}
