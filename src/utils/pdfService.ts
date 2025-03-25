
import { PDFDocument, SupabasePDFDocument } from './types';
import { supabase } from './supabase';

// Convert Supabase format to our app format
const mapToAppFormat = (doc: SupabasePDFDocument): PDFDocument => {
  return {
    id: doc.id,
    title: doc.title,
    fileName: doc.file_name,
    url: doc.path ? `${supabase.storage.from('pdfs').getPublicUrl(doc.path).data?.publicUrl}` : '',
    uploadedAt: doc.created_at,
    size: doc.size,
    path: doc.path
  };
};

// Get all PDF documents
export const getPDFDocuments = async (): Promise<PDFDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
    
    return data.map(mapToAppFormat);
  } catch (error) {
    console.error('Error in getPDFDocuments:', error);
    return [];
  }
};

// Get PDF by ID
export const getPDFDocumentById = async (id: string): Promise<PDFDocument | undefined> => {
  try {
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching document by ID:', error);
      return undefined;
    }
    
    return mapToAppFormat(data as SupabasePDFDocument);
  } catch (error) {
    console.error('Error in getPDFDocumentById:', error);
    return undefined;
  }
};

// Add a new PDF document
export const addPDFDocument = async (
  file: File,
  title: string
): Promise<PDFDocument | null> => {
  try {
    // 1. Upload file to storage
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `public/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }
    
    // 2. Get the public URL
    const { data: urlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);
    
    if (!urlData?.publicUrl) {
      console.error('Could not get public URL for uploaded file');
      return null;
    }
    
    // 3. Store metadata in database
    const { data, error: dbError } = await supabase
      .from('pdf_documents')
      .insert({
        title,
        file_name: file.name,
        size: file.size,
        path: filePath
      })
      .select('*')
      .single();
    
    if (dbError || !data) {
      console.error('Error inserting document metadata:', dbError);
      return null;
    }
    
    return mapToAppFormat(data as SupabasePDFDocument);
  } catch (error) {
    console.error('Error in addPDFDocument:', error);
    return null;
  }
};

// Delete a PDF document
export const deletePDFDocument = async (id: string): Promise<boolean> => {
  try {
    // 1. Get the document to find the file path
    const { data: doc, error: fetchError } = await supabase
      .from('pdf_documents')
      .select('path')
      .eq('id', id)
      .single();
    
    if (fetchError || !doc) {
      console.error('Error fetching document for deletion:', fetchError);
      return false;
    }
    
    // 2. Delete file from storage
    if (doc.path) {
      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([doc.path]);
      
      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
      }
    }
    
    // 3. Delete metadata from database
    const { error: dbError } = await supabase
      .from('pdf_documents')
      .delete()
      .eq('id', id);
    
    if (dbError) {
      console.error('Error deleting document from database:', dbError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletePDFDocument:', error);
    return false;
  }
};
