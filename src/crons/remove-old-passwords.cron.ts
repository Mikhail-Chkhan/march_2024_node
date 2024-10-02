import { CronJob } from "cron";

import { timeHelper } from "../helpers/time.helper";
import { passwordRepository } from "../repositories/password.repository";

const handler = async () => {
  try {
    const date = timeHelper.subtractByParams(90, "day");
    const deletedCount = await passwordRepository.deleteBeforeDate(date);
    console.log(`Deleted ${deletedCount} old passwords`);
  } catch (error) {
    console.error(error);
  }
};

export const removeOldPasswordsCronJob = new CronJob("0 30 23 * * *", handler);
