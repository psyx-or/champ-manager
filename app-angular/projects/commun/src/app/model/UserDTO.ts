/**
 * Informations renvoyées par le serveur sur l'utilisateur courant
 */
export interface UserDTO {
	/** Identifiant d'une équipe */
	id: number | null;
	/** Nom de l'équipe */
	nom: string | null
	/** Identifiant d'un championnat */
	champId?: number;
	/** Nom du championnat */
	champNom?: string;
	/** Rôles de l'utilisateur */
	roles: string[];
}
