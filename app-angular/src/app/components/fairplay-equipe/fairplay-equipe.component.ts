import { Component, OnInit } from '@angular/core';
import { Equipe } from '../../model/Equipe';
import { ActivatedRoute } from '@angular/router';
import { FPFeuille } from '../../model/FPFeuille';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FairplayComponent } from '../fairplay/fairplay.component';

@Component({
  selector: 'app-fairplay-equipe',
  templateUrl: './fairplay-equipe.component.html',
  styleUrls: ['./fairplay-equipe.component.css']
})
export class FairplayEquipeComponent implements OnInit {

	equipe: Equipe;
	feuilles: FPFeuille[];
	attrAffiche: string;

	constructor(
		private route: ActivatedRoute,
		private modalService: NgbModal
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			if (params.get("type") == "evaluation") this.attrAffiche = "equipeRedactrice";
			if (params.get("type") == "redaction") this.attrAffiche = "equipeEvaluee";
		});
		this.route.data
			.subscribe((data: { equipe: Equipe, feuilles: FPFeuille[] }) => {
				this.equipe = data.equipe;
				this.feuilles = data.feuilles;
			});
	}

	/**
	 * Affiche une feuille de fair-play et récupère l'éventuel nouveau ratio
	 * @param feuille
	 * @param i 
	 */
	fairplay(feuille: FPFeuille, i: number): void {
		const modal = this.modalService.open(FairplayComponent, { centered: true, backdrop: 'static', size: 'lg' });
		modal.componentInstance.feuille = feuille;
		modal.result.then((res: FPFeuille) => this.feuilles[i].ratio = res.ratio);
	}
}
