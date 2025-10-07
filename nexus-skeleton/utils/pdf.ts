import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';

export const pdfUtils = {
  async createPdf(text: string, filename: string) {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText(text, {
        x: 50,
        y: 350,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
      const uri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(uri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return uri;
    } catch (error) {
      console.error('Error creating PDF:', error);
      throw error;
    }
  },

  async readPdf(uri: string) {
    try {
      const pdfBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const pdfBytes = Buffer.from(pdfBase64, 'base64');
      const pdfDoc = await PDFDocument.load(pdfBytes);

      return {
        pageCount: pdfDoc.getPageCount(),
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
      };
    } catch (error) {
      console.error('Error reading PDF:', error);
      throw error;
    }
  },
};

