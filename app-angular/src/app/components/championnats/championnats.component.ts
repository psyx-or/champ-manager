import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ChampionnatService } from '../../services/championnat.service';
import { Championnat } from '../../model/Championnat';
import { Sport } from '../../model/Sport';
import { sort, openModal } from '../../utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
		public modalService: NgbModal,
        private championnatService: ChampionnatService
    ) { }

	/**
	 * Initialisation du composant
	 */
    ngOnInit() {
		// TODO: filtre par défaut sur la saison en cours
        this.championnatService.getChampionnats().subscribe(championnats => {
			this.sports = [];
			sort(championnats, 'nom');
			this.championnats = championnats.reduce((map, champ) => {
				let sport = champ.sport.nom;
				if (!map.has(sport)) {this.sports.push(champ.sport); map.set(sport, [])};
				map.get(sport).push(champ);
				return map;
			}, new Map<string, Championnat[]>());
			sort(this.sports, 'nom');
		});
	}
	
	/**
	 * Suppression d'un championnat
	 * @param champ
	 */
	supprimer(champ: Championnat): void {
		openModal(
			this,
			"Nouvelles équipes détectées",
			this.supprChampTpl,
			champ,
			() => {
				this.championnatService.supprime(champ).subscribe(
					res => { this.ngOnInit() },
					err => alert("Erreur lors de la suppression")
				);
			}
		);
	}
}
