import { Component, Input, AfterViewInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Championnat } from '../../model/Championnat';
import { Match } from '../../model/Match';
import { getVainqueur, toDisp, calculeStyle } from '../../utils/utils';
import { Journee } from '../../model/Journee';
import { Treant } from 'treant-js';
import { Equipe } from '../../model/Equipe';

/**
 * Node content
 */
interface Node {
	text: {
		name: string | { val: string, href: string },
		desc?: string,
	},
	HTMLclass: string,
	children?: Array<Node>
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-coupe',
  templateUrl: './coupe.component.html',
  styleUrls: ['./coupe.component.css']
})
export class CoupeComponent implements OnChanges, AfterViewInit {

	@ViewChild('chartDiv') chartDiv: ElementRef<Element>;

	@Input() journee: Journee;
	@Input() equipe: Equipe;

	champ: Championnat;
	nbEquipes: number;

	/**
	 * Chart configuration
	 */
	private chart = {
		chart: {
			container: "#chart-",
			levelSeparation: 20,
			siblingSeparation: 15,
			subTeeSeparation: 30,
			rootOrientation: "EAST",

			node: {
				HTMLclass: "Treant-match",
				drawLineThrough: true
			},
			connectors: {
				type: "straight",
				style: {
					"stroke-width": 2,
					"stroke": "#ccc"
				}
			}
		},
		nodeStructure: <Node>null,
	};


	/**
	 * Constructeur
	 */
	constructor(
		private router: Router,
	) { }

	/**
	 * Initialisation
	 */
	ngOnChanges() {
		this.champ = this.journee.championnat;
		[this.chart.nodeStructure, this.nbEquipes] = this.buildChart(this.journee.matches[0]);
		if (this.chartDiv) this.ngAfterViewInit();
	}

	/**
	 * Fin de l'initialisation
	 */
	ngAfterViewInit(): void {
		this.chartDiv.nativeElement.innerHTML = "";
		this.chart.chart.container = `#chart-${this.champ.id}`;
		new Treant(this.chart);
	}

	/**
	 * Génération récursive de l'arbre des matches
	 * @param match Le match de plus haut niveau
	 * @returns Le noeud de 1er niveau et le nombre d'équipes au total
	 */
	private buildChart(match: Match): [Node, number] {

		let nbEquipes = 0;
		let vainqueur = getVainqueur(match);
		toDisp(match);

		// Création du noeud du match
		let node: Node = {
			text: {
				name: {
					val: " ",
					href: null,
				},
				desc: vainqueur != null ? match.dispScore1 + " - " + match.dispScore2 : "",
			},
			HTMLclass: "",
			children: []
		};

		if (vainqueur != null) {
			node.text.name = {
				val: vainqueur.nom,
				href: this.router.createUrlTree(["equipe", "matches", vainqueur.id]).toString()
			};
		}

		// 1er fils
		let child1: Node = null;
		let nb: number;
		if (match.match1 != null) {
			[child1, nb] = this.buildChart(match.match1);
		}
		else {
			child1 = {
				text: {
					name: {
						val: match.equipe1.nom,
						href: this.router.createUrlTree(["equipe", "matches", match.equipe1.id]).toString()
					},
				},
				HTMLclass: "Treant-match-initial ",
			};
			nb = 1;
		}
		nbEquipes += nb;
		child1.HTMLclass += calculeStyle(match, 1, this.equipe);
		node.children.push(child1);

		// 2e fils
		let child2: Node = null;
		if (match.match2 != null) {
			[child2, nb] = this.buildChart(match.match2);
		}
		else {
			child2 = {
				text: {
					name: {
						val: match.equipe2.nom,
						href: this.router.createUrlTree(["equipe", "matches", match.equipe2.id]).toString()
					},
				},
				HTMLclass: "Treant-match-initial ",
			};
			nb = 1;
		}
		nbEquipes += nb;
		child2.HTMLclass += calculeStyle(match, 2, this.equipe);
		node.children.push(child2);
		
		return [node, nbEquipes];
	}
}
