import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { SanctionService } from '@commun/src/app/services/sanction.service';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '@commun/src/app/services/requete.service';
import { SanctionCategorie, SanctionBareme } from '@commun/src/app/model/Sanction';
import { CanComponentDeactivate } from '@commun/src/app/utils/can-deactivate.guard';

interface SanctionCategorieExt extends SanctionCategorie {
	active: boolean;
}

@Component({
  selector: 'app-sanction-bareme-editor',
  templateUrl: './sanction-bareme-editor.component.html',
  styleUrls: ['./sanction-bareme-editor.component.css']
})
export class SanctionBaremeEditorComponent implements OnInit, CanComponentDeactivate {

	menu = menus.sanctions;
	bareme: SanctionCategorieExt[];
	initial: string;

	constructor(
		private route: ActivatedRoute,
		public requeteService: RequeteService,
		private sanctionService: SanctionService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		// Récupération des données
		this.route.data.subscribe((data: { bareme: SanctionCategorie[] }) => {
			this.init(data.bareme);
		});
	}

	/**
	 * Vérification de la présence de modification
	 */
	canDeactivate(): boolean {
		return !this.bareme || !this.initial || JSON.stringify(this.bareme) == this.initial;
	}


	/**
	 * Ajoute les données nécessaires à l'affichage
	 * @param bareme 
	 */
	private init(bareme: SanctionCategorie[]) {
		this.bareme = bareme.map(c => ({ ...c, active: true }));
		this.initial = JSON.stringify(this.bareme);
	}

	/**
	 * Supprime une catégorie
	 * @param cat 
	 * @param i 
	 */
	supprimerCategorie(cat: SanctionCategorieExt, i: number) {
		if (cat.id != null) {
			cat.active = false;
			cat.baremes.forEach(b => b.actif = false);
		}
		else {
			this.bareme.splice(i, 1);
		}
	}

	/**
	 * Ajoute une catégorie
	 */
	ajouterCategorie() {
		this.bareme.push({
			libelle: null,
			baremes: [],
			active: true
		});
	}

	/**
	 * Supprime une sanction
	 * @param cat 
	 * @param b 
	 * @param i 
	 */
	supprimerBareme(cat: SanctionCategorieExt, b: SanctionBareme, i: number) {
		if (b.id != null)
			b.actif = false;
		else
			cat.baremes.splice(i, 1);
	}
	
	/**
	 * Ajoute une sanction
	 */
	ajouterBareme(cat: SanctionCategorieExt) {
		cat.baremes.push({
			libelle: null,
			sanctionDirigeant: null,
			sanctionEquipe: null,
			sanctionJoueur: null,
			actif: true
		});
	}

	/**
	 * Envoie les modifications sur le serveur
	 */
	submit() {
		this.requeteService.requete(
			this.sanctionService.majBareme(this.bareme),
			res => { this.init(res); }
		);
	}
}
