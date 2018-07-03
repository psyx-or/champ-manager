import { Sport } from "./Sport";
import { Journee } from "./Journee";
import { Classement } from "./Classement";
import { FPForm } from "./FPForm";

/**
 * Types de championnat
 */
export enum ChampType {
	"Aller" = "ALLER",
	"Aller/Retour" = "ALLER_RETOUR",
	"Coupe" = "COUPE"
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
	public termine: boolean;
	public journees: Journee[];
	public classements: Classement[];
	public fpForm?: FPForm;

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
	public saison: string;
	public ptvict: number;
	public ptnul?: number;
	public ptdef: number;
	public type: ChampType;
	public fpForm?: FPForm;
}
