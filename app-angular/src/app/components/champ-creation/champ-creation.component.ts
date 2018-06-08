import { Component, OnInit } from '@angular/core';
import { Championnat, ChampType } from '../../model/Championnat';
import { SportService } from '../../services/sport.service';
import { Sport } from '../../model/Sport';
import { sort } from '../../utils';

@Component({
  selector: 'app-champ-creation',
  templateUrl: './champ-creation.component.html',
  styleUrls: ['./champ-creation.component.css']
})
export class ChampCreationComponent implements OnInit {

    sports: Sport[];
    types: string[];
    newSport: Sport = new Sport();
	championnat: Championnat;
	equipes = Array(24);

    constructor(
        private sportsService: SportService
    ) { }

    ngOnInit() {
        // Récupération des données
        this.types = Object.keys(ChampType);
        this.sportsService.getSports().subscribe(sports => this.sports = sort(sports, 'nom'));

        // Construction de l'objet
        let date = new Date();
        this.championnat = new Championnat({
            saison: date.getMonth() < 8 ? (date.getFullYear() - 1) + " / " + date.getFullYear() : date.getFullYear() + " / " + (date.getFullYear() + 1 ),
			avecNuls: true,
			equipes: Array(this.equipes.length)
        });
	}
	
	getNbEquipes(): number {
		return this.championnat.equipes.filter(e => e).length;
	}
}
