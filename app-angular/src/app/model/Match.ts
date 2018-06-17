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
	forfait1: boolean;
	forfait2: boolean;
	match1?: Match;
	match2?: Match;
	exempt?: Equipe;

	dispEquipe1?: string;
	dispEquipe2?: string;
	dispScore1?: string|number;
	dispScore2?: string|number;
}
