import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipeService } from 'projects/commun/src/app/services/equipe.service';
import { Equipe } from 'projects/commun/src/app/model/Equipe';
import { CanComponentDeactivate } from '@commun/src/app/utils/can-deactivate.guard';
import { menus } from '../../utils/menus';
import { User, AuthentService } from '../../services/authent.service';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent implements OnInit, CanComponentDeactivate {

	menu = menus.equipe;
	user: User = null;
	equipe: Equipe;
	initial: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authentService: AuthentService,
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
		this.authentService.getUser().subscribe(user => this.user = user);
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
		this.equipeService.majEquipes([this.equipe]).subscribe(
			() => {
				alert("Equipe mise à jour");
				this.initial = JSON.stringify(this.equipe);
				this.router.navigate(["/equipe", this.equipe.id]);
			}
		);
	}
}
