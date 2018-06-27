import { Component, OnInit } from '@angular/core';
import { Sport } from '../../model/Sport';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { ChampionnatService } from '../../services/championnat.service';
import { CalendrierDTO } from '../../model/CalendrierDTO';

class SelCalendrier extends CalendrierDTO {
	selectionne?: boolean;
}

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css']
})
export class CalendrierComponent implements OnInit {
	sports: Sport[]; // TODO: composant de sélection de sport
	selSport: Sport;
	calendriers: SelCalendrier[];

	constructor(
		private route: ActivatedRoute,
		private requeteService: RequeteService,
		private championnatService: ChampionnatService
	) { }

	// TODO: revenir sur cet écran suite à validation du calendrier d'un championnat

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
			this.championnatService.getCalendrierCourant(this.selSport),
			calendriers => this.calendriers = calendriers
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
