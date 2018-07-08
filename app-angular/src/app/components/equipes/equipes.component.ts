import { Component, OnInit } from '@angular/core';
import { Sport } from '../../model/Sport';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { EquipeService } from '../../services/equipe.service';
import { Equipe } from '../../model/Equipe';

@Component({
  selector: 'app-equipes',
  templateUrl: './equipes.component.html',
  styleUrls: ['./equipes.component.css']
})
export class EquipesComponent implements OnInit {

	sports: Sport[];
	selSport: Sport;
	equipes: Equipe[];
	
	constructor( 
		private route: ActivatedRoute,
		public requeteService: RequeteService,
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
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.requeteService.requete(
			this.equipeService.getEquipesCourantes(this.selSport),
			equipes => this.equipes = equipes
		);
	}

	/**
	 * Pousse les modifications
	 */
	submit(): void {
		// On pousse
		this.requeteService.requete(
			this.equipeService.majEquipes(this.equipes),
			n => { alert("Equipes mises à jour"); this.selectionSport(); }
		);
	}

	/**
	 * Renvoie le lien vers l'annuaire
	 */
	lienAnnuaire(): string {
		return this.equipeService.lienAnnuaire(this.selSport);
	}
}
