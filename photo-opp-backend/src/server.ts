import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend is running on http://localhost:${PORT}`);
  console.log(`CORS configured for origin: http://localhost:3000`);
});
