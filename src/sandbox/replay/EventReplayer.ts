import { DomainEvent } from "../../shared/DomainEvent";
import { Job } from "../../jobs/Job";
import { Driver } from "../../drivers/Driver";

export class EventReplayer {
  static replayJobs(events: DomainEvent[]): Map<string, Job> {
    const jobs = new Map<string, Job>();

    for (const e of events) {
      if ("jobId" in e) {
        if (!jobs.has(e.jobId)) {
          jobs.set(e.jobId, new Job(e.jobId));
        }
        this.applyJobEvent(jobs.get(e.jobId)!, e);
      }
    }

    return jobs;
  }

  static replayDrivers(events: DomainEvent[]): Map<string, Driver> {
    const drivers = new Map<string, Driver>();

    for (const e of events) {
      if ("driverId" in e) {
        if (!drivers.has(e.driverId)) {
          drivers.set(e.driverId, new Driver(e.driverId));
        }
        this.applyDriverEvent(drivers.get(e.driverId)!, e);
      }
    }

    return drivers;
  }

  private static applyJobEvent(job: Job, e: DomainEvent) {
    switch (e.type) {
      case "job.state_changed":
        (job as any).state = e.newState;
        break;
      case "job.assigned":
        (job as any).driverId = e.driverId;
        (job as any).vehicleId = e.vehicleId;
        break;
    }
  }

  private static applyDriverEvent(driver: Driver, e: DomainEvent) {
    if (e.type === "driver.status_changed") {
      (driver as any).status = e.newStatus;
    }
  }
}
