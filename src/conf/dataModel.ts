type TypeLiterals = 'word' | 'sentence';

export interface PhraseModel {
	phrase: string;
	inEnglish: string;
	practiceCount: number;
	type: TypeLiterals;
	dateAdded: Date | null;
}
export interface PhraseType {
	[uuid: string]: PhraseModel;
}
export interface CategoryType {
	[key: string]: {
		phrases: PhraseType | {};
		practiceCount: number;
	};
}

export interface DatabaseModel {
	categories: CategoryType;
	practiceCount: number;
}
