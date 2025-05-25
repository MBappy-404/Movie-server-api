import { DiscountService } from "../modules/Discount/discount.service";
import cleanupUnpaidPayments from "./cleanupUnpaidPayments";


// Run cleanup every hour
const SCHEDULE_INTERVAL = 60 * 60 * 2000; // 2 hour in milliseconds

const startScheduler = () => {
  console.log("Starting schedulers...");
  
  // Run payment cleanup immediately on startup
  cleanupUnpaidPayments();
  
  // Run discount deactivation immediately on startup
  DiscountService.deactivateExpiredDiscounts();
  
  // Schedule payment cleanup to run every hour
  setInterval(cleanupUnpaidPayments, SCHEDULE_INTERVAL);
  
  // Schedule discount deactivation to run every hour
  setInterval(DiscountService.deactivateExpiredDiscounts, SCHEDULE_INTERVAL);
};

export default startScheduler; 