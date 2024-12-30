import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatHexColor(hex: string) {
  // Ensure the hex color starts with #
  if (!hex.startsWith('#')) {
    hex = '#' + hex;
  }
  
  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  
  return hex.toUpperCase();
}