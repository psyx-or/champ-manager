import { ChampType, Championnat } from "../model/Championnat";

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
			{ route: "journees", icone: 'calendar', titre: "Calendrier" },
		]
	},

	/** Menu des paramètres */
	parametres: {
		titre: "Paramètres",
		icone: "settings", // TODO
		items: [
			{ route: "fairplay-editor", icone: 'clipboard', titre: "Feuilles de fair-play" },
		]
	}
}
