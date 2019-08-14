import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Sanction, SanctionBareme } from '@commun/src/app/model/Sanction';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '@commun/src/app/services/requete.service';
import { SanctionService } from '@commun/src/app/services/sanction.service';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { SanctionCreationComponent } from '../sanction-creation/sanction-creation.component';
import { forkJoin } from 'rxjs';
import { SportService } from '@commun/src/app/services/sport.service';

@Component({
  selector: 'app-sanctions',
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.css']
})
export class SanctionsComponent implements OnInit {

	menu = menus.sanctions;
	sanctions: Sanction[];

	constructor(
		private route: ActivatedRoute,
		private modalService: NgbModal,
		public requeteService: RequeteService,
		private sanctionService: SanctionService,
		private sportService: SportService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		// Récupération des données
		this.route.data.subscribe((data: { sanctions: Sanction[] }) => {
			this.sanctions = data.sanctions;
		});
	}

	/**
	 * Recharge les sanctions
	 */
	refresh() {
		this.requeteService.requete(
			this.sanctionService.get(),
			sanctions => this.sanctions = sanctions
		);
	}

	/**
	 * Ouvre la fenêtre d'ajout de sanction
	 */
	ajouterSanction() {
		this.requeteService.requete(
			forkJoin(
				this.sportService.getSports(),
				this.sanctionService.getBareme(),
			),
			([sports, bareme]) => {
				const modal = this.modalService.open(SanctionCreationComponent, { centered: true, size: 'lg' });
				modal.componentInstance.sports = sports;
				modal.componentInstance.bareme = bareme;
				modal.result.then(this.refresh.bind(this));
			}
		);
	}
}
