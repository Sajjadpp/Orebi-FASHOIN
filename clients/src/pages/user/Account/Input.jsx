import { Eye, EyeOff } from 'lucide-react';



const Input = ({
    id,
    label,
    type = 'text',
    placeholder,
    icon: Icon,
    value,
    onChange, 
    required = false,
    isPassword = false,
    showPassword,
    onTogglePassword,
    color
  }) => {
    return (
      <div className="relative">
        <label htmlFor={id} className={`text-sm font-medium text-gray-700 block mb-2`} style={{color: color}}>
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          )}
          <input
            id={id}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            value={value}
            onChange={onChange}
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
            placeholder={placeholder}
            required={required}
          />
          {isPassword && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
    );
  };

export default Input