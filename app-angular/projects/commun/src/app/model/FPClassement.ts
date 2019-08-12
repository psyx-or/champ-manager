import { Equipe } from "./Equipe";
import { Championnat } from "./Championnat";

/**
 * Une ligne du classement de fair-play
 */
export class FPClassement {
	public equipe: Equipe;
	public ratio: number;
	public nb: number;
}

/**
 * Liste de lignes pour un championnat
 */
export class FPResultat {
	public champ: Championnat;
	public fpClassements: FPClassement[];
}
