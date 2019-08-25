import { ChampType, Championnat } from "@commun/src/app/model/Championnat";
import { Equipe } from "@commun/src/app/model/Equipe";
import { Menu } from "@commun/src/app/components/generic-menu/generic-menu.model";
import { AuthentService } from "../services/authent.service";

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
			{ route: "equipe/coupes", icone: 'git-network', titre: "Coupes" },
			{ route: "equipe/matches", icone: 'clipboard', titre: "Matches" },
			{ route: "equipe/historique", icone: 'film', titre: "Historique" },
			{ route: "equipe", icone: 'contact', titre: "Coordonnées" },
			{ route: "sanction", icone: 'rainy', titre: "Sanctions" },
		]
	},

	/** Menu pour l'équipe connectée */
	equipeConnectee: {
		titre: (e: Equipe) => e.nom,
		items: [
			{ route: "equipe/classement", icone: 'podium', titre: "Classement" },
			{ route: "equipe/coupes", icone: 'git-network', titre: "Coupes" },
			{ route: "equipe/matches", icone: 'clipboard', titre: "Matches" },
			{ route: "equipe/saisie", icone: 'create', titre: "Saisie des résultats" },
			{ route: "equipe/historique", icone: 'film', titre: "Historique" },
			{ route: "equipe/edit", icone: 'contact', titre: "Coordonnées" },
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

/**
 * Description d'un composant affichant le menu "équipe"
 */
export interface EquipeComponent {
	menu: Menu;
	equipe: Equipe;
	authentService: AuthentService;
}

/**
 * Fonction pour mettre à jour automatiquement le menu "équipe" en fonction de l'équipe connectée
 */
export function setMenuEquipe(comp: EquipeComponent) {
	comp.authentService.getEquipe().subscribe(
		equipe => {
			if (equipe == null || comp.equipe == null || equipe.id != comp.equipe.id)
				comp.menu = menus.equipe;
			else
				comp.menu = menus.equipeConnectee;
		}
	);
}
