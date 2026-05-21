import "dotenv/config";
import express from "express";
import { createPool } from "mysql2/promise";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.options(/.*/, cors());

app.use(express.json());

const dbHost = (process.env.DB_HOST || "db").trim();

const pool = createPool({
  host: dbHost,
  user: "dev",
  password: "etsonmotdepasse",
  database: "demo",
});

app.get("/", async (req, res) => {
  await pool.query("INSERT INTO visites () VALUES ()");
  const [lignes] = await pool.query(
    `SELECT JSON_OBJECT(
      'total', (SELECT COUNT(*) FROM visites),
      'last_visits', (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('id', v.id, 'vue_le', v.vue_le))
        FROM (
          SELECT id, vue_le
          FROM visites
          ORDER BY id DESC
          LIMIT 10
        ) AS v
      )
    ) AS data`,
  );
  const data = lignes[0]?.data;
  res.json(typeof data === "string" ? JSON.parse(data) : data);
});

app.get("/connexion", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "Connexion réussie" });
  } catch (err) {
    res.status(500).json({ status: "ERREUR", message: err.message });
  }
});

async function preparerBase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visites (
        id     INT AUTO_INCREMENT PRIMARY KEY,
        vue_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table 'visites' prête.");
    app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`));
  } catch (err) {
    console.log(
      "Préparation DB échouée (MySQL pas prêt ou erreur SQL). Nouvel essai dans 3 s...",
    );
    console.log(err?.message ?? err);
    setTimeout(preparerBase, 3000);
  }
}

preparerBase();
