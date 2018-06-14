import { Component, OnInit } from '@angular/core';
import { ChampionnatService } from '../../services/championnat.service';
import { Championnat } from '../../model/Championnat';
import { Sport } from '../../model/Sport';
import { sort } from '../../utils';

@Component({
  selector: 'app-championnats',
  templateUrl: './championnats.component.html',
  styleUrls: ['./championnats.component.css']
})
export class ChampionnatsComponent implements OnInit {

	sports: Sport[];
	championnats: Map<string, Championnat[]>;


	/**
	 * Constructeur
	 * @param championnatService 
	 */
    constructor(
        private championnatService: ChampionnatService
    ) { }

	/**
	 * Initialisation du composant
	 */
    ngOnInit() {
		// TODO: filtre par défaut sur la saison en cours
        this.championnatService.getChampionnats().subscribe(championnats => {
			this.sports = [];
			sort(championnats, 'nom');
			this.championnats = championnats.reduce((map, champ) => {
				let sport = champ.sport.nom;
				if (!map.has(sport)) {this.sports.push(champ.sport); map.set(sport, [])};
				map.get(sport).push(champ);
				return map;
			}, new Map<string, Championnat[]>());
			sort(this.sports, 'nom');
		});
	}
	
	/**
	 * Suppression d'un championnat
	 * @param champ
	 */
	supprimer(champ: Championnat): void {
		// TODO: confirmation
		this.championnatService.supprime(champ).subscribe(
			res => { this.ngOnInit() },
			err => alert("Erreur lors de la suppression")
		);
	}
}
