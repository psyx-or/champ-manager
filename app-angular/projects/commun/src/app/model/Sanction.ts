export interface SanctionCategorie {
	id?: number;
	libelle: string;
	baremes: SanctionBareme[];
}

export interface SanctionBareme {
	id?: number;
	libelle: number;
	sanctionJoueur: string;
	sanctionEquipe: string;
	sanctionDirigeant: string;
	actif: boolean;
}
