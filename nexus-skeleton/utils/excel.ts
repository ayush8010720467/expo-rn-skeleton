import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';

export const excelUtils = {
  async parseExcelFile(uri: string) {
    try {
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      return data;
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      throw error;
    }
  },

  async createExcelFile(data: any[], filename: string) {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const uri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return uri;
    } catch (error) {
      console.error('Error creating Excel file:', error);
      throw error;
    }
  },
};

