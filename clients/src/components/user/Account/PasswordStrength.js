// Password strength indicator component
const PasswordStrengthIndicator = ({passwordStrength}) => (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600">Password strength:</div>
        <div className={`text-sm font-medium ${
          passwordStrength === 'weak' ? 'text-red-500' :
          passwordStrength === 'medium' ? 'text-yellow-500' :
          passwordStrength === 'strong' ? 'text-green-500' :
          passwordStrength === 'very-strong' ? 'text-blue-500' : ''
        }`}>
          {passwordStrength}
        </div>
      </div>
      <div className="mt-1 h-1 w-full bg-gray-200 rounded">
        <div
          className={`h-full rounded transition-all ${
            passwordStrength === 'weak' ? 'w-1/4 bg-red-500' :
            passwordStrength === 'medium' ? 'w-2/4 bg-yellow-500' :
            passwordStrength === 'strong' ? 'w-3/4 bg-green-500' :
            passwordStrength === 'very-strong' ? 'w-full bg-blue-500' : ''
          }`}
        />
      </div>
    </div>
);

export default PasswordStrengthIndicator