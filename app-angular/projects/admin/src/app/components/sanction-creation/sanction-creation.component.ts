import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SanctionCategorie, Sanction } from '@commun/src/app/model/Sanction';
import { Sport } from '@commun/src/app/model/Sport';
import { Equipe } from '@commun/src/app/model/Equipe';
import { SanctionService } from '@commun/src/app/services/sanction.service';

@Component({
  selector: 'app-sanction-creation',
  templateUrl: './sanction-creation.component.html',
  styleUrls: ['./sanction-creation.component.css']
})
export class SanctionCreationComponent implements OnInit {

	@Input() bareme: SanctionCategorie[];
	@Input() equipes: Equipe[];
	@Input() equipe: Equipe;

	selSport: Sport;
	sanction: Sanction;

	constructor(
		public activeModal: NgbActiveModal,
		private sanctionService: SanctionService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.sanction = {
			date: new Date(),
			equipe: this.equipe,
			joueur: null,
			bareme: null,
			commentaire: null
		}
	}

	/**
	 * Ajoute la sanction
	 */
	submit() {
		this.sanctionService.creer(this.sanction).subscribe(
			() => this.activeModal.close()
		);
	}
}
