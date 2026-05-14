import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function readingTime(content: string) {
  return Math.max(2, Math.ceil(content.split(/\s+/).length / 210));
}
