import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ChampionnatService } from 'projects/commun/src/app/services/championnat.service';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Sport } from 'projects/commun/src/app/model/Sport';
import { sort, openModal, getSaisonCourante, getSaison } from 'projects/commun/src/app/utils/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ChampImportComponent } from '../champ-import/champ-import.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-championnats',
  templateUrl: './championnats.component.html',
  styleUrls: ['./championnats.component.css']
})
export class ChampionnatsComponent implements OnInit {

	@ViewChild('supprChamp') supprChampTpl: TemplateRef<any>;

	saisons: string[] = [];
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
		this.saisons.push(getSaisonCourante());
		this.saisons.push(getSaison(moment().subtract(1, "year").toDate()));

		this.route.data
			.subscribe((data: { championnats: Championnat[] }) => {
				this.initChamps(data.championnats);
			});
	}

	/**
	 * Initialise la liste des championnats
	 * @param champs 
	 */
	private initChamps(championnats: Championnat[]) {
		this.sports = [];
		sort(championnats, 'nom');
		this.championnats = championnats.reduce((map, champ) => {
			let sport = champ.sport.nom;
			if (!map.has(sport)) { this.sports.push(champ.sport); map.set(sport, []) };
			map.get(sport).push(champ);
			return map;
		}, new Map<string, Championnat[]>());
		sort(this.sports, 'nom');
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

	/**
	 * Affiche les championnats de la saison demandée
	 * @param saison
	 */
	changeSaison(saison: string) {
		this.requeteService.requete(
			this.championnatService.getChampionnats(saison),
			championnats => this.initChamps(championnats)
		);
	}
}
