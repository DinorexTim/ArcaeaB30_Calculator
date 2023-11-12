const sqlite3 = require('sqlite3');
const arcaea = new sqlite3.Database('arc.db');
arcaea.run('CREATE TABLE IF NOT EXISTS user (account TEXT PRIMARY KEY, password TEXT)');
arcaea.run('CREATE TABLE IF NOT EXISTS grade (account TEXT PRIMARY KEY, grade TEXT)');
arcaea.run('CREATE TABLE IF NOT EXISTS comment (id INTEGER PRIMARY KEY, account TEXT, comment TEXT,like INTEGER,fun INTEGER)');
