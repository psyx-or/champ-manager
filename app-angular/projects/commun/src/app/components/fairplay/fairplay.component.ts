import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FairplayService } from '../../services/fairplay.service';
import { Match } from '../../model/Match';
import { FPFeuilleAfficheDTO, FPFeuille } from '../../model/FPFeuille';

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
	forfait: boolean;

	constructor(
		public activeModal: NgbActiveModal,
		private fairplayService: FairplayService
	) { }

	/**
	 * Initialisation du composant
	 */
	ngOnInit() {
		(this.feuille ?
			this.fairplayService.getFeuilleById(this.feuille) :
			this.fairplayService.getFeuille(this.match, this.equipe)
		)
		.subscribe(
			dto => {
				this.dto = dto;
				this.forfait = dto.fpFeuille.id == null && (this.match.forfait1 || this.match.forfait2);
			}
		)
	}

	/**
	 * Indique si le formulaire a été rempli intégralement
	 */
	isIncomplet(): boolean {
		return !this.forfait && Object.values(this.dto.reponses).includes(null);
	}

	/**
	 * Envoi du formulaire
	 */
	submit(): void {
		if (this.forfait) {
			this.activeModal.close(null);
		}
		else {
			this.fairplayService.majFeuille(this.dto).subscribe(
				res => this.activeModal.close(res)
			);
		}
	}
}
