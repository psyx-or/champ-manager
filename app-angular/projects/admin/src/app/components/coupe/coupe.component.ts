import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { MatchService } from '../../services/match.service';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Match } from 'projects/commun/src/app/model/Match';
import { Equipe } from 'projects/commun/src/app/model/Equipe';
import { getVainqueur } from 'projects/commun/src/app/utils/utils';
import { Journee } from 'projects/commun/src/app/model/Journee';


/**
 * Une cellule du plateau
 */
class Cellule {
	label: string;
	rowspan: number;
	colspan: number;
	perdant?: boolean;

	/**
	 * Construit la cellule à partir d'un match
	 * @param match 
	 * @param rowspan 
	 * @param col 
	 */
	public static fromMatch(match: Match, vainqueur: Equipe|null, rowspan: number, col: number): Cellule {
		let label;
		if (vainqueur != null) {
			label = vainqueur.nom;
		}
		else {
			label = "?";
		}

		return {
			label: label,
			rowspan: rowspan,
			colspan: 1
		};
	}

	/**
	 * Construit la cellule à partir d'une équipe
	 * @param equipe 
	 */
	public static fromEquipe(equipe: Equipe): Cellule {
		return {
			label: equipe.nom,
			rowspan: 1,
			colspan: 1
		};
	}
}


//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-coupe',
  templateUrl: './coupe.component.html',
  styleUrls: ['./coupe.component.css']
})
export class CoupeComponent implements OnInit {

	champ: Championnat;
	plateau: Cellule[][];
	maxCol: number = 0;


	/**
	 * Constructeur
	 * @param route 
	 * @param requeteService 
	 * @param matchService 
	 */
	constructor(
		private route: ActivatedRoute,
		private requeteService: RequeteService,
		private matchService: MatchService
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { journee: Journee }) => {
				this.champ = data.journee.championnat;
				this.plateau = new Array<Cellule[]>();
				this.buildPlateau(data.journee.matches[0], 0, 0);
				this.retournePlateau();
			}
		);
	}

	/**
	 * Retourne le plateau de façon à avoir la finale à droite et non à gauche
	 */
	private retournePlateau() {
		this.plateau.forEach( ligne => {
			ligne.reverse();

			// Si la ligne est plus courte que les autres, ajuster la longueur de la première cellule
			ligne[0].colspan = this.maxCol - ligne.length + 2;

			// Suppression des cellules vides
			let index = ligne.findIndex(x => x === undefined);
			if (index != -1) ligne.splice(index);
		});
	}

	/**
	 * Parcourt récursivement les matches pour construire le plateau
	 * @param match Match courant
	 * @param r Numéro de ligne sur le plateau
	 * @param c Numéro de colonne sur le plateau
	 */
	private buildPlateau(match: Match, r: number, c: number): Cellule {
		let cell1: Cellule = null;
		let cell2: Cellule = null;

		// Construction de la cellule de la première équipe
		if (match.match1 != null)
			cell1 = this.buildPlateau(match.match1, r, c + 1);
		else
			cell1 = this.enregistre(Cellule.fromEquipe(match.equipe1), r, c + 1);

		// Construction de la cellule de la seconde équipe
		if (match.match2 != null)
			cell2 = this.buildPlateau(match.match2, r + cell1.rowspan, c + 1);
		else
			cell2 = this.enregistre(Cellule.fromEquipe(match.equipe2), r + cell1.rowspan, c + 1);

		// Si le match a été joué, qui a gagné?
		let vainqueur = getVainqueur(match);
		if (vainqueur != null) {
			if (vainqueur == match.equipe1)
				cell1.perdant = false;
			else
				cell1.perdant = true;
			
			cell2.perdant = !cell1.perdant;
		}

		// Construction de la cellule du match
		return this.enregistre(Cellule.fromMatch(match, vainqueur, cell1.rowspan + cell2.rowspan, c), r, c);
	}

	/**
	 * Enregistre une cellule sur le plateau à la position indiquée
	 * @param cell 
	 * @param r Numéro de ligne sur le plateau
	 * @param c Numéro de colonne sur le plateau
	 */
	private enregistre(cell: Cellule, r: number, c: number): Cellule {
		this.maxCol = Math.max(this.maxCol, c);
		if (this.plateau[r] == undefined)
			this.plateau[r] = new Array<Cellule>();
		this.plateau[r][c] = cell;
		return cell;
	}
}
