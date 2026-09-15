import "dotenv/config";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDirectory = path.join(process.cwd(), "data");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const dbPath = path.join(dataDirectory, "inquiries.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project TEXT NOT NULL,
    budget TEXT,
    timeline TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    received_at TEXT NOT NULL
  )
`);

export interface Inquiry {
  name: string;
  email: string;
  project: string;
  budget?: string;
  timeline?: string;
}

export const saveInquiry = (inquiry: Inquiry) => {
  const statement = db.prepare(`
    INSERT INTO inquiries (
      name,
      email,
      project,
      budget,
      timeline,
      status,
      received_at
    )
    VALUES (
      @name,
      @email,
      @project,
      @budget,
      @timeline,
      'new',
      @receivedAt
    )
  `);

  const result = statement.run({
    name: inquiry.name,
    email: inquiry.email,
    project: inquiry.project,
    budget: inquiry.budget || "",
    timeline: inquiry.timeline || "",
    receivedAt: new Date().toISOString(),
  });

  return result.lastInsertRowid;
};

export const getInquiries = () => {
  const statement = db.prepare(`
    SELECT
      id,
      name,
      email,
      project,
      budget,
      timeline,
      status,
      received_at
    FROM inquiries
    ORDER BY id DESC
  `);

  return statement.all();
};