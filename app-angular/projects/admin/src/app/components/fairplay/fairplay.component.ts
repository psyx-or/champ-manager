import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FairplayService } from '../../services/fairplay.service';
import { Match } from 'projects/commun/src/app/model/Match';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { FPFeuilleAfficheDTO, FPFeuille } from 'projects/commun/src/app/model/FPFeuille';

@Component({
  selector: 'app-fairplay',
  templateUrl: './fairplay.component.html',
  styleUrls: ['./fairplay.component.css']
})
export class FairplayComponent implements OnInit {

	@Input() match: Match;
	@Input() equipe: 1 | 2;
	@Input() feuille: FPFeuille;
	dto: FPFeuilleAfficheDTO;

	constructor(
		public activeModal: NgbActiveModal,
		public requeteService: RequeteService,
		private fairplayService: FairplayService
	) { }

	/**
	 * Initialisation du composant
	 */
	ngOnInit() {
		this.requeteService.requete(
			(this.feuille ?
				this.fairplayService.getFeuilleById(this.feuille) :
				this.fairplayService.getFeuille(this.match, this.equipe)
			),
			dto => this.dto = dto
		)
	}

	/**
	 * Indique si le formulaire a été rempli intégralement
	 */
	isIncomplet(): boolean {
		return Object.values(this.dto.reponses).includes(null);
	}

	/**
	 * Envoi du formulaire
	 */
	submit(): void {
		this.requeteService.requete(
			this.fairplayService.majFeuille(this.dto),
			res => this.activeModal.close(res)
		);
	}
}
