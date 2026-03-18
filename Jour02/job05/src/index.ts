import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// Données fictives
const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

// Helper pour les réponses
function createResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json(
    createResponse({
      message: "🚀 API Multi-stage Build",
      version: "1.0.0",
      endpoints: ["/health", "/api/users", "/api/users/:id"],
    }),
  );
});

app.get("/health", (req: Request, res: Response) => {
  res.json(
    createResponse({
      status: "healthy",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }),
  );
});

app.get("/api/users", (req: Request, res: Response) => {
  res.json(createResponse(users));
});

app.get("/api/users/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    res.status(404).json({
      success: false,
      error: "User not found",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json(createResponse(user));
});

app.post("/api/users", (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({
      success: false,
      error: "Name and email are required",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const newUser: User = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json(createResponse(newUser));
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 API Multi-stage Build                  ║
║  Server running on http://localhost:${PORT}   ║
║  Environment: ${process.env.NODE_ENV || "development"}              ║
╚════════════════════════════════════════════╝
  `);
});
