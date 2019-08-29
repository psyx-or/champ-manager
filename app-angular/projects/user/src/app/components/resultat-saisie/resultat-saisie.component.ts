import { Component, Input } from '@angular/core';
import { Match } from '@commun/src/app/model/Match';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
		this.matchService.majMatch(this.match, this.feuille).subscribe(
			res => this.activeModal.close(res)
		);
	}
}
