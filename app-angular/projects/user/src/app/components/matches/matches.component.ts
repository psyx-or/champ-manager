import { Component, OnInit, Input } from '@angular/core';
import { Match } from '@commun/src/app/model/Match';
import { toDisp } from '@commun/src/app/utils/utils';

class MatchStyle {
	match: Match;
	style1: string;
	style2: string;
}

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
	
	@Input() matches: Match[];

	matchesStyles: MatchStyle[];


	constructor(
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.matchesStyles = this.matches.sort( (m1, m2) =>
			((m1.exempt == null ) == (m2.exempt == null)) ? 0 : (m1.exempt ? 1 : -1)
		).map( m => {
			return {
				match: toDisp(m),
				style1: this.calculeStyle(m, 1, 2),
				style2: this.calculeStyle(m, 2, 1)
			}
		});
	}

	/**
	 * Calcule le style associé à une équipe
	 * @param match 
	 * @param i 
	 * @param j 
	 */
	calculeStyle(match, i, j): string {
		if (match[`forfait${i}`])
			return "forfait";
		if (match[`forfait${j}`])
			return "text-success";

		if (match[`score${i}`] === null || match[`score${j}`] === null)
			return null;

		if (match[`score${i}`] > match[`score${j}`])
			return "text-success";
		if (match[`score${i}`] < match[`score${j}`])
			return "text-danger";

		return null;
	}
}
