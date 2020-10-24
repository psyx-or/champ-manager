import { Component, OnInit, Input } from '@angular/core';
import { Match } from '@commun/src/app/model/Match';
import { toDisp, jours, calculeStyle, STYLE_MEME_EQUIPE } from '@commun/src/app/utils/utils';
import { Equipe } from '@commun/src/app/model/Equipe';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FPFeuille } from '@commun/src/app/model/FPFeuille';
import { FairplayComponent } from '@commun/src/app/components/fairplay/fairplay.component';
import { ResultatSaisieComponent } from '../resultat-saisie/resultat-saisie.component';
import { Router } from '@angular/router';
import { AuthentService } from '../../services/authent.service';
import { Creneau } from '@commun/src/app/model/Creneau';
import { Championnat, ChampType } from '@commun/src/app/model/Championnat';

enum StatutMatch { VALIDE, AJOUER, RETARD, JOUE, JOUE_FP }

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
	readonly STYLE_MEME_EQUIPE = STYLE_MEME_EQUIPE;
	readonly Statuts = StatutMatch;
	
	@Input() matches: Match[];
	@Input() equipe: Equipe;
	@Input() championnat: Championnat;
	@Input() saisie: boolean = false;
	@Input() avecFP: boolean = false;
	@Input() dureeSaisie: number = 0;

	avecDates: boolean = false;
	matchesExt: MatchExt[];
	authentifie: boolean = false;


	constructor(
		private authentService: AuthentService,
		private router: Router,
		private modalService: NgbModal
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.authentService.getEquipe().subscribe(
			equipe => this.authentifie = (equipe != null)
		);
		this.matchesExt = this.matches.sort( (m1, m2) => this.equipe != null ? 0 :
			(((m1.exempt == null ) == (m2.exempt == null)) ? 0 : (m1.exempt ? 1 : -1))
		).map(toDisp);
		this.matchesExt.forEach( m => {
			m.style1 = calculeStyle(m, 1, this.equipe);
			m.style2 = calculeStyle(m, 2, this.equipe);
			this.calculeDate(m);
			if (this.saisie) this.calculeStatut(m);
		});
	}

	/**
	 * Calcule la date et le lieu d'une rencontre
	 * @param match 
	 */
	calculeDate(match: MatchExt): void {
		if (match.dispScore1 !== null || match.exempt)
			return;
		if (!match.journee || !match.journee.debut)
			return;

		this.avecDates = !this.saisie;

		if (match.dateReport) {
			const dateReport = moment(match.dateReport);
			const jour = dateReport.isoWeekday();
			
			const creneau = match.equipe1?.creneaux
				.find(c => c.jour == jour - 1);
			
			if (creneau != null)
				match.date = this.dateCreneau(creneau, dateReport);
			else
				match.date = `${jours[jour - 1]} ${moment(match.dateReport).format("DD/MM/YYYY")}`;

			match.terrain = match.equipe1?.terrain ? match.equipe1.terrain : this.PAS_DE_TERRAIN;
		}
		else if (!match.equipe1) {
			match.date = `Du ${moment(match.journee.debut).add(1, 'day').format("DD/MM/YYYY")} au ${moment(match.journee.fin).format("DD/MM/YYYY")}`;
		}
		else if (!match.equipe1.terrain) {
			match.date = `Du ${moment(match.journee.debut).add(1, 'day').format("DD/MM/YYYY")} au ${moment(match.journee.fin).format("DD/MM/YYYY")}`;
			match.terrain = this.PAS_DE_TERRAIN;
		}
		else {
			match.date = match.equipe1.creneaux
				.map(c => this.dateCreneau(c, moment(match.journee.debut).add(c.jour + 1, 'days')))
				.join("\n");
			match.terrain = match.equipe1.terrain;
		}
	}

	/**
	 * Renvoie la date d'un créneau pour une date
	 * @param c 
	 * @param date 
	 */
	private dateCreneau(c: Creneau, date: moment.Moment): string {
		return `${jours[c.jour]} ${date.format("DD/MM/YYYY")} à ${moment(c.heure).format("HH:mm")}`;
	}

	/**
	 * Calcule le statut du match par rapport à la saisie de résultat
	 * @param match 
	 */
	calculeStatut(match: MatchExt): void {
		if (!this.equipe || !match.equipe1 || !match.equipe2)
			return;

		let dateFin: moment.Moment = null;
		if (match.dateReport != null)
			dateFin = moment(match.dateReport).endOf('isoWeek');
		else if (match.journee.fin != null)
			dateFin = moment(match.journee.fin);

		if (match.valide) {
			match.statut = StatutMatch.VALIDE;
		}
		else if (dateFin != null && dateFin.add(this.dureeSaisie, 'days').isBefore(moment().startOf('day'))) {
			match.statut = StatutMatch.RETARD;
		}
		else if (match.valide === null) {
			match.statut = StatutMatch.AJOUER;
		}
		else {
			if (this.avecFP &&
				!match.forfait1 && !match.forfait2 && ( 
					this.equipe.id == match.equipe1.id && !match.hasFpFeuille1 ||
					this.equipe.id == match.equipe2.id && !match.hasFpFeuille2))
				match.statut = StatutMatch.JOUE;
			else
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

		let iEquipe = match.equipe1.id == this.equipe.id ? 1 : 2;
		const modal = this.modalService.open(FairplayComponent, { centered: true, backdrop: 'static', size: 'lg' });
		modal.componentInstance.match = match;
		modal.componentInstance.equipe = iEquipe;
		modal.result.then((res: FPFeuille) => {
			if (res) {
				match['hasFpFeuille' + iEquipe] = true;
				this.calculeStatut(match);
			}
			this.saisieResultat(match);
		}, () => {});
	}

	/**
	 * Lance la saisie du résultat
	 * @param match 
	 */
	saisieResultat(match: MatchExt): void {
		const modal = this.modalService.open(ResultatSaisieComponent, { centered: true, backdrop: 'static' });
		modal.componentInstance.match = match;
		modal.result.then(() => {
			const page = this.championnat?.type === ChampType.Coupe ? "coupes" : "classement";
			this.router.navigate(["equipe", page, this.equipe.id]);
		}, () => { });
	}
}
