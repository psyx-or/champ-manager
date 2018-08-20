import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { FairplayService } from 'projects/commun/src/app/services/fairplay.service';
import { Sport } from 'projects/commun/src/app/model/Sport';
import { FPClassement } from 'projects/commun/src/app/model/FPClassement';

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
		public router: Router,
		public requeteService: RequeteService,
		private fairplayService: FairplayService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { sports: Sport[] }) => {
				this.sports = data.sports;
				let lastClass = this.fairplayService.getLastClassement();
				if (lastClass) {
					this.selSport = data.sports.find(s => s.nom == lastClass.sport.nom);
					this.classements = lastClass.class;
				}
			});
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
