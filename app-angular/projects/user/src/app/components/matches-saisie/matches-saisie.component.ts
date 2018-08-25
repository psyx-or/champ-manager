import { Component, OnInit } from '@angular/core';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Championnat } from '@commun/src/app/model/Championnat';
import { ActivatedRoute } from '@angular/router';
import { Match } from '@commun/src/app/model/Match';
import { menus } from '../../utils/menus';

class ChampionnatExt extends Championnat {
	matches: Match[];
}

@Component({
  selector: 'app-matches-saisie',
  templateUrl: './matches-saisie.component.html',
  styleUrls: ['./matches-saisie.component.css']
})
export class MatchesSaisieComponent implements OnInit {

	menu = menus.equipeConnectee;
	equipe: Equipe;
	championnats: ChampionnatExt[];
	fpDuree: number;

	constructor(
		private route: ActivatedRoute,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe, championnats: ChampionnatExt[], fpDuree: number }) => {
				this.equipe = data.equipe;
				this.championnats = data.championnats;
				this.fpDuree = data.fpDuree;
				this.championnats.forEach(c => {
					c.matches = c.journees.map(j => { j.matches[0].journee = j; return j.matches[0]; });
				});
			}
		);
	}
}
