import { ChampType, Championnat } from "projects/commun/src/app/model/Championnat";
import { Equipe } from "projects/commun/src/app/model/Equipe";

/**
 * Un élément de menu
 */
export class MenuItem {
	route: string;
	icone?: string;
	titre: string;
	cond?: (c: any) => boolean;
}

/**
 * Un menu complet
 */
export class Menu {
	titre: ((c: any) => string) | string;
	icone?: string;
	items: MenuItem[];
}

/**
 * Les menus
 */
export var menus: { [nom: string]: Menu } = {
	/** Menu des championnats */
	championnat: {
		titre: (c: Championnat) => c.nom + " (" + c.sport.nom + " " + c.saison + ")",
		items: [
			{ route: "matches", icone: 'clipboard', titre: "Matches" },
			{ route: "classement", icone: 'podium', titre: "Classement", cond: (c: Championnat) => c.type == ChampType.Aller || c.type == ChampType["Aller/Retour"] },
			{ route: "coupe", icone: 'git-network', titre: "Plateau", cond: (c: Championnat) => c.type == ChampType.Coupe },
			{ route: "fairplay-classement", icone: 'happy', titre: "Classement de fair-play", cond: (c: Championnat) => c.fpForm != null },
			{ route: "journees", icone: 'calendar', titre: "Calendrier" },
		]
	},

	/** Menu du calendrier */
	calendrier: {
		titre: "Calendrier",
		icone: "calendar",
		items: [
			{ route: "calendrier", icone: 'paper', titre: "Export" },
			{ route: "calendrier-doublons", icone: 'git-compare', titre: "Inversion de matches" },
		]
	},

	/** Menu des paramètres */
	parametres: {
		titre: "Paramètres",
		icone: "settings",
		items: [
			{ route: "parametres", titre: "Paramètres" },
			{ route: "champ-modele", titre: "Modèles de championnat" },
			{ route: "fairplay-editor", titre: "Feuilles de fair-play" },
		]
	},

	/** Menu des équipes */
	equipe: {
		titre: (e: Equipe) => e.nom,
		items: [
			{ route: "equipe", icone: 'contact', titre: "Coordonnées" },
			{ route: "fairplay-equipe/evaluation", icone: 'happy', titre: "Evaluations" },
			{ route: "fairplay-equipe/redaction", icone: 'create', titre: "Feuilles rédigées" },
			{ route: "sanction", icone: 'rainy', titre: "Sanctions" },
		]
	},

	/** Menu des sanctions */
	sanctions: {
		titre: "Sanctions",
		icone: "rainy",
		items: [
			{ route: "sanction-liste", icone: 'film', titre: "Historique" },
			{ route: "sanction-bareme", icone: 'list-box', titre: "Barème" },
		]
	},
}
