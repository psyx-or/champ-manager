import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequeteService } from '@commun/src/app/services/requete.service';
import { SanctionCategorie, Sanction } from '@commun/src/app/model/Sanction';
import { Sport } from '@commun/src/app/model/Sport';
import { EquipeService } from '@commun/src/app/services/equipe.service';
import { Equipe } from '@commun/src/app/model/Equipe';
import { SanctionService } from '@commun/src/app/services/sanction.service';

@Component({
  selector: 'app-sanction-creation',
  templateUrl: './sanction-creation.component.html',
  styleUrls: ['./sanction-creation.component.css']
})
export class SanctionCreationComponent implements OnInit {

	@Input() sports: Sport[];
	@Input() bareme: SanctionCategorie[];

	selSport: Sport;
	selCategorie: SanctionCategorie;
	sanction: Sanction;
	equipes: Equipe[];

	constructor(
		public activeModal: NgbActiveModal,
		public requeteService: RequeteService,
		private equipeService: EquipeService,
		private sanctionService: SanctionService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.sanction = {
			date: new Date(),
			equipe: null,
			joueur: null,
			bareme: null,
			commentaire: null
		}
	}

	/**
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.requeteService.requete(
			this.equipeService.getEquipesCourantes(this.selSport),
			equipes => this.equipes = equipes
		);
	}

	/**
	 * Ajoute la sanction
	 */
	submit() {
		this.requeteService.requete(
			this.sanctionService.creer(this.sanction),
			() => this.activeModal.close()
		);
	}
}
