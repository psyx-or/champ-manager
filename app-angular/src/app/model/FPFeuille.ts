import { FPForm } from "./FPForm";
import { Equipe } from "./Equipe";

/**
 * DTO pour la création/modification/affichage d'une feuille de fair-play
 */
export class FPFeuilleAfficheDTO {
	public fpForm: FPForm;
	public fpFeuille: FPFeuille;
	public reponses: {[question: string]: number};
	public matchId: number;
}

/**
 * Enveloppe d'une feuille de fair-play
 */
export class FPFeuille {
	id?: number;
	equipeRedactrice?: Equipe;
	equipeEvaluee?: Equipe;
	commentaire?: string;
	ratio?: number;
}
