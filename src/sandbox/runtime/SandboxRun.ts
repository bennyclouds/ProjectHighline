import { SimulatedClock } from "../time/SimulatedClock";
import { SandboxStore } from "../persistence/SandboxStore";
import { SandboxEventRepository } from "../persistence/SandboxEventRepository";
import { EventReplayer } from "../replay/EventReplayer";
import { SyntheticJobGenerator } from "../generation/SyntheticJobGenerator";
import { MetricsCollector } from "../metrics/MetricsCollector";

export class SandboxRun {
  readonly clock: SimulatedClock;
  readonly store = new SandboxStore();
  readonly events = new SandboxEventRepository(this.store);
  readonly metrics = new MetricsCollector();

  constructor(startTime: number) {
    this.clock = new SimulatedClock(startTime);
  }

  loadHistoricalEvents(events: any[]): void {
    for (const e of events) {
      this.store.events.push(e);
    }
  }

  injectSyntheticJobs(generator: SyntheticJobGenerator, count: number): void {
    const jobs = generator.generate(
      count,
      this.clock.now(),
      15 * 60_000
    );

    for (const job of jobs) {
      this.store.state.set(job.id, job);
    }
  }

  simulateStep(ms: number): void {
    this.clock.advance(ms);
  }

  replayState(): void {
    EventReplayer.replayJobs(this.store.events);
    EventReplayer.replayDrivers(this.store.events);
  }

  snapshotMetrics() {
    return this.metrics.snapshot();
  }
}
