import { createServer } from "./server";
import { ResetVendorCron } from "./cron-reset";

createServer()
new ResetVendorCron()