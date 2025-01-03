const InputField = (
    { label,
        name, 
        type = "text", 
        placeholder, 
        maxLength, 
        isTextarea = false,
        errors,
        activeField,
        setActiveField,
        formData,
        handleChange
    }
) => (
    <div className="mb-6">
      <label 
        className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
          activeField === name ? 'text-gray-600' : 'text-black-700'
        }`}
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => setActiveField(name)}
          onBlur={() => setActiveField('')}
          className={`w-full p-3 border-2 rounded-lg transition-all duration-200 
            ${activeField === name ? 'border-gray-500 shadow-sm' : 'border-black-200'}
            ${errors[name] ? 'border-red-500' : ''}
            focus:outline-none focus:ring-2 focus:ring-blue-100`}
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => setActiveField(name)}
          onBlur={() => setActiveField('')}
          maxLength={maxLength}
          className={`w-full p-3 border-2 rounded-lg transition-all duration-200
            ${activeField === name ? 'border-gray-500 shadow-sm' : 'border-black-200'}
            ${errors[name] ? 'border-red-500' : ''}
            focus:outline-none focus:ring-2 focus:ring-blue-100`}
          placeholder={placeholder}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-red-500 text-sm">{errors[name]}</p>
      )}
    </div>
  );


  export default InputField