import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from 'projects/commun/src/app/services/match.service';
import { Sport } from 'projects/commun/src/app/model/Sport';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { User, AuthentService } from '../../services/authent.service';

@Component({
  selector: 'app-match-avalider',
  templateUrl: './match-avalider.component.html',
  styleUrls: ['./match-avalider.component.css']
})
export class MatchAvaliderComponent implements OnInit {

	user: User = null;
	sports: Sport[];
	selSport: Sport;
	championnats: Championnat[];

	constructor(
		private route: ActivatedRoute,
		private authentService: AuthentService,
		private matchService: MatchService
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { sports: Sport[] }) => this.sports = data.sports);
		this.authentService.getUser().subscribe(user => {
			this.user = user;
			this.championnats = null;
			this.selSport = null;
			if (user.isAdmin === false)
				this.selectionSport();
		});
	}

	/**
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.matchService.avalider(this.selSport).subscribe(
			championnats => this.championnats = championnats
		);
	}
}
