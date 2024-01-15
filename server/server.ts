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

interface Entry {
  title: string;
  photoUrl: string;
  notes: string;
}

app.post('/api/entries', async (req, res, next) => {
  try {
    const newEntry: Entry = req.body;
    if (!newEntry || !newEntry.title || newEntry.photoUrl || newEntry.notes) {
      throw new ClientError(400, 'No name provided');
    }
    const sql = `
    insert into "entries" ("title", "notes", "photoUrl")
    values ($1, $2, $3)
    returning *;
    `;
  } catch (err) {
    console.error(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
