// GENERIC
export type ValueOf<T> = T[keyof T];

// VOCABULARY SECTION

export type LanguageLiterals = 'czech' | 'english';
type Languages = {
	[language in LanguageLiterals]: string;
};

export const languages: Languages = {
	czech: 'cs',
	english: 'en'
};

// PRACTICE SECTION

export type difficultyLiterals = 'medium' | 'high';
export type difficultyType = {
	[difficulty in difficultyLiterals]: number;
};

export const difficultyLimits: difficultyType = {
	high: 1,
	medium: 3
};
export const practiceCardOptions = 4;
export const minExpectedCapacity = 20;
export const assembleAttemptLimit = 400;
