/**
 * Firebase Error Parser Utility
 *
 * Converts Firebase authentication error codes into user-friendly messages
 * that provide clear guidance for users.
 */

export interface ParsedFirebaseError {
  message: string;
  type: "error" | "warning" | "info";
}

/**
 * Parse Firebase authentication errors into user-friendly messages
 * @param error - The Firebase error object or error message
 * @returns Parsed error with user-friendly message and type
 */
export function parseFirebaseError(error: unknown): ParsedFirebaseError {
  // Extract error code from Firebase error
  let errorCode = "";
  let errorMessage = "";

  if (typeof error === "string") {
    errorMessage = error;
    // Try to extract Firebase error code from string
    const codeMatch = error.match(/auth\/([a-z-]+)/);
    errorCode = codeMatch ? `auth/${codeMatch[1]}` : "";
  } else if (error && typeof error === "object" && "code" in error) {
    errorCode = (error as { code: string }).code;
    errorMessage = (error as { message?: string }).message || "";
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = (error as { message: string }).message;
    // Try to extract Firebase error code from message
    const codeMatch = errorMessage.match(/auth\/([a-z-]+)/);
    errorCode = codeMatch ? `auth/${codeMatch[1]}` : "";
  }

  // Map Firebase error codes to user-friendly messages
  switch (errorCode) {
    // Sign In Errors
    case "auth/user-not-found":
      return {
        message:
          "No account found with this email address. Please check your email or create a new account.",
        type: "error",
      };

    case "auth/wrong-password":
      return {
        message: "Incorrect password. Please try again or reset your password.",
        type: "error",
      };

    case "auth/invalid-email":
      return {
        message: "Please enter a valid email address.",
        type: "error",
      };

    case "auth/user-disabled":
      return {
        message:
          "This account has been disabled. Please contact support for assistance.",
        type: "error",
      };

    case "auth/invalid-credential":
      return {
        message:
          "Invalid email or password. Please check your credentials and try again.",
        type: "error",
      };

    // Registration Errors
    case "auth/email-already-in-use":
      return {
        message:
          "An account with this email already exists. Please sign in instead.",
        type: "error",
      };

    case "auth/weak-password":
      return {
        message:
          "Password is too weak. Please use at least 6 characters with a mix of letters and numbers.",
        type: "error",
      };

    case "auth/operation-not-allowed":
      return {
        message:
          "Email/password accounts are not enabled. Please contact support.",
        type: "error",
      };

    // Password Reset Errors
    case "auth/invalid-action-code":
      return {
        message:
          "This password reset link is invalid or has expired. Please request a new one.",
        type: "error",
      };

    case "auth/expired-action-code":
      return {
        message:
          "This password reset link has expired. Please request a new one.",
        type: "error",
      };

    case "auth/user-token-expired":
      return {
        message: "Your session has expired. Please sign in again.",
        type: "warning",
      };

    // Network and General Errors
    case "auth/network-request-failed":
      return {
        message:
          "Network error. Please check your internet connection and try again.",
        type: "error",
      };

    case "auth/too-many-requests":
      return {
        message:
          "Too many failed attempts. Please wait a few minutes before trying again.",
        type: "error",
      };

    case "auth/popup-closed-by-user":
      return {
        message: "Sign-in was cancelled. Please try again.",
        type: "info",
      };

    case "auth/popup-blocked":
      return {
        message:
          "Pop-up was blocked by your browser. Please allow pop-ups and try again.",
        type: "error",
      };

    case "auth/cancelled-popup-request":
      return {
        message: "Sign-in was cancelled. Please try again.",
        type: "info",
      };

    case "auth/internal-error":
      return {
        message: "An internal error occurred. Please try again later.",
        type: "error",
      };

    // Google Sign-In Specific Errors
    case "auth/account-exists-with-different-credential":
      return {
        message:
          "An account already exists with this email using a different sign-in method. Please use the original sign-in method.",
        type: "error",
      };

    case "auth/credential-already-in-use":
      return {
        message:
          "This credential is already associated with a different account.",
        type: "error",
      };

    // Quota and Limit Errors
    case "auth/quota-exceeded":
      return {
        message: "Too many requests. Please try again later.",
        type: "error",
      };

    // Default fallback
    default:
      // If it's a recognizable Firebase auth error but not mapped above
      if (errorCode.startsWith("auth/")) {
        return {
          message:
            "Authentication failed. Please try again or contact support if the problem persists.",
          type: "error",
        };
      }

      // For non-Firebase errors or unknown errors
      if (errorMessage.toLowerCase().includes("network")) {
        return {
          message:
            "Network error. Please check your internet connection and try again.",
          type: "error",
        };
      }

      if (errorMessage.toLowerCase().includes("password")) {
        return {
          message: "Password error. Please check your password and try again.",
          type: "error",
        };
      }

      if (errorMessage.toLowerCase().includes("email")) {
        return {
          message:
            "Email error. Please check your email address and try again.",
          type: "error",
        };
      }

      // Final fallback
      return {
        message:
          "An unexpected error occurred. Please try again or contact support if the problem persists.",
        type: "error",
      };
  }
}

/**
 * Get a user-friendly error message from a Firebase error
 * @param error - The Firebase error object or error message
 * @returns User-friendly error message string
 */
export function getFirebaseErrorMessage(error: unknown): string {
  return parseFirebaseError(error).message;
}

/**
 * Check if an error is a Firebase authentication error
 * @param error - The error to check
 * @returns True if it's a Firebase auth error
 */
export function isFirebaseAuthError(error: unknown): boolean {
  const errorString =
    typeof error === "string"
      ? error
      : (error as { code?: string; message?: string })?.code ||
        (error as { code?: string; message?: string })?.message ||
        "";
  return errorString.includes("auth/");
}
