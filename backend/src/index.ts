import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
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

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL as string,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  // Add common Vercel domains
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*\.vercel\.dev$/,
].filter(Boolean) as (string | RegExp)[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Check exact matches
    if (allowedOrigins.some(allowed => 
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    )) {
      return callback(null, true);
    }
    
    console.log(`CORS blocked for origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true, // Enable credentials for cookie-based auth
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Logging middleware
app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.get("/", (req, res) => {
  res.json({ 
    status: "LSF Backend API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV
  });
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

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 LSF Backend API listening on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});
