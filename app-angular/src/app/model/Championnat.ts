import { Sport } from "./Sport";

/**
 * Types de championnat
 */
export enum ChampType {
	ALLER = "Aller",
	ALLER_RETOUR = "Aller/Retour",
	COUPE = "Coupe"
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

    public constructor(init?: Partial<Championnat>) {
        Object.assign(this, init);
    }
}
