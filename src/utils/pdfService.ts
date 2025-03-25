
import { PDFDocument } from './types';

const PDF_STORAGE_KEY = 'dbms-pdf-documents';

// Initialize sample data if none exists
const initializeStorage = (): void => {
  if (!localStorage.getItem(PDF_STORAGE_KEY)) {
    localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all PDF documents
export const getPDFDocuments = (): PDFDocument[] => {
  initializeStorage();
  const documents = localStorage.getItem(PDF_STORAGE_KEY);
  return documents ? JSON.parse(documents) : [];
};

// Get PDF by ID
export const getPDFDocumentById = (id: string): PDFDocument | undefined => {
  const documents = getPDFDocuments();
  return documents.find(doc => doc.id === id);
};

// Add a new PDF document
export const addPDFDocument = (document: Omit<PDFDocument, 'id' | 'uploadedAt'>): PDFDocument => {
  const documents = getPDFDocuments();
  const newDocument: PDFDocument = {
    ...document,
    id: crypto.randomUUID(),
    uploadedAt: new Date().toISOString()
  };
  
  localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify([...documents, newDocument]));
  return newDocument;
};

// Delete a PDF document
export const deletePDFDocument = (id: string): boolean => {
  const documents = getPDFDocuments();
  const updatedDocuments = documents.filter(doc => doc.id !== id);
  
  if (updatedDocuments.length === documents.length) {
    return false;
  }
  
  localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify(updatedDocuments));
  return true;
};
