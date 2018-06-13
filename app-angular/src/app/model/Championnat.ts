import { Sport } from "./Sport";
import { Journee } from "./Journee";

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
	public journees: Journee[]

    public constructor(init?: Partial<Championnat>) {
        Object.assign(this, init);
    }
}
