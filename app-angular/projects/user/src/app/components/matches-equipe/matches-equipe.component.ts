import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Championnat } from '@commun/src/app/model/Championnat';
import { ActivatedRoute } from '@angular/router';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Match } from '@commun/src/app/model/Match';

class ChampionnatExt extends Championnat {
	matches: Match[];
}

@Component({
  selector: 'app-matches-equipe',
  templateUrl: './matches-equipe.component.html',
  styleUrls: ['./matches-equipe.component.css']
})
export class MatchesEquipeComponent implements OnInit {

	menu = menus.equipe;
	equipe: Equipe;
	championnats: ChampionnatExt[];

	constructor(
		private route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe, championnats: ChampionnatExt[] }) => {
				this.equipe = data.equipe;
				this.championnats = data.championnats;
				this.championnats.forEach(c => {
					c.matches = c.journees.map(j => j.matches[0]);
				});
			}
		);
	}
}
