import { Match } from "./Match";

/**
 * Un terrain avec plusieurs matches pour la même journée
 */
export class DoublonDTO {
	debut: Date;
	matches: Match[];
}
