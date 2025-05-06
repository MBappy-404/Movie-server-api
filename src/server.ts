import { Server } from "http";
import app from "./app";
import startScheduler from "./app/utils/scheduler";

const PORT = process.env.PORT || 5000;

async function main() {
  // Start the payment cleanup scheduler
  startScheduler();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
