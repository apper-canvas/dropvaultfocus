import { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ value, onChange, placeholder = "Search...", onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    if (onSearch) {
      const timer = setTimeout(() => {
        onSearch(value);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [value, onSearch]);

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative">
      <motion.div
        className={`relative transition-all duration-200 ${
          isFocused ? 'ring-2 ring-primary/20' : ''
        }`}
        animate={{ scale: isFocused ? 1.01 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <ApperIcon 
            name="Search" 
            className={`w-4 h-4 transition-colors duration-200 ${
              isFocused ? 'text-primary' : 'text-gray-400'
            }`} 
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-150"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchBar;