import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { ParametreService } from '../../services/parametre.service';
import { Parametre } from '../../model/Parametre';
import { sort } from '../../utils/utils';
import { CanComponentDeactivate } from '../../utils/can-deactivate.guard';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent implements OnInit, CanComponentDeactivate {

	parametres: Parametre[];
	initial: string;

	constructor(
		private route: ActivatedRoute,
		public requeteService: RequeteService,
		private parametreService: ParametreService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		// Récupération des données
		this.route.data.subscribe((data: { parametres: Parametre[] }) => {
			this.parametres = sort(data.parametres, 'nom');
			this.initial = JSON.stringify(this.parametres);
		});
	}

	/**
	 * Vérification de la présence de modification
	 */
	canDeactivate(): boolean {
		return JSON.stringify(this.parametres) == this.initial;
	}


	/**
	 * Mise à jour des paramètres
	 */
	submit(): void {
		this.requeteService.requete(
			this.parametreService.maj(this.parametres),
			parametres => {
				alert("Paramètres mis à jour");
				this.parametres = sort(parametres, 'nom');
				this.initial = JSON.stringify(this.parametres);
			}
		)
	}
}
