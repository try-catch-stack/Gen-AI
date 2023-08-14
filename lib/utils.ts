import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function absoluteURL(path: string) {
	return process.env.PUBLIC_APP_BASE_URL + path;
}
