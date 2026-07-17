import app from "./app";
import { env } from "./lib/env";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 RideAlong API is running on port ${PORT}`);
});