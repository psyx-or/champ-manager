import { Component, OnInit } from '@angular/core';
import { Sport } from 'projects/commun/src/app/model/Sport';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from 'projects/commun/src/app/services/match.service';
import { DoublonDTO } from 'projects/commun/src/app/model/DoublonDTO';
import { Match } from 'projects/commun/src/app/model/Match';
import { menus } from '../../utils/menus';

@Component({
  selector: 'app-calendrier-doublons',
  templateUrl: './calendrier-doublons.component.html',
  styleUrls: ['./calendrier-doublons.component.css']
})
export class CalendrierDoublonsComponent implements OnInit {

	menu = menus.calendrier;
	sports: Sport[];
	selSport: Sport;
	doublons: DoublonDTO[];

	constructor(
		private route: ActivatedRoute,
		private matchService: MatchService
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { sports: Sport[] }) => {
				this.sports = data.sports;
			});
	}

	/**
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.matchService.getDoublons(this.selSport).subscribe(
			doublons => this.doublons = doublons
		);
	}

	/**
	 * Inverse un match
	 * @param match 
	 */
	inverse(match: Match): void {
		this.matchService.inverse(match).subscribe(
			() => this.selectionSport()
		);
	}
}
