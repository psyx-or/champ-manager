import { Component, OnInit } from '@angular/core';
import { Sport } from '../../model/Sport';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { MatchService } from '../../services/match.service';
import { DoublonDTO } from '../../model/DoublonDTO';
import { Match } from '../../model/Match';

@Component({
  selector: 'app-calendrier-doublons',
  templateUrl: './calendrier-doublons.component.html',
  styleUrls: ['./calendrier-doublons.component.css']
})
export class CalendrierDoublonsComponent implements OnInit {

	sports: Sport[];
	selSport: Sport;
	doublons: DoublonDTO[];

	constructor(
		private route: ActivatedRoute,
		private requeteService: RequeteService,
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
		this.requeteService.requete(
			this.matchService.getDoublons(this.selSport),
			doublons => this.doublons = doublons
		);
	}

	/**
	 * Inverse un match
	 * @param match 
	 */
	inverse(match: Match): void {
		this.requeteService.requete(
			this.matchService.inverse(match),
			res => this.selectionSport()
		);
	}
}
