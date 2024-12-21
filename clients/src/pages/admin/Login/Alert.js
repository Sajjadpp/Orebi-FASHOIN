import {XCircle} from 'lucide-react';

const CustomAlert = ({ children, variant = 'default', onClose }) => {
    const bgColor = variant === 'destructive' ? 'bg-red-50' : 'bg-blue-50';
    const borderColor = variant === 'destructive' ? 'border-red-400' : 'border-blue-400';
    const textColor = variant === 'destructive' ? 'text-red-800' : 'text-blue-800';
  
    return (
      <div className={`${bgColor} ${borderColor} ${textColor} border rounded-lg p-4 relative animate-shake`}>
        <div className="flex gap-3">
          {variant === 'destructive' && <XCircle className="h-5 w-5 text-red-500" />}
          <p className="text-sm">{children}</p>
        </div>
      </div>
    );
  };

  export default CustomAlert