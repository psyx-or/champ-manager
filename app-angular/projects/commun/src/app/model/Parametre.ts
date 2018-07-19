
/**
 * Types de paramètres
 */
export enum ChampType {
	"STR" = "STR",
	"TEXTE" = "TEXTE",
}

/**
 * Un paramètre
 */
export class Parametre {
	nom: string;
	type: ChampType;
	description: string;
	valeur: string;
}
