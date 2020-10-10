import { Equipe } from "./Equipe";

/**
 * Une entrée d'un classement
 */
export class Classement {
	position: number;
	equipe: Equipe;
	pts: number;
	penalite: number;
	pour: number;
	contre: number;
	mTotal: number;
	mVict: number;
	mNul?: number;
	mDef: number;
	mFo: number;
	nomJournee?: string;
}
