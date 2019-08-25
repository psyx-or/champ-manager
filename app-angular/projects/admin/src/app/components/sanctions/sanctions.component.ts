import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Sanction } from '@commun/src/app/model/Sanction';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '@commun/src/app/services/requete.service';
import { SanctionService } from '@commun/src/app/services/sanction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SanctionCreationComponent } from '../sanction-creation/sanction-creation.component';
import { Sport } from '@commun/src/app/model/Sport';
import { EquipeService } from '@commun/src/app/services/equipe.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sanctions',
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.css']
})
export class SanctionsComponent implements OnInit {

	menu = menus.sanctions;
	sports: Sport[];
	selSport: Sport;
	sanctions: Sanction[];

	constructor(
		private route: ActivatedRoute,
		private modalService: NgbModal,
		public requeteService: RequeteService,
		private sanctionService: SanctionService,
		private equipeService: EquipeService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { sports: Sport[] }) => this.sports = data.sports);
	}

	/**
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.requeteService.requete(
			this.sanctionService.get(this.selSport),
			sanctions => this.sanctions = sanctions
		);
	}

	/**
	 * Ouvre la fenêtre d'ajout de sanction
	 */
	ajouterSanction() {
		this.requeteService.requete(
			forkJoin(
				this.equipeService.getEquipesCourantes(this.selSport),
				this.sanctionService.getBareme(),
			),
			([equipes, bareme]) => {
				const modal = this.modalService.open(SanctionCreationComponent, { centered: true, size: 'lg' });
				modal.componentInstance.equipes = equipes;
				modal.componentInstance.bareme = bareme;
				modal.result.then(this.selectionSport.bind(this));
			}
		);
	}
}
