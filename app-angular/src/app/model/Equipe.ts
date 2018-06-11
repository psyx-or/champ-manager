export class Equipe {
	id?: number;
	nom: string;

	public constructor(init?: Partial<Equipe>) {
		Object.assign(this, init);
	}
}
