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

app.post('/api/entries', async (req, res, next) => {
  try {
    const title = req.body.title;
    const notes = req.body.notes;
    const photoUrl = req.body.photoUrl;
    if (!title || !photoUrl || !notes) {
      throw new ClientError(400, 'No name provided');
    }
    const sql = `
    insert into "entries" ("title", "notes", "photoUrl")
    values ($1, $2, $3)
    returning *;
    `;
    const params = [title, notes, photoUrl];
    const result = await db.query(sql, params);
    const entry = result.rows[0];
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
