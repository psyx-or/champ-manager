import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatchService } from 'projects/commun/src/app/services/match.service';
import { fromDisp, openModal, toDisp } from 'projects/commun/src/app/utils/utils';
import { NgbDate, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
	
	@ViewChild('report', {static:true}) reportTpl: TemplateRef<any>;
	
	modal: NgbModalRef;
	dateReport: NgbDate;

	constructor(
		private matchService: MatchService,
		public modalService: NgbModal,
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

	/**
	 * Téléverse la feuille de match
	 * @param match 
	 * @param fichiers 
	 */
	upload(match: Match, fichiers: FileList): void {
		this.matchService.majMatchFeuille(match, fichiers.item(0)).subscribe(
			feuille => match.feuille = feuille
		);
	}

	/**
	 * Reporte un match
	 * @param match 
	 */
	reporter(match: Match): void {
		const date = match.dateReport ? new Date(match.dateReport) : new Date();
		this.dateReport = new NgbDate(date.getFullYear(), date.getMonth()+1, date.getDate());
		this.modal = openModal(
			this,
			`Report du match ${match.dispEquipe1} - ${match.dispEquipe2}`,
			this.reportTpl,
			match,
			() => {
				const newDate = new Date(this.dateReport.year, this.dateReport.month - 1, this.dateReport.day);
				this.matchService.reporte(match, newDate).subscribe(
					newMatch => match.dateReport = newMatch.dateReport
				);
			},
			null,
			true
		);
	}
}
