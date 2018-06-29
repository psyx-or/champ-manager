import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
		public modalService: NgbModal,
		public requeteService: RequeteService,
		private fairplayService: FairplayService
	) {}

	// TODO: rafraîchir suite à suppression
	// TODO: up and down

	/**
	 * Initialisation du composant
	 */
	ngOnInit() {
		this.types = Object.entries(FPQuestionType);
		this.route.data
			.subscribe((data: { fpforms: FPForm[] }) => this.fpforms = data.fpforms);
	}

	/**
	 * Suppression d'une feuille de fair-play
	 * @param form
	 */
	supprimer(form: FPForm): void {
		openModal(
			this,
			"Suppression de championnat",
			this.supprFeuilleTpl,
			form,
			() => {
				this.requeteService.requete(
					this.fairplayService.supprime(form),
					res => { this.ngOnInit() }
				);
			}
		);
	}
	
	/**
	 * Mise à jour / création de la feuille de fair-play
	 */
	submit(): void {
		// TODO: rafraîchir suite à suppression
		this.requeteService.requete(
			this.fairplayService.maj(this.selfpform),
			s => alert(s)
		);
	}
}
