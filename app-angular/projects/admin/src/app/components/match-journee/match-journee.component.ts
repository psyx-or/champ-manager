import { Component, Input, OnInit } from '@angular/core';
import { MatchService } from 'projects/commun/src/app/services/match.service';
import { fromDisp, toDisp } from 'projects/commun/src/app/utils/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Journee } from 'projects/commun/src/app/model/Journee';
import { FPForm } from 'projects/commun/src/app/model/FPForm';
import { Match } from 'projects/commun/src/app/model/Match';
import { FPFeuille } from 'projects/commun/src/app/model/FPFeuille';
import { FairplayComponent } from '@commun/src/app/components/fairplay/fairplay.component';

@Component({
  selector: 'app-match-journee',
  templateUrl: './match-journee.component.html',
  styleUrls: ['./match-journee.component.css']
})
export class MatchJourneeComponent implements OnInit {

	@Input() journee: Journee;
	@Input() fpForm: FPForm;

	constructor(
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
		this.matchService.valide(match).subscribe(
			match2 => match.valide = match2.valide
		);
	}

	/**
	 * Lance la mise à jour des scores
	 * @param journee 
	 */
	submit(journee: Journee): void {
		journee.matches.forEach(fromDisp);
		this.matchService.maj(journee).subscribe(
			matches => {
				matches.forEach(toDisp);
				journee.matches = matches;
			}
		);
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
		modal.result.then((res: FPFeuille) => match['fpFeuille'+equipe] = res, () => {});
	}
}
