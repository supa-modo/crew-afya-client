import React from 'react';
import { PiToothDuotone } from 'react-icons/pi';
import { TbBuildingHospital, TbStethoscope, TbBabyCarriage, TbEye, TbEmergencyBed, TbAmbulance } from 'react-icons/tb';

const ClaimTypeIcon = ({ type, className = '' }) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'inpatient':
        return {
          icon: TbBuildingHospital,
          color: 'text-blue-600 dark:text-blue-400'
        };
      case 'outpatient':
        return {
          icon: TbStethoscope,
          color: 'text-green-600 dark:text-green-400'
        };
      case 'maternity':
        return {
          icon: TbBabyCarriage,
          color: 'text-pink-600 dark:text-pink-400'
        };
      case 'optical':
        return {
          icon: TbEye,
          color: 'text-amber-600 dark:text-amber-400'
        };
      case 'dental':
        return {
          icon: PiToothDuotone,
          color: 'text-cyan-600 dark:text-cyan-400'
        };
      case 'accident':
        return {
          icon: TbEmergencyBed,
          color: 'text-red-600 dark:text-red-400'
        };
      case 'emergency':
        return {
          icon: TbAmbulance,
          color: 'text-orange-600 dark:text-orange-400'
        };
      default:
        return {
          icon: TbStethoscope,
          color: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const { icon: Icon, color } = getTypeConfig();

  return <Icon className={`h-5 w-5 ${color} ${className}`} />;
};

export default ClaimTypeIcon;
