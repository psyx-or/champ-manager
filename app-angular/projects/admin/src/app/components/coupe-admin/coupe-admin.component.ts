import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { menus } from '../../utils/menus';
import { ActivatedRoute } from '@angular/router';
import { Journee } from '@commun/src/app/model/Journee';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Match } from '@commun/src/app/model/Match';
import { sort, openModal } from '@commun/src/app/utils/utils';
import { EquipeService } from '@commun/src/app/services/equipe.service';
import { ChampionnatService } from '@commun/src/app/services/championnat.service';
import { MatchService } from '@commun/src/app/services/match.service';

@Component({
  selector: 'app-coupe-admin',
  templateUrl: './coupe-admin.component.html',
  styleUrls: ['./coupe-admin.component.css']
})
export class CoupeAdminComponent implements OnInit {

	@ViewChild('changeEquipe', { static: true }) changeEquipeTpl: TemplateRef<any>;

	menu = menus.championnat;
	journee: Journee;
	modal: NgbModalRef;
	equipesActuelles = <Equipe[]>[];
	remplacement: {
		oldEquipe?: Equipe;
		newEquipe?: Equipe;
		equipes: Equipe[];
	};

	constructor(
		public modalService: NgbModal,
		private route: ActivatedRoute,
		private equipeService: EquipeService,
		private championnatService: ChampionnatService,
		private matchService: MatchService,
	) { }


	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data.subscribe(
			(data: { journee: Journee }) => {
				this.journee = data.journee;
				this.journee.matches.forEach(this.addEquipes.bind(this));
				sort(this.equipesActuelles, 'nom');
			}
		);
	}

	/**
	 * Construit récursivement la liste des équipes présentes dans la coupe
	 * @param m 
	 */
	private addEquipes(m: Match) {
		if (m.match1 != null)
			this.addEquipes(m.match1);
		else if (m.equipe1 != null)
			this.equipesActuelles.push(m.equipe1);

		if (m.match2 != null)
			this.addEquipes(m.match2);
		else if (m.equipe2 != null)
			this.equipesActuelles.push(m.equipe2);
	}

	/**
	 * Remplace une équipe par une autre
	 */
	change(): void {

		this.equipeService.getEquipes(this.journee.championnat.sport).subscribe(
			equipes => {
				this.remplacement = { 
					equipes: equipes.filter(e => !this.equipesActuelles.find(ea => ea.id == e.id)) 
				};

				if (this.remplacement.equipes.length == 0) {
					alert("Pas d'équipe pour remplacer");
				}
				else {
					this.modal = openModal(
						this,
						"Remplacement d'équipe",
						this.changeEquipeTpl,
						null,
						this.changeAction,
						null,
						true
					);
				}
			}
		);
	}

	/**
	 * Effectue le remplacement
	 */
	changeAction(): void {
		this.championnatService.remplace(this.journee.championnat, this.remplacement.oldEquipe, this.remplacement.newEquipe).subscribe(
			() => {
				this.matchService.getHierarchie(this.journee.championnat.id).subscribe(
					journee => this.journee = journee
				)
			}
		)
	}
}
