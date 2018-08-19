import { menus } from "../../utils/menus";
import { Equipe } from "@commun/src/app/model/Equipe";
import { OnInit, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RequeteService } from "@commun/src/app/services/requete.service";
import { EquipeService } from "@commun/src/app/services/equipe.service";
import { CanComponentDeactivate } from "@commun/src/app/utils/can-deactivate.guard";

@Component({
	selector: 'app-equipe-edition',
	templateUrl: './equipe-edition.component.html',
	styleUrls: ['./equipe-edition.component.css']
})
export class EquipeEditionComponent implements OnInit, CanComponentDeactivate {

	menu = menus.equipe;
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
				this.router.navigate([]);
			}
		);
	}
}
