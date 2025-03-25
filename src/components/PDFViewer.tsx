
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PDFViewerProps {
  url: string;
  title: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time for the PDF
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [url]);
  
  return (
    <div className="w-full h-full flex flex-col">
      <motion.div 
        className="mb-4 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold">{title}</h2>
      </motion.div>
      
      <div className="relative flex-1 w-full glass-card overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-dbms-accent border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <motion.iframe
            src={`${url}#toolbar=0`}
            className="w-full h-full rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            title={`PDF Viewer - ${title}`}
          />
        )}
      </div>
    </div>
  );
}
