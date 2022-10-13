import { CronJob } from 'cron';
import * as dotenv from "dotenv";
import controller from './controller';

export class ResetVendorCron {

  cronJob: CronJob;
  pattern: string;

  constructor() {
    dotenv.config();
    this.pattern = process.env.API_reset_cron as string;
    console.debug('ResetVendorCron pattern: ' + this.pattern);

    this.cronJob = new CronJob(this.pattern, async () => {
      console.debug(new Date().toLocaleString() + ' ResetVendorCron job running');
      try {
        await this.reset();
      } catch (e) {
        console.error(e);
      }
    });

    if (!this.cronJob.running) {
      this.cronJob.start();
      console.debug('ResetVendorCron scheduler started');
    }
  }

  async reset(): Promise<void> {
    await controller.resetAPIs();
    console.debug(new Date().toLocaleString() + ' ResetVendorCron job apis:reset');
  }
}
