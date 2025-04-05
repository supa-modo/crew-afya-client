import React from 'react';
import { FiClock, FiCheck, FiX, FiLoader, FiDollarSign } from 'react-icons/fi';

const ClaimStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: FiClock,
          text: 'Pending',
          bgColor: 'bg-yellow-200 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-400'
        };
      case 'approved':
        return {
          icon: FiCheck,
          text: 'Approved',
          bgColor: 'bg-green-200 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-400'
        };
      case 'rejected':
        return {
          icon: FiX,
          text: 'Rejected',
          bgColor: 'bg-red-200 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-400'
        };
      case 'processing':
        return {
          icon: FiLoader,
          text: 'Processing',
          bgColor: 'bg-blue-200 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-400'
        };
      case 'paid':
        return {
          icon: FiDollarSign,
          text: 'Paid',
          bgColor: 'bg-purple-200 dark:bg-purple-900/30',
          textColor: 'text-purple-800 dark:text-purple-400'
        };
      default:
        return {
          icon: FiClock,
          text: status.charAt(0).toUpperCase() + status.slice(1),
          bgColor: 'bg-gray-200 dark:bg-gray-900/30',
          textColor: 'text-gray-800 dark:text-gray-400'
        };
    }
  };

  const { icon: Icon, text, bgColor, textColor } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      <Icon className="mr-1 h-3.5 w-3.5" />
      {text}
    </span>
  );
};

export default ClaimStatusBadge;
