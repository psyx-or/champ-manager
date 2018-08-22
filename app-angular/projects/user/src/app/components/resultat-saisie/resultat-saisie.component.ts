import { Component, OnInit, Input } from '@angular/core';
import { Match } from '@commun/src/app/model/Match';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequeteService } from '@commun/src/app/services/requete.service';
import { MatchService } from '@commun/src/app/services/match.service';

@Component({
  selector: 'app-resultat-saisie',
  templateUrl: './resultat-saisie.component.html',
  styleUrls: ['./resultat-saisie.component.css']
})
export class ResultatSaisieComponent {

	@Input() match: Match;

	feuille: File;
	desactive: boolean = false;

	constructor(
		public activeModal: NgbActiveModal,
		public requeteService: RequeteService,
		private matchService: MatchService
	) { }

	/**
	 * Sélection de la feuille de match
	 * @param fichiers 
	 */
	selectionFichier(fichiers: FileList) {
		this.feuille = fichiers.item(0);
	}

	/**
	 * Annule la saisie existante
	 */
	annulerSaisie() {
		this.desactive = true;
		
		this.match.score1 = null;
		this.match.score2 = null;
		this.match.forfait1 = false;
		this.match.forfait2 = false;

		this.submit();
	}

	/**
	 * Validation du formulaire
	 */
	submit() {
		this.requeteService.requete(
			this.matchService.majMatch(this.match, this.feuille),
			res => this.activeModal.close(res)
		);
	}
}
