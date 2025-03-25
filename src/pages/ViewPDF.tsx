
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPDFDocumentById } from '@/utils/pdfService';
import Header from '@/components/Header';
import PDFViewer from '@/components/PDFViewer';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';

export default function ViewPDF() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    
    try {
      const doc = getPDFDocumentById(id);
      
      if (!doc) {
        navigate('/');
        return;
      }
      
      setDocument(doc);
    } catch (error) {
      console.error('Error fetching document:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="h-10 w-10 rounded-full border-2 border-dbms-accent border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (!document) {
    return null;
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
        <div className="flex items-center justify-between my-6">
          <motion.button
            className="flex items-center text-dbms-foreground hover:text-dbms-accent transition-colors duration-200"
            onClick={handleGoBack}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Documents
          </motion.button>
          
          <motion.a
            href={document.url}
            download={document.fileName}
            className="btn-primary flex items-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </motion.a>
        </div>
        
        <div className="h-[75vh]">
          <PDFViewer url={document.url} title={document.title} />
        </div>
      </motion.main>
    </div>
  );
}
