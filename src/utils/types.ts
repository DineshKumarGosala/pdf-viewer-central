
export interface PDFDocument {
  id: string;
  title: string;
  fileName: string;
  url: string;
  uploadedAt: string;
  size?: number;
  path?: string; // Path in Supabase storage
}

export type AdminCredentials = {
  username: string;
  password: string;
};

export interface SupabasePDFDocument {
  id: string;
  title: string;
  file_name: string;
  created_at: string;
  size: number;
  path: string;
}
