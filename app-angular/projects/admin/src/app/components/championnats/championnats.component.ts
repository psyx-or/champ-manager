import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ChampionnatService } from '../../services/championnat.service';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Sport } from 'projects/commun/src/app/model/Sport';
import { sort, openModal } from 'projects/commun/src/app/utils/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ChampImportComponent } from '../champ-import/champ-import.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-championnats',
  templateUrl: './championnats.component.html',
  styleUrls: ['./championnats.component.css']
})
export class ChampionnatsComponent implements OnInit {

	@ViewChild('supprChamp') supprChampTpl: TemplateRef<any>;

	sports: Sport[];
	championnats: Map<string, Championnat[]>;


	/**
	 * Constructeur
	 * @param championnatService 
	 */
    constructor(
		private route: ActivatedRoute,
		private router: Router,
		public modalService: NgbModal,
		private requeteService: RequeteService,
        private championnatService: ChampionnatService
    ) { }

	/**
	 * Initialisation du composant
	 */
    ngOnInit() {
		this.route.data
			.subscribe((data: { championnats: Championnat[] }) => {
				this.sports = [];
				sort(data.championnats, 'nom');
				this.championnats = data.championnats.reduce((map, champ) => {
					let sport = champ.sport.nom;
					if (!map.has(sport)) { this.sports.push(champ.sport); map.set(sport, []) };
					map.get(sport).push(champ);
					return map;
				}, new Map<string, Championnat[]>());
				sort(this.sports, 'nom');
			});
	}

	/**
	 * Lance l'import des résultats
	 * @param champ 
	 */
	importer(champ: Championnat): void {
		const modal = this.modalService.open(ChampImportComponent, { centered: true });
		modal.componentInstance.championnat = champ;
	}
	
	/**
	 * Suppression d'un championnat
	 * @param champ
	 */
	supprimer(champ: Championnat): void {
		openModal(
			this,
			"Suppression de championnat",
			this.supprChampTpl,
			champ,
			() => {
				this.requeteService.requete(
					this.championnatService.supprime(champ),
					res => { this.router.navigate(["/championnats"]) }
				);
			}
		);
	}
}