import { useMemo } from 'react';
import { useProfile } from './useProfile';

interface DateBounds {
  minDate: Date;
  maxDate: Date;
  isDateValid: (date: Date) => boolean;
  isDateInFuture: (date: Date) => boolean;
  isDateBeforeBirth: (date: Date) => boolean;
  getErrorMessage: (date: Date) => string | null;
}

export function useDateBounds(): DateBounds {
  const { profile } = useProfile();

  const bounds = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fin de la journée d'aujourd'hui

    // Date de naissance par défaut si non définie
    const birthDate = profile?.birth_date 
      ? new Date(profile.birth_date)
      : new Date('1990-01-01');

    return {
      minDate: birthDate,
      maxDate: today
    };
  }, [profile?.birth_date]);

  const isDateValid = (date: Date): boolean => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return dateOnly >= bounds.minDate && dateOnly <= bounds.maxDate;
  };

  const isDateInFuture = (date: Date): boolean => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(bounds.maxDate.getFullYear(), bounds.maxDate.getMonth(), bounds.maxDate.getDate());
    return dateOnly > todayOnly;
  };

  const isDateBeforeBirth = (date: Date): boolean => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const birthOnly = new Date(bounds.minDate.getFullYear(), bounds.minDate.getMonth(), bounds.minDate.getDate());
    return dateOnly < birthOnly;
  };

  const getErrorMessage = (date: Date): string | null => {
    if (isDateInFuture(date)) {
      return "Impossible de créer un souvenir dans le futur";
    }
    if (isDateBeforeBirth(date)) {
      return "Impossible de créer un souvenir avant votre naissance";
    }
    return null;
  };

  return {
    minDate: bounds.minDate,
    maxDate: bounds.maxDate,
    isDateValid,
    isDateInFuture,
    isDateBeforeBirth,
    getErrorMessage
  };
} 