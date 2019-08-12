import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { FairplayService } from 'projects/commun/src/app/services/fairplay.service';
import { FPClassement, FPResultat } from 'projects/commun/src/app/model/FPClassement';
import { Championnat } from '@commun/src/app/model/Championnat';
import { menus } from '../../utils/menus';

@Component({
  selector: 'app-fairplay-classement',
  templateUrl: './fairplay-classement.component.html',
  styleUrls: ['./fairplay-classement.component.css']
})
export class FairplayClassementComponent implements OnInit {

	menu = menus.championnat;
	champ: Championnat;
	classements: FPClassement[];

	constructor(
		private route: ActivatedRoute,
		public router: Router,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { classement: FPResultat }) => {
				this.champ = data.classement.champ;
				this.classements = data.classement.fpClassements;
			});
	}
}
