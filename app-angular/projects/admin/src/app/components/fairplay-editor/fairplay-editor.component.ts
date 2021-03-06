import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FairplayService } from 'projects/commun/src/app/services/fairplay.service';
import { openModal } from 'projects/commun/src/app/utils/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '@commun/src/app/utils/can-deactivate.guard';
import { FPForm, FPQuestionType, FPCategorie } from 'projects/commun/src/app/model/FPForm';
import { menus } from '../../utils/menus';

@Component({
  selector: 'app-fairplay-editor',
  templateUrl: './fairplay-editor.component.html',
  styleUrls: ['./fairplay-editor.component.css']
})
export class FairplayEditorComponent implements OnInit, CanComponentDeactivate {

	@ViewChild('supprFeuille', {static:true}) supprFeuilleTpl: TemplateRef<any>;
	@ViewChild('supprFeuilleUtilisee', {static:true}) supprFeuilleUtiliseeTpl: TemplateRef<any>;

	menu = menus.parametres;
	fpforms: FPForm[];
	types: [string, string][];
	selfpform: FPForm;
	newFpform = new FPForm();
	initial: string;


	/**
	 * Constructeur
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public modalService: NgbModal,
		private fairplayService: FairplayService
	) {}

	/**
	 * Initialisation du composant
	 */
	ngOnInit() {
		this.types = Object.entries(FPQuestionType);
		this.route.data.subscribe((data: { fpforms: FPForm[] }) => {
			this.fpforms = data.fpforms;
			this.selfpform = null;
		});
	}

	/**
	 * Vérification de la présence de modification
	 */
	canDeactivate(): boolean {
		return !this.selfpform || !this.initial || JSON.stringify(this.selfpform) == this.initial;
	}

	
	/**
	 * Sélection d'un formulaire
	 * @param form 
	 */
	selectFpForm(form: FPForm) {
		this.initial = JSON.stringify(form);
	}

	/**
	 * Suppression d'une feuille de fair-play
	 * @param form
	 */
	supprimer(form: FPForm): void {
		if (form.champModeles.length == 0) {
			openModal(
				this,
				"Suppression de feuille de fair-play",
				this.supprFeuilleTpl,
				form,
				() => {
					this.fairplayService.supprime(form).subscribe(
						() => { this.initial = null; this.router.navigate(["/fairplay-editor"]) }
					);
				}
			);
		}
		else {
			openModal(
				this,
				"Suppression de feuille de fair-play",
				this.supprFeuilleUtiliseeTpl,
				form.champModeles.map(m => m.nomModele).join(",")
			);
		}
	}

	/**
	 * Déplace un objet dans une liste
	 * @param tab
	 * @param index 
	 * @param sens 
	 */
	deplacer(tab: Array<any>, index: number, sens: number) {
		let a = tab[index];
		let b = tab[index + sens];
		tab[index] = b;
		tab[index + sens] = a;
	}

	/**
	 * Ajoute une catégorie à une feuille de fair-play
	 * @param form 
	 */
	ajouterCategorie(form: FPForm) {
		form.categories.push({
			libelle: null,
			questions: [],
		});
	}

	/**
	 * Ajoute une question à une catégorie
	 * @param cat 
	 */
	ajouterQuestion(cat: FPCategorie) {
		cat.questions.push({
			titre: null,
			libelle: null,
			type: null,
			alerte: false,
		});
	}

	/**
	 * Mise à jour / création de la feuille de fair-play
	 */
	submit(): void {
		this.fairplayService.maj(this.selfpform).subscribe(
			() => { this.initial = null; this.router.navigate(["/fairplay-editor"]); }
		);
	}
}
