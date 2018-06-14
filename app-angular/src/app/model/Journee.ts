import { Championnat } from "./Championnat";
import { Match } from "./Match";

/**
 * Une journée
 */
export class Journee {
	numero: number;
	debut?: Date;
	fin?: Date;
	championnat?: Championnat;
	matches?: Match[];
}
