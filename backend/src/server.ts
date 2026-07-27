import app from "./app";
import { env } from "./lib/env";

// const PORT = env.PORT;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 RideAlong API is running on port ${PORT}`);
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 RideAlong API running on port ${PORT}`);
});