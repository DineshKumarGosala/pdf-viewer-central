
export interface PDFDocument {
  id: string;
  title: string;
  fileName: string;
  url: string;
  uploadedAt: string;
  size?: number;
}

export type AdminCredentials = {
  username: string;
  password: string;
};
