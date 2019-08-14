import { Equipe } from "./Equipe";

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
	categorie?: SanctionCategorie;
}

export interface Sanction {
	id?: number;
	bareme: SanctionBareme;
	equipe: Equipe;
	joueur?: string;
	date: Date;
	commentaire: string;
}
