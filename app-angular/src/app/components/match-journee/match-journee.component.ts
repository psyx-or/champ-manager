import { Component, Input, OnInit } from '@angular/core';
import { Journee } from '../../model/Journee';
import { Match } from '../../model/Match';
import { RequeteService } from '../../services/requete.service';
import { MatchService } from '../../services/match.service';
import { fromDisp, toDisp } from '../../utils/utils';

@Component({
  selector: 'app-match-journee',
  templateUrl: './match-journee.component.html',
  styleUrls: ['./match-journee.component.css']
})
export class MatchJourneeComponent implements OnInit {

	@Input() journee: Journee;

	constructor(
		private requeteService: RequeteService,
		private matchService: MatchService
	) { }

	ngOnInit() {
		this.journee.matches.forEach(toDisp);
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
