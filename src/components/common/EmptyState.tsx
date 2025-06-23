import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  icon,
}) => {
  return (
    <div className="text-center py-16 bg-white rounded-lg shadow-md">
      {icon && <div className="flex justify-center mb-4 text-gray-400">{icon}</div>}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick}>{buttonText}</Button>
      )}
    </div>
  );
};
