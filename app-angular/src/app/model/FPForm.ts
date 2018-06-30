
/**
 * Types de questions
 */
export enum FPQuestionType {
	"Oui / Non" = "BOOLEEN",
	"Mauvais / Normal / Bon" = "EVAL",
}

/**
 * Formulaire de fair-play
 */
export class FPForm {
	public id?: number;
	public libelle: string;
	public categories: FPCategorie[] = [];
}

/**
 * Catégorie du formulaire de fair-play
 */
export class FPCategorie {
	public id?: number;
	public libelle: string;
	public questions: FPQuestion[] = [];
}

/**
 * Question de fair-play
 */
export class FPQuestion {
	public id?: number;
	public titre: string;
	public libelle?: string;
	public type: FPQuestionType;
}
