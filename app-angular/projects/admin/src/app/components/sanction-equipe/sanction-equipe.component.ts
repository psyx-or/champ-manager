import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Sanction } from '@commun/src/app/model/Sanction';
import { menus } from '../../utils/menus';
import { RequeteService } from '@commun/src/app/services/requete.service';
import { SanctionService } from '@commun/src/app/services/sanction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SanctionCreationComponent } from '../sanction-creation/sanction-creation.component';
import { User, AuthentService } from '../../services/authent.service';

@Component({
  selector: 'app-sanction-equipe',
  templateUrl: './sanction-equipe.component.html',
  styleUrls: ['./sanction-equipe.component.css']
})
export class SanctionEquipeComponent implements OnInit {

	menu = menus.equipe;
	equipe: Equipe;
	sanctions: Sanction[];
	user: User = null;

	constructor(
		private route: ActivatedRoute,
		private modalService: NgbModal,
		public requeteService: RequeteService,
		private authentService: AuthentService,
		private sanctionService: SanctionService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		// Récupération des données
		this.route.data.subscribe((data: { equipe: Equipe, sanctions: Sanction[] }) => {
			this.equipe = data.equipe;
			this.sanctions = data.sanctions;
		});
		this.authentService.getUser().subscribe(user => this.user = user);
	}

	/**
	 * Ouvre la fenêtre d'ajout de sanction
	 */
	ajouterSanction() {
		this.requeteService.requete(
			this.sanctionService.getBareme(),
			bareme => {
				const modal = this.modalService.open(SanctionCreationComponent, { centered: true, size: 'lg' });
				modal.componentInstance.equipe = this.equipe;
				modal.componentInstance.bareme = bareme;
				modal.result.then(() => {
					this.requeteService.requete(
						this.sanctionService.getEquipe(this.equipe.id),
						sanctions => this.sanctions = sanctions
					);
				});
			}
		);
	}
}
