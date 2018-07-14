import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { EquipeService } from '../../services/equipe.service';
import { Equipe } from '../../model/Equipe';
import { CanComponentDeactivate } from '../../utils/can-deactivate.guard';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent implements OnInit, CanComponentDeactivate {

	equipe: Equipe;
	initial: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public requeteService: RequeteService,
		private equipeService: EquipeService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe }) => {
				this.equipe = data.equipe;
				this.initial = JSON.stringify(this.equipe);
			});
	}

	/**
	 * Vérification de la présence de modification
	 */
	canDeactivate(): boolean {
		return JSON.stringify(this.equipe) == this.initial;
	}


	/**
	 * Mise à jour de l'équipe
	 */
	submit() {
		// On pousse
		this.requeteService.requete(
			this.equipeService.majEquipes([this.equipe]),
			n => {
				alert("Equipe mise à jour");
				this.initial = JSON.stringify(this.equipe);
				this.router.navigate(["/equipe", this.equipe.id]);
			}
		);
	}
}
