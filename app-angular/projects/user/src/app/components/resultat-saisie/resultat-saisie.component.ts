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

	constructor(
		public activeModal: NgbActiveModal,
		public requeteService: RequeteService,
		private matchService: MatchService
	) { }

	selectionFichier(fichiers: FileList) {
		this.feuille = fichiers.item(0);
	}

	//TODO: annulation de saisie

	submit() {
		this.requeteService.requete(
			this.matchService.majMatch(this.match, this.feuille),
			res => this.activeModal.close(res)
		);
	}
}
