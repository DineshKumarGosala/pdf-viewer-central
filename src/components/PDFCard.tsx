
import { PDFDocument } from '@/utils/types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { File, Download, Eye } from 'lucide-react';

interface PDFCardProps {
  document: PDFDocument;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function PDFCard({ document, isAdmin = false, onDelete }: PDFCardProps) {
  const formattedDate = new Date(document.uploadedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDelete) {
      onDelete(document.id);
    }
  };
  
  return (
    <motion.div
      className="glass-card p-5 h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
    >
      <div className="flex items-center mb-4">
        <div className="bg-dbms-accent bg-opacity-10 rounded-full p-3 mr-4">
          <File className="h-6 w-6 text-dbms-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium truncate">{document.title}</h3>
          <p className="text-dbms-muted text-sm">{formattedDate}</p>
        </div>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex justify-between mt-4">
        <Link 
          to={`/view/${document.id}`}
          className="flex items-center text-dbms-accent hover:underline text-sm"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
        
        <a 
          href={document.url}
          download={document.fileName}
          className="flex items-center text-dbms-accent hover:underline text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </a>
        
        {isAdmin && (
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}
