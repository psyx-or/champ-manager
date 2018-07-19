import { Responsable } from "./Responsable";
import { Creneau } from "./Creneau";
import { Sport } from "./Sport";

/**
 * Une équipe
 */
export class Equipe {
	id?: number;
	nom: string;
	responsables?: Array<Responsable>;
	terrain?: string;
	creneaux?: Array<Creneau>;
	position?: string;
	sport?: Sport;

	public constructor(init?: Partial<Equipe>) {
		Object.assign(this, init);
	}
}
