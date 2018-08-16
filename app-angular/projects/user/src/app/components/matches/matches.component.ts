import { Component, OnInit, Input } from '@angular/core';
import { Match } from '@commun/src/app/model/Match';
import { toDisp, jours } from '@commun/src/app/utils/utils';
import { Equipe } from '@commun/src/app/model/Equipe';
import * as moment from 'moment';

/**
 * On rajoute quelques attributs aux matches pour l'affichage
 */
class MatchExt extends Match {
	style1?: string;
	style2?: string;
	date?: string;
	terrain?: string;
}

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

	readonly PAS_DE_TERRAIN = "Pas de terrain";
	
	@Input() matches: Match[];
	@Input() equipe: Equipe;

	avecDates: boolean = false;
	matchesExt: MatchExt[];


	constructor(
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.matchesExt = this.matches.sort( (m1, m2) => this.equipe != null ? 0 :
			(((m1.exempt == null ) == (m2.exempt == null)) ? 0 : (m1.exempt ? 1 : -1))
		).map(toDisp);
		this.matchesExt.forEach( m => {
			m.style1 = this.calculeStyle(m, 1, 2);
			m.style2 = this.calculeStyle(m, 2, 1);
			this.calculeDate(m);
		});
	}

	/**
	 * Calcule le style associé à une équipe
	 * @param match 
	 * @param i 
	 * @param j 
	 */
	calculeStyle(match, i, j): string {
		let style = "";
		if (this.equipe != null) {
			if (match[`equipe${i}`] && match[`equipe${i}`].id == this.equipe.id)
				style = "font-weight-bold ";
			else
				return null;
		}

		if (match[`forfait${i}`])
			return style + "forfait";
		if (match[`forfait${j}`])
			return style + "text-success";

		if (match[`score${i}`] === null || match[`score${j}`] === null)
			return style;

		if (match[`score${i}`] > match[`score${j}`])
			return style + "text-success";
		if (match[`score${i}`] < match[`score${j}`])
			return style + "text-danger";

		return style;
	}

	/**
	 * Calcule la date et le lieu d'une rencontre
	 * @param match 
	 */
	calculeDate(match: MatchExt): void {
		if (match.dispScore1 !==null || match.exempt)
			return null;
		if (!match.journee || !match.journee.debut)
			return null;

		this.avecDates = true;

		if (!match.equipe1) {
			match.date = `Du ${moment(match.journee.debut).format("DD/MM/YYYY")} au ${moment(match.journee.fin).format("DD/MM/YYYY")}`;
			match.terrain = "A décider";
		}
		else if (!match.equipe1.terrain) {
			match.date = `Du ${moment(match.journee.debut).format("DD/MM/YYYY")} au ${moment(match.journee.fin).format("DD/MM/YYYY")}`;
			match.terrain = this.PAS_DE_TERRAIN;
		}
		else {
			match.date = match.equipe1.creneaux
				.map(c => `${jours[c.jour]} ${moment(match.journee.debut).add('day', c.jour).format("DD/MM/YYYY")} à ${moment(c.heure).format("HH:mm")}`)
				.join("\n");
			match.terrain = match.equipe1.terrain;
		}
	}
}
