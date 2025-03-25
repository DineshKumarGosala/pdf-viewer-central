
import { useState, useEffect } from 'react';
import { getPDFDocuments } from '@/utils/pdfService';
import { PDFDocument } from '@/utils/types';
import PDFCard from '@/components/PDFCard';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Index() {
  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['pdfDocuments'],
    queryFn: getPDFDocuments,
  });
  
  // Show error toast if there was an error fetching documents
  useEffect(() => {
    if (error) {
      toast.error('Failed to load documents');
      console.error('Error fetching documents:', error);
    }
  }, [error]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main 
        className="flex-1 container mx-auto px-4 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mt-6 mb-10 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="font-semibold text-4xl md:text-5xl">PDF Documents</h1>
          <p className="mt-4 text-dbms-muted max-w-lg mx-auto">
            View and download all available PDF documents from the DBMS Scam repository
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-10 w-10 rounded-full border-2 border-dbms-accent border-t-transparent animate-spin"></div>
          </div>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <PDFCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium">No documents available</h3>
            <p className="mt-2 text-dbms-muted">Check back later for updates</p>
          </div>
        )}
      </motion.main>
    </div>
  );
}
