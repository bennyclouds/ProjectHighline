import { SyntheticJobProfile } from "./SyntheticJobProfile";
import { Job } from "../../jobs/Job";

export class SyntheticJobGenerator {
  constructor(private readonly profile: SyntheticJobProfile) {}

  generate(count: number, startTime: number, spacingMs: number): Job[] {
    const jobs: Job[] = [];

    for (let i = 0; i < count; i++) {
      const job = new Job(`synthetic-${i}`);
      (job as any).synthetic = true;
      (job as any).serviceStart = startTime + i * spacingMs;
      (job as any).serviceEnd =
        (job as any).serviceStart + this.profile.averageDurationMs;
      jobs.push(job);
    }

    return jobs;
  }
}
