
import { Link } from 'react-router-dom';
import { isAdminAuthenticated, logoutAdmin } from '@/utils/adminAuth';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
  }, []);
  
  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
  };
  
  return (
    <motion.header 
      className="w-full py-6 px-4 md:px-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div 
            className="font-bold text-2xl tracking-tight text-dbms-accent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            DBMS Scam
          </motion.div>
        </Link>
        
        <nav className="flex items-center space-x-4">
          {isAdmin ? (
            <>
              <Link 
                to="/admin" 
                className="text-dbms-foreground hover:text-dbms-accent transition-colors duration-200"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-dbms-foreground hover:text-dbms-accent transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/admin" 
              className="text-dbms-foreground hover:text-dbms-accent transition-colors duration-200"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
