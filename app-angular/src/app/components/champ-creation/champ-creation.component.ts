import { Component, OnInit } from '@angular/core';
import { Championnat, ChampType } from '../../model/Championnat';
import { SportService } from '../../services/sport.service';
import { Sport } from '../../model/Sport';
import { sort } from '../../utils';
import { ChampionnatService } from '../../services/championnat.service';

@Component({
  selector: 'app-champ-creation',
  templateUrl: './champ-creation.component.html',
  styleUrls: ['./champ-creation.component.css']
})
export class ChampCreationComponent implements OnInit {

    sports: Sport[];
    types: [string,string][];
    newSport: Sport = new Sport();
	championnat: Championnat;
	equipes = Array(24);
	itequipes = Array(this.equipes.length);
	avecNuls: boolean = true;


	/**
	 * Constructeur
	 * @param sportsService 
	 * @param championnatService 
	 */
    constructor(
        private sportsService: SportService,
        private championnatService: ChampionnatService
    ) { }

	/**
	 * Initialisation
	 */
    ngOnInit() {
        // Récupération des données
        this.types = Object.entries(ChampType);
        this.sportsService.getSports().subscribe(sports => this.sports = sports);

        // Construction de l'objet
        let date = new Date();
        this.championnat = new Championnat({
            saison: date.getMonth() < 8 ? (date.getFullYear() - 1) + " / " + date.getFullYear() : date.getFullYear() + " / " + (date.getFullYear() + 1 )
        });
	}
	
	/**
	 * Lance la création
	 */
	submit(): void {
		if (!this.avecNuls) 
			this.championnat.ptnul = null;

		this.championnatService.create(this.championnat).subscribe(
			champ => {
			},
			err => {
			}
		);
	}

	/**
	 * @returns Nombre d'équipe actuellement associées au championnat
	 */
	getNbEquipes(): number {
		return this.equipes.filter(e => e).length;
	}
}
