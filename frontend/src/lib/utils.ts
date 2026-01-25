import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getColorClass(color: string): string {
  switch (color) {
    case 'green':
      return 'result-green';
    case 'yellow':
      return 'result-yellow';
    case 'red':
      return 'result-red';
    case 'blue':
      return 'result-blue';
    default:
      return '';
  }
}

export function getColorBgClass(color: string): string {
  switch (color) {
    case 'green':
      return 'bg-green-500';
    case 'yellow':
      return 'bg-yellow-500';
    case 'red':
      return 'bg-red-500';
    case 'blue':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatAssessmentType(type: string): string {
  const typeMap: Record<string, string> = {
    onbaseu: 'OnBaseU',
    pitcher_onbaseu: 'Pitcher OnBaseU',
    tpi_power: 'TPI Power',
    sprint: 'Sprint',
    kams: 'KAMS',
  };
  return typeMap[type] || type;
}
