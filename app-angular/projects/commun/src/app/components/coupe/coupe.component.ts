import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Championnat } from '../../model/Championnat';
import { Match } from '../../model/Match';
import { getVainqueur } from '../../utils/utils';
import { Journee } from '../../model/Journee';
import { Menu } from '../generic-menu/generic-menu.model';
import { Treant } from 'treant-js';

/**
 * Node content
 */
interface Node {
	text: {
		name: string | { val: string, href: string },
		desc?: string,
	},
	HTMLclass?: string,
	children?: Array<Node>
}

/**
 * Chart configuration
 */
const chart = {
	chart: {
		container: "#chart",
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

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-coupe',
  templateUrl: './coupe.component.html',
  styleUrls: ['./coupe.component.css']
})
export class CoupeComponent implements OnInit, AfterViewInit {

	@Input() journee: Journee;

	menu: Menu;
	champ: Championnat;
	nbEquipes: number;


	/**
	 * Constructeur
	 * @param route 
	 * @param requeteService 
	 * @param matchService 
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		if (this.journee != null)
			this.init(this.journee);
		else
			this.route.data
				.subscribe((data: { journee: Journee, menu: Menu }) => {
					this.menu = data.menu;
					this.init(data.journee);
				}
			);
	}

	/**
	 * Fin de l'initialisation
	 */
	ngAfterViewInit(): void {
		new Treant(chart);
	}

	/**
	 * Initialisation réelle
	 * @param journee 
	 */
	private init(journee: Journee) {
		this.champ = journee.championnat;
		[chart.nodeStructure, this.nbEquipes] = this.buildChart(journee.matches[0]);
	}

	/**
	 * Génération récursive de l'arbre des matches
	 * @param match Le match de plus haut niveau
	 * @returns Le noeud de 1er niveau et le nombre d'équipes au total
	 */
	private buildChart(match: Match): [Node, number] {

		let nbEquipes = 0;
		let vainqueur = getVainqueur(match);

		// Création du noeud du match
		let node: Node = {
			text: {
				name: {
					val: " ",
					href: null,
				},
				desc: vainqueur != null ? match.score1 + " à " + match.score2 : "",
			},
			children: [
			]
		};

		if (vainqueur != null) {
			node.text.name = {
				val: vainqueur.nom,
				href: this.router.createUrlTree(["equipe", "matches", vainqueur.id]).toString()
			};
		}

		// 1er fils
		if (match.match1 != null) {
			let res = this.buildChart(match.match1);
			node.children.push(res[0]);
			nbEquipes += res[1];
		}
		else {
			node.children.push({
				text: {
					name: {
						val: match.equipe1.nom,
						href: this.router.createUrlTree(["equipe", "matches", match.equipe1.id]).toString()
					},
				},
				HTMLclass: "Treant-match-initial",
			});
			nbEquipes++;
		}

		// 2e fils
		if (match.match2 != null) {
			let res = this.buildChart(match.match2);
			node.children.push(res[0]);
			nbEquipes += res[1];
		}
		else {
			node.children.push({
				text: {
					name: {
						val: match.equipe2.nom,
						href: this.router.createUrlTree(["equipe", "matches", match.equipe2.id]).toString()
					},
				},
				HTMLclass: "Treant-match-initial",
			});
			nbEquipes++;
		}
		
		return [node, nbEquipes];
	}
}
