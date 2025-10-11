import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

export interface TestResult {
  id: string;
  name: string;
  category: string;
  status: TestStatus;
  message?: string;
  error?: string;
  startTime?: number;
  endTime?: number;
  executionTime?: number;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  pending: number;
  skipped: number;
  executionTime: number;
  timestamp: string;
}

class TestLogger {
  private results: Map<string, TestResult> = new Map();
  private listeners: Set<(results: TestResult[]) => void> = new Set();

  /**
   * Register a test
   */
  registerTest(id: string, name: string, category: string): void {
    this.results.set(id, {
      id,
      name,
      category,
      status: 'pending',
    });
    this.notifyListeners();
  }

  /**
   * Start a test
   */
  startTest(id: string): void {
    const result = this.results.get(id);
    if (result) {
      result.status = 'running';
      result.startTime = Date.now();
      this.results.set(id, result);
      this.notifyListeners();
    }
  }

  /**
   * Mark test as passed
   */
  passTest(id: string, message?: string): void {
    const result = this.results.get(id);
    if (result) {
      result.status = 'passed';
      result.message = message;
      result.endTime = Date.now();
      result.executionTime = result.startTime ? result.endTime - result.startTime : 0;
      this.results.set(id, result);
      this.notifyListeners();
    }
  }

  /**
   * Mark test as failed
   */
  failTest(id: string, error: string): void {
    const result = this.results.get(id);
    if (result) {
      result.status = 'failed';
      result.error = error;
      result.endTime = Date.now();
      result.executionTime = result.startTime ? result.endTime - result.startTime : 0;
      this.results.set(id, result);
      this.notifyListeners();
    }
  }

  /**
   * Skip a test
   */
  skipTest(id: string, reason?: string): void {
    const result = this.results.get(id);
    if (result) {
      result.status = 'skipped';
      result.message = reason;
      this.results.set(id, result);
      this.notifyListeners();
    }
  }

  /**
   * Get all test results
   */
  getResults(): TestResult[] {
    return Array.from(this.results.values());
  }

  /**
   * Get test result by ID
   */
  getResult(id: string): TestResult | undefined {
    return this.results.get(id);
  }

  /**
   * Get summary statistics
   */
  getSummary(): TestSummary {
    const results = this.getResults();
    const passed = results.filter((r) => r.status === 'passed').length;
    const failed = results.filter((r) => r.status === 'failed').length;
    const pending = results.filter((r) => r.status === 'pending').length;
    const skipped = results.filter((r) => r.status === 'skipped').length;
    const executionTime = results.reduce((sum, r) => sum + (r.executionTime || 0), 0);

    return {
      total: results.length,
      passed,
      failed,
      pending,
      skipped,
      executionTime,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Reset all test results
   */
  reset(): void {
    this.results.forEach((result) => {
      result.status = 'pending';
      result.message = undefined;
      result.error = undefined;
      result.startTime = undefined;
      result.endTime = undefined;
      result.executionTime = undefined;
    });
    this.notifyListeners();
  }

  /**
   * Clear all tests
   */
  clear(): void {
    this.results.clear();
    this.notifyListeners();
  }

  /**
   * Subscribe to test result changes
   */
  subscribe(listener: (results: TestResult[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    const results = this.getResults();
    this.listeners.forEach((listener) => listener(results));
  }

  /**
   * Export results to JSON
   */
  async exportToJSON(): Promise<string> {
    const summary = this.getSummary();
    const results = this.getResults();

    const exportData = {
      summary,
      results,
      metadata: {
        exportedAt: new Date().toISOString(),
        appVersion: '1.0.0',
        platform: 'react-native',
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Save results to file and share
   */
  async shareResults(): Promise<void> {
    try {
      const jsonData = await this.exportToJSON();
      const filename = `test-results-${Date.now()}.json`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonData);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Share Test Results',
          UTI: 'public.json',
        });
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      throw new Error(`Failed to share results: ${error}`);
    }
  }

  /**
   * Get results by category
   */
  getResultsByCategory(category: string): TestResult[] {
    return this.getResults().filter((r) => r.category === category);
  }

  /**
   * Get pass rate percentage
   */
  getPassRate(): number {
    const summary = this.getSummary();
    const completed = summary.passed + summary.failed;
    if (completed === 0) return 0;
    return Math.round((summary.passed / completed) * 100);
  }
}

// Export singleton instance
export const testLogger = new TestLogger();



