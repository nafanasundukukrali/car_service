import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import "reflect-metadata";

dotenv.config();

const app: Express = express();
const port = process.env.EXPRESS_PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});


// app.use(express.json());
// // app.use(errorHandler);
// const { PORT = 3000 } = process.env;
// // app.use("/auth", userRouter);
// // app.use("/api", movieRouter);

// app.get("*", (req: Request, res: Response) => {
//   res.status(505).json({ message: "Bad Request" });
// });

// AppDataSource.initialize()
//   .then(async () => {
//     app.listen(PORT, () => {
//       console.log("Server is running on http://localhost:" + PORT);
//     });
//     console.log("Data Source has been initialized!");
//   })
//   .catch((error) => console.log(error));