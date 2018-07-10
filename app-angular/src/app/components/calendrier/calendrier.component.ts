import { Component, OnInit } from '@angular/core';
import { Sport } from '../../model/Sport';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { ChampionnatService } from '../../services/championnat.service';
import { CalendrierDTO } from '../../model/CalendrierDTO';
import * as moment from 'moment';

class SelCalendrier extends CalendrierDTO {
	selectionne?: boolean;
}

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css']
})
export class CalendrierComponent implements OnInit {
	sports: Sport[];
	selSport: Sport;
	calendriers: SelCalendrier[];

	constructor(
		private route: ActivatedRoute,
		private requeteService: RequeteService,
		private championnatService: ChampionnatService
	) { }

	// TODO: Recherche des matches sur le même terrain

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { sports: Sport[] }) => {
				this.sports = data.sports;
				this.route.paramMap
					.subscribe(params => {
						this.selSport = this.sports.find(s => s.nom == params.get("sport"));
						if (this.selSport) this.selectionSport();
					})
			});
	}

	/**
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.requeteService.requete(
			this.championnatService.getCalendrierCourant(this.selSport),
			calendriers => {
				calendriers.forEach(c => {
					c.debutStr = c.debut && moment(c.debut).add('day', 1).format("DD/MM/YYYY")
					c.finStr = c.fin && moment(c.fin).format("DD/MM/YYYY")
				});
				this.calendriers = calendriers
			}
		);
	}

	/**
	 * (Dé)sélectionne tous les championnats
	 * @param val
	 */
	selectionneTous(val: boolean): void {
		console.log(val);
		this.calendriers
			.filter(c => c.nbJourneesDefinies == c.nbJournees)
			.forEach(c => c.selectionne = val);
	}

	/**
	 * Indique si au moins un championnat est sélectionné
	 */
	hasSelection(): boolean {
		return this.calendriers.some(c => c.selectionne);
	}

	/**
	 * Construit le lien pour générer le fichier du calendrier
	 */
	lienCalendrier(): string {
		return this.championnatService.lienCalendrier(
			this.selSport,
			this.calendriers.filter(c => c.selectionne).map(c => c.championnat));
	}
}
