import { Component, Input, OnInit } from '@angular/core';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { MatchService } from '../../services/match.service';
import { fromDisp, toDisp } from 'projects/commun/src/app/utils/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FairplayComponent } from '../fairplay/fairplay.component';
import { Journee } from 'projects/commun/src/app/model/Journee';
import { FPForm } from 'projects/commun/src/app/model/FPForm';
import { Match } from 'projects/commun/src/app/model/Match';
import { FPFeuille } from 'projects/commun/src/app/model/FPFeuille';

@Component({
  selector: 'app-match-journee',
  templateUrl: './match-journee.component.html',
  styleUrls: ['./match-journee.component.css']
})
export class MatchJourneeComponent implements OnInit {

	@Input() journee: Journee;
	@Input() fpForm: FPForm;

	constructor(
		public requeteService: RequeteService,
		private matchService: MatchService,
		private modalService: NgbModal
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
		//TODO affichage feuille de match
		alert(match.feuille);
	}

	/**
	 * Affiche une feuille de fair-play et récupère l'éventuel nouveau ratio
	 * @param match 
	 * @param equipe 
	 */
	fairplay(match: Match, equipe: 1|2): void {
		const modal = this.modalService.open(FairplayComponent, { centered: true, backdrop: 'static', size: 'lg' });
		modal.componentInstance.match = match;
		modal.componentInstance.equipe = equipe;
		modal.result.then((res: FPFeuille) => match['fpFeuille'+equipe] = res);
	}
}