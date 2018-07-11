import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { FairplayService } from '../../services/fairplay.service';
import { Sport } from '../../model/Sport';
import { FPClassement } from '../../model/FPClassement';

@Component({
  selector: 'app-fairplay-classement',
  templateUrl: './fairplay-classement.component.html',
  styleUrls: ['./fairplay-classement.component.css']
})
export class FairplayClassementComponent implements OnInit {

	sports: Sport[];
	selSport: Sport;
	classements: FPClassement[];

	constructor(
		private route: ActivatedRoute,
		public requeteService: RequeteService,
		private fairplayService: FairplayService,
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
	selectionSport(sport: Sport): void {
		this.requeteService.requete(
			this.fairplayService.getClassement(sport),
			classements => this.classements = classements
		);
	}
}
