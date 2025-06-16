import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-sm hover:shadow-md",
    accent: "bg-accent text-white hover:bg-accent/90 focus:ring-accent/50 shadow-sm hover:shadow-md",
    outline: "border border-surface-300 bg-white text-gray-700 hover:bg-surface-50 focus:ring-primary/50",
    ghost: "text-gray-700 hover:bg-surface-100 focus:ring-primary/50",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50 shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const iconSize = {
    sm: "w-4 h-4",
    md: "w-4 h-4", 
    lg: "w-5 h-5",
    xl: "w-6 h-6"
  }[size];

  const filterProps = ({ icon, iconPosition, loading, variant, size, ...rest }) => rest;

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...filterProps(props)}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`${iconSize} animate-spin ${children ? 'mr-2' : ''}`} 
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          className={`${iconSize} ${children ? 'mr-2' : ''}`} 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          className={`${iconSize} ${children ? 'ml-2' : ''}`} 
        />
      )}
    </motion.button>
  );
};

export default Button;