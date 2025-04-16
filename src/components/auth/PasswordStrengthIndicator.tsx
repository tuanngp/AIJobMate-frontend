'use client';

type PasswordStrength = 'weak' | 'medium' | 'strong';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return 'weak';
    
    let score = 0;
    
    // Độ dài tối thiểu
    if (password.length >= 8) score++;
    
    // Có số
    if (/\d/.test(password)) score++;
    
    // Có chữ thường
    if (/[a-z]/.test(password)) score++;
    
    // Có chữ hoa
    if (/[A-Z]/.test(password)) score++;
    
    // Có ký tự đặc biệt
    if (/[!@#$%^&*]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  const strength = getPasswordStrength(password);

  const getColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
    }
  };

  const getMessage = () => {
    switch (strength) {
      case 'weak':
        return 'Yếu';
      case 'medium':
        return 'Trung bình';
      case 'strong':
        return 'Mạnh';
    }
  };

  return (
    <div className="mt-1">
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
            style={{
              width: strength === 'weak' ? '33.33%' : strength === 'medium' ? '66.66%' : '100%'
            }}
          />
        </div>
        <span className={`text-sm ${getColor().replace('bg-', 'text-')}`}>
          {getMessage()}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
      </p>
    </div>
  );
}