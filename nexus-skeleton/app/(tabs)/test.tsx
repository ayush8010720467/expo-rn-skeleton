import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useExampleStore } from '../../stores/useExampleStore';
import { storageUtils } from '../../utils/storage';
import { pickDocument } from '../../utils/documentPicker';
import { getContacts } from '../../utils/contacts';
import { excelUtils } from '../../utils/excel';
import { pdfUtils } from '../../utils/pdf';
import { sqliteUtils, initializeSampleDatabase } from '../../utils/sqlite';
import * as Sharing from 'expo-sharing';

export default function TestScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const { count, increment } = useExampleStore();

  const addResult = (result: string) => {
    setTestResults((prev) => [...prev, result]);
  };

  const testZustand = () => {
    increment();
    addResult(`✅ Zustand: Count is ${count + 1}`);
  };

  const testMMKV = () => {
    storageUtils.setItem('test', 'Hello MMKV');
    const value = storageUtils.getItem('test');
    addResult(`✅ MMKV: ${value}`);
  };

  const testDocumentPicker = async () => {
    try {
      const result = await pickDocument();
      addResult(`✅ Document Picker: ${result?.name || 'Cancelled'}`);
    } catch (error) {
      addResult(`❌ Document Picker: ${error}`);
    }
  };

  const testContacts = async () => {
    try {
      const contacts = await getContacts();
      addResult(`✅ Contacts: Found ${contacts.length} contacts`);
    } catch (error) {
      addResult(`❌ Contacts: ${error}`);
    }
  };

  const testPDF = async () => {
    try {
      const uri = await pdfUtils.createPdf('Test PDF Content', 'test.pdf');
      addResult(`✅ PDF: Created at ${uri}`);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
        addResult(`✅ PDF: Shared successfully`);
      }
    } catch (error) {
      addResult(`❌ PDF: ${error}`);
    }
  };

  const testExcel = async () => {
    try {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];
      const uri = await excelUtils.createExcelFile(data, 'test.xlsx');
      addResult(`✅ Excel: Created at ${uri}`);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
        addResult(`✅ Excel: Shared successfully`);
      }
    } catch (error) {
      addResult(`❌ Excel: ${error}`);
    }
  };

  const testSQLite = async () => {
    try {
      // Initialize database
      await initializeSampleDatabase();
      addResult(`✅ SQLite: Database initialized`);

      // Insert a test user
      const userId = await sqliteUtils.insert('users', {
        name: 'Test User',
        email: 'test@example.com',
      });
      addResult(`✅ SQLite: User inserted with ID ${userId}`);

      // Query users
      const users = await sqliteUtils.query('SELECT * FROM users');
      addResult(`✅ SQLite: Found ${users.length} user(s)`);

      // Update user
      const updated = await sqliteUtils.update(
        'users',
        { name: 'Updated User' },
        'id = ?',
        [userId]
      );
      addResult(`✅ SQLite: Updated ${updated} row(s)`);

      // Delete user
      const deleted = await sqliteUtils.delete('users', 'id = ?', [userId]);
      addResult(`✅ SQLite: Deleted ${deleted} row(s)`);
    } catch (error) {
      addResult(`❌ SQLite: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Integration Tests</Text>

      <View style={styles.buttonContainer}>
        <Button title="Test Zustand" onPress={testZustand} />
        <Button title="Test MMKV" onPress={testMMKV} />
        <Button title="Test SQLite" onPress={testSQLite} />
        <Button title="Test Document Picker" onPress={testDocumentPicker} />
        <Button title="Test Contacts" onPress={testContacts} />
        <Button title="Test PDF" onPress={testPDF} />
        <Button title="Test Excel" onPress={testExcel} />
        <Button
          title="Clear Results"
          onPress={() => setTestResults([])}
          color="red"
        />
      </View>

      <View style={styles.resultsContainer}>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.result}>
            {result}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  resultsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  result: {
    fontSize: 14,
    marginVertical: 5,
    fontFamily: 'monospace',
  },
});

