const Database = require('better-sqlite3');
const path = require('path');

let db = null;

function getDb() {
  if (db) return db;

  try {
    const dbPath = path.resolve(__dirname, '../../data/app.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS generation_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT NOT NULL,
        user_agent TEXT,
        game_name TEXT NOT NULL,
        success INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    return db;
  } catch (err) {
    console.error('[SQLite] Init failed:', err.message);
    return null;
  }
}

module.exports = { getDb };
