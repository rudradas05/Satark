function readErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.trim();
  }
  if (typeof error === 'string') {
    return error.trim();
  }
  return '';
}

export function getUserFriendlyErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) {
  const message = readErrorMessage(error);
  const normalized = message.toLowerCase();

  if (!normalized) return fallback;
  if (
    normalized.includes('invalid credentials') ||
    normalized.includes('invalid email or password') ||
    normalized.includes('wrong password') ||
    normalized.includes('incorrect password') ||
    normalized.includes('user not found') ||
    normalized.includes('no user found')
  ) {
    return 'Invalid credentials. Please check your details and try again.';
  }
  if (normalized.includes('old password is incorrect')) {
    return 'Current password is incorrect.';
  }
  if (normalized.includes('username already exists')) {
    return 'This username is already taken.';
  }
  if (normalized.includes('email already exists')) {
    return 'This email is already registered.';
  }
  if (normalized.includes('phone already exists')) {
    return 'This phone number is already registered.';
  }
  if (
    normalized.includes('not authenticated') ||
    normalized.includes('unauthorized') ||
    normalized.includes('invalid or expired token')
  ) {
    return 'Session expired. Please log in again.';
  }
  if (
    normalized.includes('request failed') ||
    normalized.includes('network') ||
    normalized.includes('failed to fetch')
  ) {
    return 'Network issue. Please try again.';
  }
  if (normalized.includes('invalid input')) {
    return 'Please check the entered details and try again.';
  }

  return fallback;
}
