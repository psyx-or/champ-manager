import { Component, OnInit } from '@angular/core';
import { Sport } from 'projects/commun/src/app/model/Sport';
import { ActivatedRoute } from '@angular/router';
import { EquipeService } from 'projects/commun/src/app/services/equipe.service';
import { Equipe } from 'projects/commun/src/app/model/Equipe';
import { CanComponentDeactivate } from '@commun/src/app/utils/can-deactivate.guard';

@Component({
  selector: 'app-equipes',
  templateUrl: './equipes.component.html',
  styleUrls: ['./equipes.component.css']
})
export class EquipesComponent implements OnInit, CanComponentDeactivate {

	sports: Sport[];
	selSport: Sport;
	equipes: Equipe[];
	initial: string;
	
	
	constructor( 
		private route: ActivatedRoute,
		private equipeService: EquipeService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { sports: Sport[] }) => this.sports = data.sports);
	}

	/**
	 * Vérification de la présence de modification
	 */
	canDeactivate(): boolean {
		return JSON.stringify(this.equipes) == this.initial;
	}


	/**
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.equipeService.getEquipesCourantes(this.selSport).subscribe(
			equipes => {
				this.equipes = equipes
				this.initial = JSON.stringify(this.equipes);
			}
		);
	}

	/**
	 * Pousse les modifications
	 */
	submit(): void {
		// On pousse
		this.equipeService.majEquipes(this.equipes).subscribe(
			() => { alert("Equipes mises à jour"); this.selectionSport(); }
		);
	}

	/**
	 * Renvoie le lien vers l'annuaire
	 */
	lienAnnuaire(): string {
		return this.equipeService.lienAnnuaire(this.selSport);
	}
}
