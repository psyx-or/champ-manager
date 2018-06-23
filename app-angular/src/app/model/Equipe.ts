import { Responsable } from "./Responsable";
import { Creneau } from "./Creneau";

/**
 * Une équipe
 */
export class Equipe {
	id?: number;
	nom: string;
	responsables?: Array<Responsable>;
	terrain?: string;
	creneaux?: Array<Creneau>;

	public constructor(init?: Partial<Equipe>) {
		Object.assign(this, init);
	}
}
