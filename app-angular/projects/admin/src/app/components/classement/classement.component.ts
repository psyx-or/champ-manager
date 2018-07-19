import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ClassementService } from '../../services/classement.service';
import { ActivatedRoute } from '@angular/router';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Classement } from 'projects/commun/src/app/model/Classement';
import { sort, openModal } from 'projects/commun/src/app/utils/utils';
import { Equipe } from 'projects/commun/src/app/model/Equipe';
import { EquipeService } from 'projects/commun/src/app/services/equipe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChampionnatService } from '../../services/championnat.service';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit {

	@ViewChild('changeEquipe') changeEquipeTpl: TemplateRef<any>;
	
	champ: Championnat = null;
	classements: Classement[];
	remplacement: {
		oldEquipe: Equipe;
		newEquipe?: Equipe;
		equipes?: Equipe[];
	};

	/**
	 * Constructeur
	 * @param route 
	 * @param requeteService 
	 * @param classementService 
	 */
	constructor(
		public modalService: NgbModal,
		private route: ActivatedRoute,
		private requeteService: RequeteService,
		private equipeService: EquipeService,
		private classementService: ClassementService,
		private championnatService: ChampionnatService
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { champ: Championnat }) => {
				this.champ = data.champ;
				this.classements = sort(data.champ.classements, 'position');
			}
		);
	}

	/**
	 * Modification des points de pénalité
	 */
	submit() {
		this.requeteService.requete(
			this.classementService.maj(this.champ, this.classements),
			champ => {
				this.champ = champ;
				this.classements = sort(champ.classements, 'position');
			}
		);
	}

	/**
	 * Remplace une équipe par une autre
	 * @param equipe
	 */
	change(equipe: Equipe): void {
		this.remplacement = { oldEquipe: equipe };
		let equipesActuelles = this.classements.map(c => c.equipe.nom);

		this.requeteService.requete(
			this.equipeService.getEquipes(this.champ.sport),
			equipes => {
				this.remplacement.equipes = equipes.filter(e => equipesActuelles.indexOf(e.nom)==-1);
				if (this.remplacement.equipes.length == 0) {
					alert("Pas d'équipe pour remplacer");
				}
				else {
					openModal(
						this,
						"Remplacement d'équipe",
						this.changeEquipeTpl,
						equipe,
						this.changeAction
					);
				}
			}
		);
	}

	changeAction(): void {
		this.requeteService.requete(
			this.championnatService.remplace(this.champ, this.remplacement.oldEquipe, this.remplacement.newEquipe),
			classements => this.classements = classements
		)
	}
}
