import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ClassementService } from 'projects/commun/src/app/services/classement.service';
import { ActivatedRoute } from '@angular/router';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Classement } from 'projects/commun/src/app/model/Classement';
import { sort, openModal } from 'projects/commun/src/app/utils/utils';
import { Equipe } from 'projects/commun/src/app/model/Equipe';
import { EquipeService } from 'projects/commun/src/app/services/equipe.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChampionnatService } from 'projects/commun/src/app/services/championnat.service';
import { menus } from '../../utils/menus';
import { AuthentService } from '../../services/authent.service';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit {

	@ViewChild('changeEquipe', {static:true}) changeEquipeTpl: TemplateRef<any>;
	@ViewChild('supprEquipe', {static:true}) supprEquipeTpl: TemplateRef<any>;
	@ViewChild('forfaitEquipe', {static:true}) forfaitEquipeTpl: TemplateRef<any>;
	
	menu = menus.championnat;
	champ: Championnat = null;
	seuilsForfait: [Number, Number];
	classements: Classement[];
	modal: NgbModalRef;
	remplacement: {
		oldEquipe: Equipe;
		newEquipe?: Equipe;
		equipes?: Equipe[];
	};
	forfait = {	score: <number>null };
	isAdmin: boolean = false;

	/**
	 * Constructeur
	 */
	constructor(
		public modalService: NgbModal,
		private route: ActivatedRoute,
		private equipeService: EquipeService,
		private classementService: ClassementService,
		private championnatService: ChampionnatService,
		private authentService: AuthentService,
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
		this.authentService.getUser().subscribe(user => this.isAdmin = user.isAdmin);
	}

	/**
	 * Modification des points de pénalité
	 */
	submit() {
		this.classementService.maj(this.champ, this.classements).subscribe(
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

		this.equipeService.getEquipes(this.champ.sport).subscribe(
			equipes => {
				this.remplacement.equipes = equipes.filter(e => equipesActuelles.indexOf(e.nom)==-1);
				if (this.remplacement.equipes.length == 0) {
					alert("Pas d'équipe pour remplacer");
				}
				else {
					this.modal = openModal(
						this,
						"Remplacement d'équipe",
						this.changeEquipeTpl,
						equipe,
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
		this.championnatService.remplace(this.champ, this.remplacement.oldEquipe, this.remplacement.newEquipe).subscribe(
			classements => {
				if (classements) this.classements = sort(classements, 'position');
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
				this.championnatService.retire(this.champ, equipe).subscribe(
					classements => this.classements = sort(classements, 'position')
				);
			}
		);
	}

	/**
	 * Forfait général pour une équipe
	 * @param equipe
	 */
	forfaitGeneral(equipe: Equipe): void {
		this.modal = openModal(
			this,
			`Forfait général pour ${equipe.nom}`,
			this.forfaitEquipeTpl,
			equipe,
			() => {
				this.championnatService.forfaitGeneral(this.champ, equipe, this.forfait.score).subscribe(
					classements => this.classements = sort(classements, 'position')
				);
			},
			null,
			true
		);
	}
}
