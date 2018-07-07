import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FPForm, FPQuestionType } from '../../model/FPForm';
import { RequeteService } from '../../services/requete.service';
import { FairplayService } from '../../services/fairplay.service';
import { openModal } from '../../utils/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fairplay-editor',
  templateUrl: './fairplay-editor.component.html',
  styleUrls: ['./fairplay-editor.component.css']
})
export class FairplayEditorComponent implements OnInit {

	@ViewChild('supprFeuille') supprFeuilleTpl: TemplateRef<any>;
	@ViewChild('supprFeuilleUtilisee') supprFeuilleUtiliseeTpl: TemplateRef<any>;

	fpforms: FPForm[];
	types: [string, string][];
	selfpform: FPForm;
	newFpform = new FPForm();


	/**
	 * Constructeur
	 * @param route 
	 * @param modalService 
	 * @param requeteService 
	 * @param fairplayService 
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public modalService: NgbModal,
		public requeteService: RequeteService,
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
					this.requeteService.requete(
						this.fairplayService.supprime(form),
						res => { this.router.navigate(["/fairplay-editor"]) }
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
	 * Mise à jour / création de la feuille de fair-play
	 */
	submit(): void {
		this.requeteService.requete(
			this.fairplayService.maj(this.selfpform),
			res => { this.router.navigate(["/fairplay-editor"]) }
		);
	}
}
