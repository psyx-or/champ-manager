import { Sport } from "./Sport";
import { Journee } from "./Journee";
import { Classement } from "./Classement";
import { FPForm } from "./FPForm";
import { FPFeuille } from "./FPFeuille";

/**
 * Types de championnat
 */
export enum ChampType {
	"Aller" = "ALLER",
	"Aller/Retour" = "ALLER_RETOUR",
	"Coupe" = "COUPE"
}

/**
 * Types de traitement en cas d'égalité au classement
 */
export enum EgaliteType {
	"Diff. générale" = "DIFF_GENERALE",
	"Diff. particulière" = "DIFF_PARTICULIERE",
}

/**
 * Un championnat
 */
export class Championnat {
    public id?: number;
    public sport: Sport;
    public nom: string;
    public saison: string;
    public ptvict: number;
    public ptnul?: number;
    public ptdef: number;
	public type: ChampType;
	public egaliteType?: EgaliteType;
	public journees: Journee[];
	public classements: Classement[];
	public fpForm?: FPForm;
	public fpFeuilles: FPFeuille[];

    public constructor(init?: Partial<Championnat>) {
        Object.assign(this, init);
    }
}

/**
 * Un modèle de championnat
 */
export class ChampModele {
	public id?: number;
	public nomModele: string;
	public sport: Sport;
	public nom: string;
	public ptvict: number;
	public ptnul?: number;
	public ptdef: number;
	public type: ChampType;
	public egaliteType: EgaliteType;
	public fpForm?: FPForm;
}
