import mongoose from "mongoose";

export const connectToMongoDb = () => {
  try {
    console.log(process.env.DB_CONNECT_URL);
    const connect = mongoose.connect(
      process.env.DB_CONNECT_URL + "/ecom-den-home-database"
    );
    if (connect) {
      console.log(
        `Database connected: ${process.env.DB_CONNECT_URL}/ecom-den-home-database`
      );
    }
  } catch (error) {
    console.log(error);
  }
};
