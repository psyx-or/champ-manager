import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParametreService } from 'projects/commun/src/app/services/parametre.service';
import { sort } from 'projects/commun/src/app/utils/utils';
import { CanComponentDeactivate } from '@commun/src/app/utils/can-deactivate.guard';
import { Parametre } from 'projects/commun/src/app/model/Parametre';
import { menus } from '../../utils/menus';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent implements OnInit, CanComponentDeactivate {

	menu = menus.parametres;
	parametres: Parametre[];
	initial: string;

	constructor(
		private route: ActivatedRoute,
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
		this.parametres.forEach(p => p.valeur = p.valeur.toString());
		this.parametreService.maj(this.parametres).subscribe(
			parametres => {
				alert("Paramètres mis à jour");
				this.parametres = sort(parametres, 'nom');
				this.initial = JSON.stringify(this.parametres);
			}
		)
	}
}
