import { Server } from "http";
import app from "./app";

const PORT = process.env.PORT || 5000;

async function main() {
  const server : Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
