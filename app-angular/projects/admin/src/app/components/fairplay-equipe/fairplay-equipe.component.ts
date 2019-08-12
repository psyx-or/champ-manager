import { Component, OnInit } from '@angular/core';
import { Equipe } from 'projects/commun/src/app/model/Equipe';
import { ActivatedRoute } from '@angular/router';
import { FPFeuille } from 'projects/commun/src/app/model/FPFeuille';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { menus } from '../../utils/menus';
import { FairplayComponent } from '@commun/src/app/components/fairplay/fairplay.component';
import { Championnat } from '@commun/src/app/model/Championnat';

@Component({
  selector: 'app-fairplay-equipe',
  templateUrl: './fairplay-equipe.component.html',
  styleUrls: ['./fairplay-equipe.component.css']
})
export class FairplayEquipeComponent implements OnInit {

	menu = menus.equipe;
	equipe: Equipe;
	championnats: Championnat[];
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
			.subscribe((data: { equipe: Equipe, championnats: Championnat[] }) => {
				this.equipe = data.equipe;
				this.championnats = data.championnats;
			});
	}

	/**
	 * Affiche une feuille de fair-play et récupère l'éventuel nouveau ratio
	 * @param feuille
	 * @param championnat
	 * @param i 
	 */
	fairplay(feuille: FPFeuille, championnat: Championnat, i: number): void {
		const modal = this.modalService.open(FairplayComponent, { centered: true, backdrop: 'static', size: 'lg' });
		modal.componentInstance.feuille = feuille;
		modal.result.then((res: FPFeuille) => championnat.fpFeuilles[i].ratio = res.ratio, () => {});
	}
}
