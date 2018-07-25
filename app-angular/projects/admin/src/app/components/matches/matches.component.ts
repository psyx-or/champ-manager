import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { MatchService } from '../../services/match.service';
import { sort } from 'projects/commun/src/app/utils/utils';
import { Journee } from 'projects/commun/src/app/model/Journee';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { menus } from '../../utils/menus';

class JourneeExt {
	public obj: Journee;
	public classe: string;
	public isCollapsed: boolean;
}

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

	menu = menus.championnat;
	champ: Championnat = null;
	journees: JourneeExt[];


	constructor(
		private route: ActivatedRoute,
		private requeteService: RequeteService,
		private matchService: MatchService
	) { }

	ngOnInit() {
		this.route.data
			.subscribe((data: { champ: Championnat }) => {
				this.champ = data.champ;
				this.journees = sort(data.champ.journees, 'numero').map(j => {

					let isCollapsed = true;
					let classe = 'success';
					j.matches.forEach(m => {
						if (m.exempt) return;
						
						if (m.valide !== true) isCollapsed = false;
						if (m.valide === false) classe = 'primary';
						if (m.valide === null && classe == 'success') classe = 'secondary';
					});

					return {
						obj: j,
						classe: classe,
						isCollapsed: isCollapsed
					}
				});
			}
		);
	}
}
