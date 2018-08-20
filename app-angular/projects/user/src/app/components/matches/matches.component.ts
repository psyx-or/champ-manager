import { Component, OnInit, Input } from '@angular/core';
import { Match } from '@commun/src/app/model/Match';
import { toDisp, jours } from '@commun/src/app/utils/utils';
import { Equipe } from '@commun/src/app/model/Equipe';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FPFeuille } from '@commun/src/app/model/FPFeuille';
import { FairplayComponent } from '@commun/src/app/components/fairplay/fairplay.component';

enum StatutMatch { VALIDE, AJOUER, JOUE, JOUE_FP }

/**
 * On rajoute quelques attributs aux matches pour l'affichage
 */
class MatchExt extends Match {
	style1?: string;
	style2?: string;
	date?: string;
	terrain?: string;
	statut?: StatutMatch;
}

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

	readonly PAS_DE_TERRAIN = "Pas de terrain";
	readonly STYLE_MEME_EQUIPE = "font-weight-bold";
	readonly Statuts = StatutMatch;
	
	@Input() matches: Match[];
	@Input() equipe: Equipe;
	@Input() saisie: boolean = false;
	@Input() avecFP: boolean = false;

	avecDates: boolean = false;
	matchesExt: MatchExt[];


	constructor(
		private modalService: NgbModal
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
			if (this.saisie) this.calculeStatut(m);
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
				style = this.STYLE_MEME_EQUIPE + " ";
			else if (match[`forfait${i}`])
				return "forfait text-dark";
			else
				return "text-dark";
		}

		if (match[`forfait${i}`])
			return style + "forfait text-dark";
		if (match[`forfait${j}`])
			return style + "text-success";

		if (match[`score${i}`] === null || match[`score${j}`] === null)
			return style + "text-dark";

		if (match[`score${i}`] > match[`score${j}`])
			return style + "text-success";
		if (match[`score${i}`] < match[`score${j}`])
			return style + "text-danger";

		return style + "text-dark";
	}

	/**
	 * Calcule la date et le lieu d'une rencontre
	 * @param match 
	 */
	calculeDate(match: MatchExt): void {
		if (match.dispScore1 !==null || match.exempt)
			return;
		if (!match.journee || !match.journee.debut)
			return;

		this.avecDates = !this.saisie;

		if (!match.equipe1) {
			match.date = `Du ${moment(match.journee.debut).add(1, 'day').format("DD/MM/YYYY")} au ${moment(match.journee.fin).format("DD/MM/YYYY")}`;
		}
		else if (!match.equipe1.terrain) {
			match.date = `Du ${moment(match.journee.debut).add(1, 'day').format("DD/MM/YYYY")} au ${moment(match.journee.fin).format("DD/MM/YYYY")}`;
			match.terrain = this.PAS_DE_TERRAIN;
		}
		else {
			match.date = match.equipe1.creneaux
				.map(c => `${jours[c.jour]} ${moment(match.journee.debut).add(c.jour + 1, 'days').format("DD/MM/YYYY")} à ${moment(c.heure).format("HH:mm")}`)
				.join("\n");
			match.terrain = match.equipe1.terrain;
		}
	}

	/**
	 * Calcule le statut du match par rapport à la saisie de résultat
	 * @param match 
	 */
	calculeStatut(match: MatchExt): void {
		if (!this.equipe || !match.equipe1 || !match.equipe2)
			return;

		//TODO: feuille de match

		if (match.valide) {
			match.statut = StatutMatch.VALIDE;
		}
		else if (match.score1 == null && match.score2 == null && !match.forfait1 && !match.forfait2) {
			match.statut = StatutMatch.AJOUER;
		}
		else if (this.avecFP) {
			if (this.equipe.id == match.equipe1.id && !match.hasFpFeuille1 ||
				this.equipe.id == match.equipe2.id && !match.hasFpFeuille2)
				match.statut = StatutMatch.JOUE;
			else
				match.statut = StatutMatch.JOUE_FP;
		}
		else {
			match.statut = StatutMatch.JOUE_FP;
		}
	}

	/**
	 * Lance la saisie du fair-play si nécessaire
	 * @param match 
	 */
	saisieFairPlay(match: MatchExt): void {
		if (!this.avecFP)
			return this.saisieResultat(match);

		let iEquipe = match.equipe1.id ? 1 : 2;
		const modal = this.modalService.open(FairplayComponent, { centered: true, backdrop: 'static', size: 'lg' });
		modal.componentInstance.match = match;
		modal.componentInstance.equipe = this.equipe.id == iEquipe;
		modal.result.then((res: FPFeuille) => {
			match['hasFpFeuille' + iEquipe] = true;
			this.calculeStatut(match);
			this.saisieResultat(match);
		}, () => {});
	}

	/**
	 * Lance la saisie du résultat
	 * @param match 
	 */
	saisieResultat(match: MatchExt): void {
		//TODO
	}
}
