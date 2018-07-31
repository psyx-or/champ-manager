import { Equipe } from "./Equipe";
import { FPFeuille } from "./FPFeuille";
import { Journee } from "@commun/src/app/model/Journee";

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
	fpFeuille1?: FPFeuille;
	fpFeuille2?: FPFeuille;

	dispEquipe1?: string;
	dispEquipe2?: string;
	dispScore1?: string|number;
	dispScore2?: string|number;
	journee?: Journee;
}
