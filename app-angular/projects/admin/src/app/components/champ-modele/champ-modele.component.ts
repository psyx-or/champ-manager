import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ChampModele } from 'projects/commun/src/app/model/Championnat';
import { openModal } from 'projects/commun/src/app/utils/utils';
import { ChampionnatService } from 'projects/commun/src/app/services/championnat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { CanComponentDeactivate } from '@commun/src/app/utils/can-deactivate.guard';
import { menus } from '../../utils/menus';

@Component({
  selector: 'app-champ-modele',
  templateUrl: './champ-modele.component.html',
  styleUrls: ['./champ-modele.component.css']
})
export class ChampModeleComponent implements OnInit, CanComponentDeactivate {

	@ViewChild('supprModele', {static:true}) supprModeleTpl: TemplateRef<any>;

	menu = menus.parametres;
	selModele: ChampModele;
	modeles: ChampModele[];
	newModele: ChampModele = new ChampModele();
	initial: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public modalService: NgbModal,
		public requeteService: RequeteService,
		private championnatService: ChampionnatService
	) { }

	ngOnInit() {
		this.route.data.subscribe((data: { modeles: ChampModele[] }) => {
			this.modeles = data.modeles;
			this.selModele = null;
			this.newModele = new ChampModele();
		});
	}

	/**
	 * Vérification de la présence de modification
	 */
	canDeactivate(): boolean {
		return !this.selModele || !this.initial || JSON.stringify(this.selModele) == this.initial;
	}


	/**
	 * Sélection d'un formulaire
	 * @param form 
	 */
	selectModele(modele: ChampModele) {
		this.initial = JSON.stringify(modele);
	}

	/**
	 * Suppression d'un modele
	 * @param modele
	 */
	supprimer(modele: ChampModele): void {
		openModal(
			this,
			"Suppression de championnat",
			this.supprModeleTpl,
			modele,
			() => {
				this.requeteService.requete(
					this.championnatService.supprimeModele(modele),
					res => { this.initial = null; this.router.navigate(["/champ-modele"]); }
				);
			}
		);
	}

	/**
	 * Mise à jour / création du modèle
	 */
	submit(): void {
		this.requeteService.requete(
			this.championnatService.majModele(this.selModele),
			res => { this.initial = null; this.router.navigate(["/champ-modele"]); }
		);
	}
}
