import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Championnat } from '@commun/src/app/model/Championnat';
import { Journee } from '@commun/src/app/model/Journee';
import { sort } from '@commun/src/app/utils/utils';
import { menus } from '../../utils/menus';

@Component({
  selector: 'app-matches-championnat',
  templateUrl: './matches-championnat.component.html',
  styleUrls: ['./matches-championnat.component.css']
})
export class MatchesChampionnatComponent implements OnInit {

	menu = menus.championnat;
	champ: Championnat = null;
	journees: Journee[];

	constructor(
		private route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.route.data
			.subscribe((data: { champ: Championnat }) => {
				this.champ = data.champ;
				this.journees = sort(data.champ.journees, 'numero');
			}
		);
	}
}
