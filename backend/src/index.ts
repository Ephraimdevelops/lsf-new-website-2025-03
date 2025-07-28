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
import paralegalsRouter from "./routes/paralegals.js";
import usersRouter from "./routes/users.js";
import teamRouter from "./routes/team.js";
import heroRouter from "./routes/hero.js";
import testimonialsRouter from "./routes/testimonials.js";

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
app.use("/paralegals", paralegalsRouter);
app.use("/users", usersRouter);
app.use("/team", teamRouter);
app.use("/hero", heroRouter);
app.use("/testimonials", testimonialsRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
