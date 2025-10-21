export interface PasswordValidationOptions {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  minScore?: number;
  checkCommonPatterns?: boolean;
  checkDictionaryWords?: boolean;
  customPatterns?: RegExp[];
  blockedPatterns?: RegExp[];
}

export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  strength: "very-weak" | "weak" | "fair" | "good" | "strong" | "very-strong";
  feedback: string[];
  meetsRequirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    specialChars: boolean;
    noCommonPatterns: boolean;
    noDictionaryWords: boolean;
  };
  entropy?: number;
}

const COMMON_PATTERNS = [
  /^password$/i,
  /^123456$/,
  /^qwerty$/i,
  /^abc123$/i,
  /^password123$/i,
  /^admin$/i,
  /^letmein$/i,
  /^welcome$/i,
  /^monkey$/i,
  /^1234567890$/,
  /^(.)\1{2,}$/,
  /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)$/i,
];

const COMMON_WORDS = [
  "password",
  "admin",
  "user",
  "login",
  "test",
  "demo",
  "sample",
  "example",
  "temp",
  "temporary",
  "new",
  "old",
  "current",
  "previous",
  "first",
  "last",
  "name",
  "email",
  "phone",
  "address",
  "account",
  "summer",
  "winter",
  "spring",
  "fall",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const KEYBOARD_PATTERNS = [
  "qwerty",
  "qwer",
  "asdfgh",
  "asdf",
  "zxcvbn",
  "zxcv",
  "123456",
  "12345",
  "1234",
  "234567",
  "23456",
  "2345",
  "345678",
  "34567",
  "3456",
  "456789",
  "45678",
  "4567",
  "567890",
  "56789",
  "5678",
];

const DATE_PATTERNS = [
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{2,4}\b/i,
  /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*\d{2,4}\b/i,
  /\b\d{2,4}\s*(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
  /\b\d{2,4}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i,
  /\b(0?[1-9]|1[0-2])[\/.\s-](0?[1-9]|[12]\d|3[01])[\/.\s-]\d{2,4}\b/,
  /\b\d{4}[\/.\s-](0?[1-9]|1[0-2])[\/.\s-](0?[1-9]|[12]\d|3[01])\b/,
];

const SPECIAL_CHARS = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/;

function normalizeLeet(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[@4]/g, "a")
      .replace(/[3]/g, "e")
      // Removed aggressive mapping of '!' and '1' to letters to preserve word boundaries
      // .replace(/[1!]/g, 'i')
      .replace(/[0]/g, "o")
      .replace(/[$5]/g, "s")
      .replace(/[7]/g, "t")
      .replace(/[9]/g, "g")
      .replace(/[8]/g, "b")
  );
}

function containsWordLike(str: string, word: string): boolean {
  let pos = -1;
  while ((pos = str.indexOf(word, pos + 1)) !== -1) {
    const before = pos > 0 ? str[pos - 1] : "";
    const afterIdx = pos + word.length;
    const after = afterIdx < str.length ? str[afterIdx] : "";
    const isBeforeWordChar = /[A-Za-z0-9_]/.test(before);
    const isAfterLetter = /[A-Za-z]/.test(after);
    if (!isBeforeWordChar && !isAfterLetter) {
      return true;
    }
  }
  return false;
}

function calculateEntropy(password: string): number {
  if (!password || password.length === 0) return 0;

  const charsets = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    numbers: /[0-9]/,
    special: /[^a-zA-Z0-9]/,
    unicode: /[^\x00-\x7F]/,
  };

  let charsetSize = 0;
  if (charsets.lowercase.test(password)) charsetSize += 26;
  if (charsets.uppercase.test(password)) charsetSize += 26;
  if (charsets.numbers.test(password)) charsetSize += 10;
  if (charsets.special.test(password)) charsetSize += 32;
  if (charsets.unicode.test(password)) charsetSize += 128;

  return password.length * Math.log2(charsetSize || 1);
}

export function validatePasswordStrength(
  password: string | null | undefined,
  options: PasswordValidationOptions = {},
): PasswordStrengthResult {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
    minScore = 3,
    checkCommonPatterns = true,
    checkDictionaryWords = true,
    blockedPatterns = [],
  } = options;

  const feedback: string[] = [];

  // Handle null/undefined password
  if (
    password === null ||
    password === undefined ||
    typeof password !== "string"
  ) {
    return {
      isValid: false,
      score: 0,
      strength: "very-weak",
      feedback: ["Password is required"],
      meetsRequirements: {
        length: false,
        uppercase: false,
        lowercase: false,
        numbers: false,
        specialChars: false,
        noCommonPatterns: false,
        noDictionaryWords: false,
      },
      entropy: 0,
    };
  }

  const meetsRequirements = {
    length: password.length >= minLength && password.length <= maxLength,
    uppercase: !requireUppercase || /[A-Z]/.test(password),
    lowercase: !requireLowercase || /[a-z]/.test(password),
    numbers: !requireNumbers || /\d/.test(password),
    specialChars: !requireSpecialChars || SPECIAL_CHARS.test(password),
    noCommonPatterns: true,
    noDictionaryWords: true,
  };

  if (!meetsRequirements.length) {
    if (password.length < minLength) {
      feedback.push(`Password must be at least ${minLength} characters long`);
    } else {
      feedback.push(`Password must be at most ${maxLength} characters long`);
    }
  }

  // Compute percentage-based score (0-100)
  let score = 0;
  const lengthScore = (Math.min(password.length, 20) / 20) * 50; // up to 50 points for length
  const varietyScore =
    (/[a-z]/.test(password) ? 10 : 0) +
    (/[A-Z]/.test(password) ? 10 : 0) +
    (/\d/.test(password) ? 10 : 0) +
    (SPECIAL_CHARS.test(password) ? 10 : 0) +
    (/[^\x00-\x7F]/.test(password) ? 10 : 0); // unicode variety
  const extraLengthBonus =
    password.length > 20 ? Math.min(password.length - 20, 20) * 0.25 : 0; // up to +5
  score = lengthScore + varietyScore + extraLengthBonus;
  if (password.length >= minLength + 4) score++;
  if (password.length >= minLength + 8) score++;

  if (!meetsRequirements.uppercase) {
    feedback.push("uppercase letter");
  } else {
    score++;
  }

  if (!meetsRequirements.lowercase) {
    feedback.push("lowercase letter");
  } else {
    score++;
  }

  if (!meetsRequirements.numbers) {
    feedback.push("number");
  } else {
    score++;
  }

  if (!meetsRequirements.specialChars) {
    feedback.push("special character");
  } else {
    score++;
  }

  if (checkCommonPatterns) {
    const lowerPassword = password.toLowerCase();
    const normalizedLower = normalizeLeet(lowerPassword);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecial = SPECIAL_CHARS.test(password);
    const complexityHigh =
      password.length >= 20 &&
      hasUppercase &&
      hasLowercase &&
      hasDigits &&
      hasSpecial;
    const penaltyMultiplier =
      password.length >= 40 ? 0.25 : complexityHigh ? 0.5 : 1;

    const anchoredCommon = COMMON_PATTERNS.some((pattern) =>
      pattern.test(password),
    );
    const passwordPlusDigits = /password\d+/.test(lowerPassword);
    const hasCommonPattern =
      anchoredCommon ||
      passwordPlusDigits ||
      COMMON_WORDS.some((word) => containsWordLike(normalizedLower, word));
    const hasKeyboardPattern = KEYBOARD_PATTERNS.some((pattern) =>
      lowerPassword.includes(pattern),
    );
    const hasDatePattern = DATE_PATTERNS.some((pattern) =>
      pattern.test(password),
    );
    const hasRepetitiveChars = /(.)\1{2,}/.test(password);
    const hasSequentialChars =
      /(0123|1234|2345|3456|4567|5678|6789|7890|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz)/i.test(
        password,
      );
    const hasCommonSubstitutionChars = /[@$!013457]/.test(lowerPassword);
    const hasCommonSubstitutions =
      hasCommonSubstitutionChars &&
      normalizedLower !== lowerPassword &&
      COMMON_WORDS.some((word) => containsWordLike(normalizedLower, word));

    if (hasCommonPattern) {
      feedback.push("common pattern");
      score = Math.max(
        0,
        score - Math.round((anchoredCommon ? 25 : 8) * penaltyMultiplier),
      );
    }
    if (hasKeyboardPattern) {
      feedback.push("Password contains keyboard pattern");
      score = Math.max(0, score - Math.round(10 * penaltyMultiplier));
    }
    if (hasDatePattern) {
      feedback.push("Password contains date pattern");
      score = Math.max(0, score - Math.round(10 * penaltyMultiplier));
    }
    if (hasRepetitiveChars) {
      feedback.push("Password contains repetitive characters");
      score = Math.max(0, score - Math.round(10 * penaltyMultiplier));
    }
    if (hasSequentialChars) {
      feedback.push("Password contains sequential characters");
      score = Math.max(0, score - Math.round(10 * penaltyMultiplier));
    }
    if (hasCommonSubstitutions) {
      feedback.push("Password contains common substitution");
      score = Math.max(0, score - Math.round(8 * penaltyMultiplier));
    }
  }

  if (checkDictionaryWords) {
    const lowerPassword = password.toLowerCase();
    const normalizedLower = normalizeLeet(lowerPassword);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecial = SPECIAL_CHARS.test(password);
    const complexityHigh =
      password.length >= 20 &&
      hasUppercase &&
      hasLowercase &&
      hasDigits &&
      hasSpecial;
    const penaltyMultiplier =
      password.length >= 40 ? 0.25 : complexityHigh ? 0.5 : 1;

    const hasDictionaryWord = COMMON_WORDS.some(
      (word) =>
        containsWordLike(lowerPassword, word) ||
        containsWordLike(normalizedLower, word),
    );
    if (hasDictionaryWord) {
      feedback.push("dictionary word");
      score = Math.max(0, score - Math.round(6 * penaltyMultiplier));
    }
  }

  for (const pattern of blockedPatterns) {
    if (pattern.test(password)) {
      feedback.push("Password contains blocked patterns");
      score = Math.max(0, score - 20);
      break;
    }
  }

  // Clamp score to 0-100 range
  score = Math.max(0, Math.min(100, Math.round(score)));

  const entropy = calculateEntropy(password);
  // Determine validity based on core requirements only and score threshold
  const coreRequirementsMet =
    password.length >= minLength &&
    password.length <= maxLength &&
    (!requireUppercase || /[A-Z]/.test(password)) &&
    (!requireLowercase || /[a-z]/.test(password)) &&
    (!requireNumbers || /\d/.test(password)) &&
    (!requireSpecialChars || SPECIAL_CHARS.test(password));
  const isValid = coreRequirementsMet && score >= minScore;

  let strength: PasswordStrengthResult["strength"];
  if (score <= 20) strength = "very-weak";
  else if (score <= 35) strength = "weak";
  else if (score <= 50) strength = "fair";
  else if (score <= 65) strength = "good";
  else if (score <= 80) strength = "strong";
  else strength = "very-strong";

  if (feedback.length === 0 && isValid) {
    feedback.push("Password meets all security requirements");
  }

  return {
    isValid,
    score,
    strength,
    feedback,
    meetsRequirements,
    entropy,
  };
}

export function getPasswordStrengthColor(
  strength: PasswordStrengthResult["strength"],
): string {
  switch (strength) {
    case "very-weak":
      return "red";
    case "weak":
      return "hsl(185, 75%, 50%)";
    case "fair":
      return "yellow";
    case "good":
      return "blue";
    case "strong":
      return "green";
    case "very-strong":
      return "darkgreen";
    default:
      return "gray";
  }
}

export enum PasswordStrength {
  WEAK = "weak",
  MEDIUM = "medium",
  STRONG = "strong",
}

export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  errors: string[];
}

export function validatePassword(
  password: string,
  options?: PasswordValidationOptions,
): PasswordValidationResult {
  const result = validatePasswordStrength(password, options);

  // Map strength to enum values - be more lenient for medium strength
  let strength: PasswordStrength;
  if (result.score <= 25) {
    strength = PasswordStrength.WEAK;
  } else if (result.score <= 75) {
    strength = PasswordStrength.MEDIUM;
  } else {
    strength = PasswordStrength.STRONG;
  }

  return {
    isValid: result.isValid,
    strength,
    errors: result.feedback.filter(
      (f) => f !== "Password meets all security requirements",
    ),
  };
}

export function getPasswordStrengthText(
  strength: PasswordStrengthResult["strength"],
): string {
  switch (strength) {
    case "very-weak":
      return "Very Weak";
    case "weak":
      return "Weak";
    case "fair":
      return "Fair";
    case "good":
      return "Good";
    case "strong":
      return "Strong";
    case "very-strong":
      return "Very Strong";
    default:
      return "Unknown";
  }
}
