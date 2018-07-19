import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sport } from '../../model/Sport';
import { RequeteService } from '../../services/requete.service';
import { MatchService } from '../../services/match.service';
import { Championnat } from '../../model/Championnat';

@Component({
  selector: 'app-match-avalider',
  templateUrl: './match-avalider.component.html',
  styleUrls: ['./match-avalider.component.css']
})
export class MatchAvaliderComponent implements OnInit {

	sports: Sport[];
	selSport: Sport;
	championnats: Championnat[];

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
			.subscribe((data: { sports: Sport[] }) => this.sports = data.sports);
	}

	/**
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.requeteService.requete(
			this.matchService.avalider(this.selSport),
			championnats => this.championnats = championnats
		);
	}
}
