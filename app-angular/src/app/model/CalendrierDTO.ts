import { Championnat } from "./Championnat";

/**
 * Bilan des journées d'un championnat
 */
export class CalendrierDTO {
	championnat: Championnat;
	nbJournees: number;
	nbJourneesDefinies: number;
	debut?: Date;
	fin?: Date;
}
