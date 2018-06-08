import { Sport } from "./Sport";

/**
 * Types de championnat
 */
export enum ChampType {
    Aller = "ALLER",
    "Aller/Retour" = "ALLER_RETOUR",
    Coupe = "COUPE"
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
    public avecNuls: boolean;
    public type: ChampType;
    public equipes: Object[];

    public constructor(init?: Partial<Championnat>) {
        Object.assign(this, init);
    }
}
