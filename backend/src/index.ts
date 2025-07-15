import express from "express";
import authRouter from "./routes/auth.js";
import dashboardRouter from "./routes/dashboard.js";
import programsRouter from "./routes/programs.js";
import newsRouter from "./routes/news.js";
import publicationsRouter from "./routes/publications.js";
import opportunitiesRouter from "./routes/opportunities.js";
import resourcesRouter from "./routes/resources.js";
import analyticsRouter from "./routes/analytics.js";
import paralegalFormsRouter from "./routes/paralegalForms.js";
import usersRouter from "./routes/users.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/programs", programsRouter);
app.use("/news", newsRouter);
app.use("/publications", publicationsRouter);
app.use("/opportunities", opportunitiesRouter);
app.use("/resources", resourcesRouter);
app.use("/analytics", analyticsRouter);
app.use("/paralegal-forms", paralegalFormsRouter);
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
