# SQLite Integration Guide

## Overview

The Nexus Skeleton app now includes `react-native-sqlite-storage`, a robust SQLite database solution for React Native with full SQL support.

## 📦 Package Information

- **Package**: `react-native-sqlite-storage`
- **Type**: Native module
- **Features**: Full SQL support, transactions, promise-based API
- **Storage**: Local SQLite database file

## 🎯 Features Implemented

### Core Operations
- ✅ **Database Connection Management**
- ✅ **Table Creation & Deletion**
- ✅ **Insert Operations**
- ✅ **Query/Select Operations**
- ✅ **Update Operations**
- ✅ **Delete Operations**
- ✅ **Raw SQL Execution**

### Utility Functions
All operations are available through `sqliteUtils` in `utils/sqlite.ts`:

```typescript
import { sqliteUtils, initializeSampleDatabase } from '../utils/sqlite';
```

## 📚 API Reference

### Open Database
```typescript
const db = await sqliteUtils.openDatabase();
```

### Close Database
```typescript
await sqliteUtils.closeDatabase();
```

### Create Table
```typescript
await sqliteUtils.createTable(
  'users',
  'id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
);
```

### Insert Data
```typescript
const userId = await sqliteUtils.insert('users', {
  name: 'John Doe',
  email: 'john@example.com',
});
// Returns: insertId (number)
```

### Query Data
```typescript
const users = await sqliteUtils.query('SELECT * FROM users WHERE id = ?', [1]);
// Returns: Array of results
```

### Update Data
```typescript
const rowsAffected = await sqliteUtils.update(
  'users',
  { name: 'Jane Doe', email: 'jane@example.com' },
  'id = ?',
  [1]
);
// Returns: number of rows affected
```

### Delete Data
```typescript
const rowsAffected = await sqliteUtils.delete('users', 'id = ?', [1]);
// Returns: number of rows affected
```

### Drop Table
```typescript
await sqliteUtils.dropTable('users');
```

### Execute Raw SQL
```typescript
const result = await sqliteUtils.executeSql(
  'CREATE INDEX idx_email ON users(email)',
  []
);
```

## 💡 Usage Examples

### Example 1: Simple CRUD Operations
```typescript
import { sqliteUtils } from './utils/sqlite';

// Create table
await sqliteUtils.createTable(
  'products',
  'id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, stock INTEGER'
);

// Insert
const productId = await sqliteUtils.insert('products', {
  name: 'Laptop',
  price: 999.99,
  stock: 10,
});

// Query all
const allProducts = await sqliteUtils.query('SELECT * FROM products');

// Query with condition
const expensiveProducts = await sqliteUtils.query(
  'SELECT * FROM products WHERE price > ?',
  [500]
);

// Update
await sqliteUtils.update(
  'products',
  { stock: 5 },
  'id = ?',
  [productId]
);

// Delete
await sqliteUtils.delete('products', 'id = ?', [productId]);
```

### Example 2: Complex Queries
```typescript
// Join queries
const results = await sqliteUtils.query(`
  SELECT users.name, orders.total
  FROM users
  INNER JOIN orders ON users.id = orders.user_id
  WHERE orders.status = ?
`, ['completed']);

// Aggregation
const stats = await sqliteUtils.query(`
  SELECT
    COUNT(*) as total_users,
    AVG(age) as avg_age
  FROM users
`);
```

### Example 3: Transactions (Advanced)
```typescript
// Get database instance
const db = await sqliteUtils.openDatabase();

// Start transaction
await db.transaction(async (tx) => {
  await tx.executeSql('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Alice', 1000]);
  await tx.executeSql('INSERT INTO accounts (name, balance) VALUES (?, ?)', ['Bob', 500]);
  await tx.executeSql('UPDATE accounts SET balance = balance - 100 WHERE name = ?', ['Alice']);
  await tx.executeSql('UPDATE accounts SET balance = balance + 100 WHERE name = ?', ['Bob']);
});
```

## 🧪 Testing

The integration test is available in the "Tests" tab:

1. Open the app
2. Navigate to "Tests" tab
3. Click "Test SQLite"
4. Observe results:
   - ✅ Database initialized
   - ✅ User inserted with ID
   - ✅ Found X user(s)
   - ✅ Updated X row(s)
   - ✅ Deleted X row(s)

## 🏗️ Database Schema Example

```typescript
// Initialize your app database
export async function initializeAppDatabase() {
  // Users table
  await sqliteUtils.createTable(
    'users',
    `id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT UNIQUE NOT NULL,
     email TEXT UNIQUE NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP`
  );

  // Products table
  await sqliteUtils.createTable(
    'products',
    `id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     description TEXT,
     price REAL NOT NULL,
     stock INTEGER DEFAULT 0,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP`
  );

  // Orders table
  await sqliteUtils.createTable(
    'orders',
    `id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER NOT NULL,
     product_id INTEGER NOT NULL,
     quantity INTEGER NOT NULL,
     total REAL NOT NULL,
     status TEXT DEFAULT 'pending',
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (product_id) REFERENCES products(id)`
  );

  // Create indexes
  await sqliteUtils.executeSql('CREATE INDEX idx_user_email ON users(email)', []);
  await sqliteUtils.executeSql('CREATE INDEX idx_order_status ON orders(status)', []);
}
```

## 🔧 Configuration

### Enable Debug Mode
In `utils/sqlite.ts`, uncomment:
```typescript
SQLite.DEBUG(true);
```

### Database Location
The database is stored in the app's default location:
- **iOS**: `Library/LocalDatabase`
- **Android**: `data/data/{package_name}/databases/`

### Database Name
Default: `nexus.db`

To change, modify `DB_NAME` in `utils/sqlite.ts`:
```typescript
const DB_NAME = 'your-database-name.db';
```

## ⚠️ Important Notes

### Native Module
- Requires native code rebuild
- Run `npx expo prebuild --clean` after installation
- Not compatible with Expo Go (requires development build)

### Performance Tips
1. Use transactions for bulk operations
2. Create indexes on frequently queried columns
3. Use prepared statements (automatically handled)
4. Close database connections when not needed

### Error Handling
All operations are wrapped in try-catch blocks. Errors are logged to console.

```typescript
try {
  const users = await sqliteUtils.query('SELECT * FROM users');
} catch (error) {
  console.error('Database error:', error);
  // Handle error appropriately
}
```

### Data Types
SQLite supports these data types:
- **INTEGER**: Whole numbers
- **REAL**: Floating point numbers
- **TEXT**: String data
- **BLOB**: Binary data
- **NULL**: Null value

### Type Safety
The query function supports TypeScript generics:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const users = await sqliteUtils.query<User>('SELECT * FROM users');
// users is now typed as User[]
```

## 🚀 Migration from Other Storage

### From AsyncStorage
```typescript
// Before (AsyncStorage)
await AsyncStorage.setItem('user', JSON.stringify(userData));
const user = JSON.parse(await AsyncStorage.getItem('user'));

// After (SQLite)
await sqliteUtils.insert('users', userData);
const users = await sqliteUtils.query('SELECT * FROM users WHERE id = ?', [userId]);
```

### From MMKV
```typescript
// Before (MMKV)
storage.set('user', JSON.stringify(userData));
const user = JSON.parse(storage.getString('user'));

// After (SQLite)
await sqliteUtils.insert('users', userData);
const users = await sqliteUtils.query('SELECT * FROM users WHERE id = ?', [userId]);
```

## 📊 When to Use SQLite vs MMKV

### Use SQLite for:
- ✅ Relational data with complex queries
- ✅ Large datasets (thousands of records)
- ✅ Data that needs indexing
- ✅ Complex filtering and sorting
- ✅ Transactions and data integrity

### Use MMKV for:
- ✅ Simple key-value storage
- ✅ App settings and preferences
- ✅ Fast read/write operations
- ✅ Small data sets
- ✅ No query requirements

## 🔗 Resources

- [react-native-sqlite-storage GitHub](https://github.com/andpor/react-native-sqlite-storage)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [SQL Tutorial](https://www.w3schools.com/sql/)

## 🎯 Next Steps

1. **Initialize your database schema** on app startup
2. **Create repository/service layer** for database operations
3. **Implement data migrations** for schema changes
4. **Add proper error handling** for production
5. **Consider adding TypeORM or similar** for advanced use cases

---

**SQLite is now ready to use in your Nexus Skeleton app!** 🎉

