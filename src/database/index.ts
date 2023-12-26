import { blue } from "colors";
import mongoose, { ConnectOptions } from "mongoose";
import config from "../config";

export default async function () {
  mongoose.set("strictQuery", false);

  // mongoose.set("strictQuery", false);
  mongoose
    .connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "hexeel-dev"
    } as ConnectOptions)
    .then(() => {
      console.log(blue(`DB connected ✅`));
    })
    .catch((error) => console.log(`${error} did not connect`));
}
