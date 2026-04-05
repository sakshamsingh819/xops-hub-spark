import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const email = (process.argv[2] || "").toLowerCase().trim();
if (!email) {
  throw new Error("Usage: npm run promote-admin -- <email>");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
});

const run = async () => {
  const result = await pool.query(
    "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, email, role",
    [email]
  );

  if (!result.rows[0]) {
    console.log("No user found for email:", email);
  } else {
    console.log("Promoted to admin:", result.rows[0]);
  }

  await pool.end();
};

run().catch(async (error) => {
  console.error("Promote admin failed", error);
  await pool.end();
  process.exit(1);
});
