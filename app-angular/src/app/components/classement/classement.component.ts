import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RequeteService } from '../../services/requete.service';
import { ClassementService } from '../../services/classement.service';
import { ActivatedRoute } from '@angular/router';
import { Championnat } from '../../model/Championnat';
import { Classement } from '../../model/Classement';
import { sort, openModal } from '../../utils/utils';
import { Equipe } from '../../model/Equipe';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EquipeService } from '../../services/equipe.service';
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
		const champId = +this.route.snapshot.paramMap.get('champId');

		this.requeteService.requete(
			this.classementService.get(champId),
			champ => {
				this.champ = champ;
				this.classements = sort(champ.classements, 'position');
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
			this.equipeService.getEquipes(this.champ.sport.nom),
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
