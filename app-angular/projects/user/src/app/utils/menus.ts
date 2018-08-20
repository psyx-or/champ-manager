import { ChampType, Championnat } from "@commun/src/app/model/Championnat";
import { Equipe } from "@commun/src/app/model/Equipe";
import { Menu } from "@commun/src/app/components/generic-menu/generic-menu.model";

/**
 * Les menus
 */
export var menus: { [nom: string]: Menu } = {
	/** Menu des championnats */
	championnat: {
		titre: (c: Championnat) => c.nom + " (" + c.sport.nom + " " + c.saison + ")",
		items: [
			{ route: "classement", icone: 'podium', titre: "Classement", cond: (c: Championnat) => c.type == ChampType.Aller || c.type == ChampType["Aller/Retour"] },
			{ route: "coupe", icone: 'git-network', titre: "Plateau", cond: (c: Championnat) => c.type == ChampType.Coupe },
			{ route: "matches", icone: 'clipboard', titre: "Matches" },
		]
	},

	/** Menu des équipes */
	equipe: {
		titre: (e: Equipe) => e.nom,
		items: [
			{ route: "equipe/classement", icone: 'podium', titre: "Classement" },
			{ route: "equipe/matches", icone: 'clipboard', titre: "Matches" },
			{ route: "equipe/historique", icone: 'filing', titre: "Historique" },
			{ route: "equipe", icone: 'contact', titre: "Coordonnées" },
		]
	},

	/** Menu pour l'équipe connectée */
	equipeConnectee: {
		titre: (e: Equipe) => e.nom,
		items: [
			{ route: "equipe/classement", icone: 'podium', titre: "Classement" },
			{ route: "equipe/matches", icone: 'clipboard', titre: "Matches" },
			{ route: "equipe/saisie", icone: 'create', titre: "Saisie des résultats" },
			{ route: "equipe/historique", icone: 'filing', titre: "Historique" },
			{ route: "equipe/edit", icone: 'contact', titre: "Coordonnées" },
		]
	},
}
