use std::sync::atomic::{AtomicU64, Ordering};

pub struct ReservationNumberGeneratorMemory {
    counter: AtomicU64,
}

impl ReservationNumberGeneratorMemory {
    pub fn new() -> Self {
        ReservationNumberGeneratorMemory {
            counter: AtomicU64::new(0),
        }
    }

    pub async fn next(&self) -> String {
        let n = self.counter.fetch_add(1, Ordering::SeqCst) + 1;
        format!("{:06}", n)
    }
}
