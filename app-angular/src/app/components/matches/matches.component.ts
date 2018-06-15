import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { MatchService } from '../../services/match.service';
import { Championnat } from '../../model/Championnat';
import { Journee } from '../../model/Journee';
import { sort } from '../../utils/utils';

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

	champ: Championnat = null;
	journees: JourneeExt[];


	constructor(
		private route: ActivatedRoute,
		private requeteService: RequeteService,
		private matchService: MatchService
	) { }

	ngOnInit() {
		const champId = +this.route.snapshot.paramMap.get('champId');

		this.requeteService.requete(
			this.matchService.liste(champId),
			champ => {
				this.champ = champ;
				this.journees = sort(champ.journees, 'numero').map(j => {
					return {
						obj: j,
						classe: 'primary',
						isCollapsed: (j.numero%2)==0
					}
				});
			}
		);
	}
}
