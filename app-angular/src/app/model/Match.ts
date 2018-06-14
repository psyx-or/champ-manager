import { Equipe } from "./Equipe";

/**
 * Un match
 */
export class Match {
	id: number;
	equipe1?: Equipe;
	equipe2?: Equipe;
	score1?: number;
	score2?: number;
	feuille?: string;
	dateSaisie: Date;
	valide: boolean;
	forfait1: false;
	forfait2: false;
	match1?: Match;
	match2?: Match;
}
