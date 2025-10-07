import SQLite from 'react-native-sqlite-storage';

// Enable promise support
SQLite.enablePromise(true);

// Optional: Enable debug mode
// SQLite.DEBUG(true);

const DB_NAME = 'nexus.db';

interface DatabaseInstance {
  db: SQLite.SQLiteDatabase | null;
}

const dbInstance: DatabaseInstance = {
  db: null,
};

export const sqliteUtils = {
  /**
   * Open database connection
   */
  async openDatabase() {
    try {
      if (dbInstance.db) {
        return dbInstance.db;
      }

      dbInstance.db = await SQLite.openDatabase({
        name: DB_NAME,
        location: 'default',
      });

      console.log('Database opened successfully');
      return dbInstance.db;
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  },

  /**
   * Close database connection
   */
  async closeDatabase() {
    try {
      if (dbInstance.db) {
        await dbInstance.db.close();
        dbInstance.db = null;
        console.log('Database closed successfully');
      }
    } catch (error) {
      console.error('Error closing database:', error);
      throw error;
    }
  },

  /**
   * Create a table
   */
  async createTable(tableName: string, columns: string) {
    try {
      const db = await this.openDatabase();
      await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`,
        []
      );
      console.log(`Table ${tableName} created successfully`);
    } catch (error) {
      console.error(`Error creating table ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Insert data into table
   */
  async insert(tableName: string, data: Record<string, any>) {
    try {
      const db = await this.openDatabase();
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const result = await db.executeSql(
        `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
        values
      );

      console.log(`Inserted into ${tableName}:`, result);
      return result[0].insertId;
    } catch (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Query data from table
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const db = await this.openDatabase();
      const results = await db.executeSql(sql, params);

      const rows: T[] = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        rows.push(results[0].rows.item(i));
      }

      return rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  },

  /**
   * Update data in table
   */
  async update(tableName: string, data: Record<string, any>, where: string, whereArgs: any[] = []) {
    try {
      const db = await this.openDatabase();
      const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), ...whereArgs];

      const result = await db.executeSql(
        `UPDATE ${tableName} SET ${setClause} WHERE ${where}`,
        values
      );

      console.log(`Updated ${tableName}:`, result);
      return result[0].rowsAffected;
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Delete data from table
   */
  async delete(tableName: string, where: string, whereArgs: any[] = []) {
    try {
      const db = await this.openDatabase();
      const result = await db.executeSql(
        `DELETE FROM ${tableName} WHERE ${where}`,
        whereArgs
      );

      console.log(`Deleted from ${tableName}:`, result);
      return result[0].rowsAffected;
    } catch (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Drop table
   */
  async dropTable(tableName: string) {
    try {
      const db = await this.openDatabase();
      await db.executeSql(`DROP TABLE IF EXISTS ${tableName}`, []);
      console.log(`Table ${tableName} dropped successfully`);
    } catch (error) {
      console.error(`Error dropping table ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Execute raw SQL
   */
  async executeSql(sql: string, params: any[] = []) {
    try {
      const db = await this.openDatabase();
      const result = await db.executeSql(sql, params);
      return result;
    } catch (error) {
      console.error('Error executing SQL:', error);
      throw error;
    }
  },
};

/**
 * Example: Initialize a sample users table
 */
export async function initializeSampleDatabase() {
  try {
    await sqliteUtils.createTable(
      'users',
      'id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
    );
    console.log('Sample database initialized');
  } catch (error) {
    console.error('Error initializing sample database:', error);
    throw error;
  }
}

