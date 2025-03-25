import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminAuthenticated, loginAdmin } from '@/utils/adminAuth';
import { getPDFDocuments, addPDFDocument, deletePDFDocument } from '@/utils/pdfService';
import { PDFDocument, AdminCredentials } from '@/utils/types';
import Header from '@/components/Header';
import PDFCard from '@/components/PDFCard';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: documents = [], isLoading: isLoadingDocs } = useQuery({
    queryKey: ['pdfDocuments'],
    queryFn: getPDFDocuments,
    enabled: isAuthenticated,
  });
  
  const uploadMutation = useMutation({
    mutationFn: async ({ file, title }: { file: File; title: string }) => {
      const result = await addPDFDocument(file, title);
      if (!result) throw new Error('Failed to upload file');
      return result;
    },
    onSuccess: () => {
      toast.success('PDF uploaded successfully');
      setUploadTitle('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      queryClient.invalidateQueries({ queryKey: ['pdfDocuments'] });
    },
    onError: (error) => {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF');
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const success = await deletePDFDocument(id);
      if (!success) throw new Error('Failed to delete document');
      return id;
    },
    onSuccess: () => {
      toast.success('PDF deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['pdfDocuments'] });
    },
    onError: (error) => {
      console.error('Error deleting PDF:', error);
      toast.error('Failed to delete PDF');
    }
  });
  
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAdminAuthenticated();
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    
    const credentials: AdminCredentials = {
      username,
      password
    };
    
    const success = loginAdmin(credentials);
    
    if (success) {
      setIsAuthenticated(true);
      toast.success('Successfully logged in');
    } else {
      toast.error('Invalid credentials');
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !uploadTitle.trim()) {
      toast.error('Please provide a title and select a PDF file');
      return;
    }
    
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please select a PDF file');
      return;
    }
    
    uploadMutation.mutate({ file: selectedFile, title: uploadTitle });
  };
  
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="h-10 w-10 rounded-full border-2 border-dbms-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div 
            className="glass-card w-full max-w-md p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block mb-1 text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dbms-accent focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dbms-accent focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary mt-6"
              >
                Login
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main 
        className="flex-1 container mx-auto px-4 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="mt-6 mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="font-semibold text-3xl">Admin Dashboard</h1>
          <p className="mt-2 text-dbms-muted">
            Upload and manage PDF documents
          </p>
        </motion.div>
        
        <motion.div 
          className="glass-card p-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Upload New PDF</h2>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label htmlFor="title" className="block mb-1 text-sm font-medium">
                Document Title
              </label>
              <input
                id="title"
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dbms-accent focus:border-transparent transition-all duration-200"
                placeholder="Enter document title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="pdf-file" className="block mb-1 text-sm font-medium">
                PDF File
              </label>
              <div className="mt-1 flex items-center">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-dbms-accent transition-colors duration-200">
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-dbms-muted mb-2" />
                      <span className="text-sm text-dbms-muted">
                        {selectedFile ? selectedFile.name : 'Click to select a PDF file'}
                      </span>
                    </div>
                  </div>
                  <input
                    id="pdf-file"
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    required
                  />
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="btn-primary mt-4"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <span className="flex items-center">
                  <div className="h-4 w-4 rounded-full border border-white border-t-transparent animate-spin mr-2"></div>
                  Uploading...
                </span>
              ) : 'Upload PDF'}
            </button>
          </form>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Manage Documents</h2>
          
          {isLoadingDocs ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-10 w-10 rounded-full border-2 border-dbms-accent border-t-transparent animate-spin"></div>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <PDFCard 
                  key={doc.id} 
                  document={doc} 
                  isAdmin={true}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center glass-card py-12">
              <h3 className="text-xl font-medium">No documents available</h3>
              <p className="mt-2 text-dbms-muted">Upload your first PDF document</p>
            </div>
          )}
        </motion.div>
      </motion.main>
    </div>
  );
}
