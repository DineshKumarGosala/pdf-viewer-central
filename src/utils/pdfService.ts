
import { PDFDocument, SupabasePDFDocument } from './types';
import { supabase, getPublicFileUrl } from './supabase';

// Convert Supabase format to our app format
const mapToAppFormat = (doc: SupabasePDFDocument): PDFDocument => {
  return {
    id: doc.id,
    title: doc.title,
    fileName: doc.file_name,
    url: doc.path ? getPublicFileUrl(doc.path) : '',
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
      throw error;
    }
    
    return (data || []).map(mapToAppFormat);
  } catch (error) {
    console.error('Error in getPDFDocuments:', error);
    throw error;
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
      throw error;
    }
    
    return mapToAppFormat(data as SupabasePDFDocument);
  } catch (error) {
    console.error('Error in getPDFDocumentById:', error);
    throw error;
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
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf'
      });
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }
    
    // 2. Store metadata in database
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
      throw dbError;
    }
    
    return mapToAppFormat(data as SupabasePDFDocument);
  } catch (error) {
    console.error('Error in addPDFDocument:', error);
    throw error;
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
      throw fetchError;
    }
    
    // 2. Delete file from storage
    if (doc.path) {
      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([doc.path]);
      
      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        throw storageError;
      }
    }
    
    // 3. Delete metadata from database
    const { error: dbError } = await supabase
      .from('pdf_documents')
      .delete()
      .eq('id', id);
    
    if (dbError) {
      console.error('Error deleting document from database:', dbError);
      throw dbError;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletePDFDocument:', error);
    throw error;
  }
};
