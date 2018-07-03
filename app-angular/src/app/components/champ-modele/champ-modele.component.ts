import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ChampModele } from '../../model/Championnat';
import { openModal } from '../../utils/utils';
import { ChampionnatService } from '../../services/championnat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequeteService } from '../../services/requete.service';

@Component({
  selector: 'app-champ-modele',
  templateUrl: './champ-modele.component.html',
  styleUrls: ['./champ-modele.component.css']
})
export class ChampModeleComponent implements OnInit {

	@ViewChild('supprModele') supprModeleTpl: TemplateRef<any>;

	selModele: ChampModele;
	modeles: ChampModele[];
	newModele: ChampModele = new ChampModele();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public modalService: NgbModal,
		public requeteService: RequeteService,
		private championnatService: ChampionnatService
	) { }

	ngOnInit() {
		this.route.data.subscribe((data: { modeles: ChampModele[] }) => {
			this.modeles = data.modeles;
			this.selModele = null;
			this.newModele = new ChampModele();
		});
	}

	/**
	 * Suppression d'un modele
	 * @param modele
	 */
	supprimer(modele: ChampModele): void {
		openModal(
			this,
			"Suppression de championnat",
			this.supprModeleTpl,
			modele,
			() => {
				this.requeteService.requete(
					this.championnatService.supprimeModele(modele),
					res => { this.router.navigate(["/champ-modele"]) }
				);
			}
		);
	}

	/**
	 * Mise à jour / création du modèle
	 */
	submit(): void {
		this.requeteService.requete(
			this.championnatService.majModele(this.selModele),
			res => { this.router.navigate(["/champ-modele"]) }
		);
	}
}
