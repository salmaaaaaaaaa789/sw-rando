import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Rate limiting utility to prevent spam
export function canSubmitForm(email: string): boolean {
  const key = `form_submission_${email}`;
  const lastSubmission = localStorage.getItem(key);

  // Allow only one submission per hour per email
  if (lastSubmission) {
    const timeDiff = Date.now() - parseInt(lastSubmission);
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    if (timeDiff < oneHour) {
      return false;
    }
  }

  localStorage.setItem(key, Date.now().toString());
  return true;
}
