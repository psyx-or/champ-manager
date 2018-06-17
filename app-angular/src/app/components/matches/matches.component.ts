import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { MatchService } from '../../services/match.service';
import { Championnat } from '../../model/Championnat';
import { Journee } from '../../model/Journee';
import { sort, fromDisp, toDisp } from '../../utils/utils';
import { Match } from '../../model/Match';

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

					let isCollapsed = true;
					let classe = 'success';
					j.matches.forEach(m => {
						toDisp(m);
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

	/**
	 * Validation d'un match unitaire
	 * @param match 
	 */
	valide(match: Match): void {
		this.requeteService.requete(
			this.matchService.valide(match),
			match2 => match.valide = match2.valide
		);
	}

	/**
	 * Lance la mise à jour des scores
	 * @param journee 
	 */
	submit(journee: Journee): void {
		journee.matches.forEach(fromDisp);
		this.requeteService.requete(
			this.matchService.maj(journee),
			matches => {
				matches.forEach(toDisp);
				journee.matches = matches;
			}
		);
	}

	/**
	 * Affiche une feuille de match
	 * @param match 
	 */
	afficheFeuille(match: Match): void {
		//TODO
		alert(match.feuille);
	}
}
