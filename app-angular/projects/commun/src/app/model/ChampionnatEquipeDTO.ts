import { Equipe } from "./Equipe";
import { Championnat } from "./Championnat";

/**
 * Liste des championnats d'une équipe
 */
export class ChampionnatEquipeDTO {
	equipe: Equipe;
	championnats: Championnat[];
}
