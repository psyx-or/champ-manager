import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ClassementService } from 'projects/commun/src/app/services/classement.service';
import { ActivatedRoute } from '@angular/router';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Classement } from 'projects/commun/src/app/model/Classement';
import { sort, openModal } from 'projects/commun/src/app/utils/utils';
import { Equipe } from 'projects/commun/src/app/model/Equipe';
import { EquipeService } from 'projects/commun/src/app/services/equipe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChampionnatService } from 'projects/commun/src/app/services/championnat.service';
import { menus } from '../../utils/menus';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit {

	@ViewChild('changeEquipe', {static:true}) changeEquipeTpl: TemplateRef<any>;
	@ViewChild('supprEquipe', {static:true}) supprEquipeTpl: TemplateRef<any>;
	
	menu = menus.championnat;
	champ: Championnat = null;
	seuilsForfait: [Number, Number];
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
			.subscribe((data: { champ: Championnat, seuilsForfait: [Number, Number] }) => {
				this.champ = data.champ;
				this.seuilsForfait = data.seuilsForfait;
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

	/**
	 * Effectue le remplacement
	 */
	changeAction(): void {
		this.requeteService.requete(
			this.championnatService.remplace(this.champ, this.remplacement.oldEquipe, this.remplacement.newEquipe),
			classements => {
				if (classements) this.classements = classements; 
				else alert("Ajout impossible: pas d'équipe exempte");
			}
		)
	}

	/**
	 * Remplace l'équipe exempte par une autre
	 */
	changeExempt(): void {
		this.change({id: null, nom: "EXEMPT"});
	}

	/**
	 * Remplace une équipe par une équipe exempte
	 * @param equipe 
	 */
	retireEquipe(equipe: Equipe): void {
		openModal(
			this,
			"Suppression d'équipe",
			this.supprEquipeTpl,
			equipe,
			() => {
				this.requeteService.requete(
					this.championnatService.retire(this.champ, equipe),
					classements => this.classements = classements
				);
			}
		);
	}
}
