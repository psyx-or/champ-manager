import { Component, OnInit } from '@angular/core';
import { Sport } from 'projects/commun/src/app/model/Sport';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { ActivatedRoute, Router } from '@angular/router';
import { sort } from 'projects/commun/src/app/utils/utils';
import { Equipe } from '@commun/src/app/model/Equipe';

@Component({
  selector: 'app-championnats',
  templateUrl: './championnats.component.html',
  styleUrls: ['./championnats.component.css']
})
export class ChampionnatsComponent implements OnInit {

	sports: Sport[];
	championnats: Map<string, Championnat[]>;
	selSport: Sport = null;
	selChampionnat: Championnat = null;


	/**
	 * Constructeur
	 * @param championnatService 
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
	) { }

	/**
	 * Initialisation du composant
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { championnats: Championnat[] }) => {
				this.sports = [];
				sort(data.championnats, 'nom');
				this.championnats = data.championnats.reduce((map, champ) => {
					let sport = champ.sport.nom;
					if (!map.has(sport)) { this.sports.push(champ.sport); map.set(sport, []) };
					map.get(sport).push(champ);
					return map;
				}, new Map<string, Championnat[]>());
				sort(this.sports, 'nom');
			});
	}

	/**
	 * Sélection d'une équipe dans la zone de recherche
	 * @param equipe
	 */
	selectEquipe(equipe: Equipe): void {
		//TODO
		this.router.navigate(['equipe', equipe.id])
	}

	/**
	 * Sélection d'un championnat
	 * @param champ 
	 */
	selectChampionnat(champ: Championnat): void {
		this.router.navigate(['classement', champ.id])
	}
}
