/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
// import { readFile } from 'node:fs/promises';
import { ClientError, errorMiddleware } from './lib/index.js';

const app = express();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(express.json());

// interface Entry {
//   entryId: number;
//   notes: string;
//   photoUrl: string;
//   title: string;
// }

// async function readEntry(): Promise<Entry> {
//   const entry = await readFile('/api/entries', 'utf8');
//   return JSON.parse(entry);
// }

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
    select *
    from "entries"
    `;
    const result = await db.query(sql);
    const entries = result.rows;
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
