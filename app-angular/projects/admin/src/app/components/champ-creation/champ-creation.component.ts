import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Championnat, ChampModele } from 'projects/commun/src/app/model/Championnat';
import { ChampionnatService } from '../../services/championnat.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EquipeService } from 'projects/commun/src/app/services/equipe.service';
import { Equipe } from 'projects/commun/src/app/model/Equipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { openModal, getSaisonCourante } from 'projects/commun/src/app/utils/utils';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ChampCaracteristiquesComponent } from '../champ-caracteristiques/champ-caracteristiques.component';

@Component({
  selector: 'app-champ-creation',
  templateUrl: './champ-creation.component.html',
  styleUrls: ['./champ-creation.component.css']
})
export class ChampCreationComponent implements OnInit {

	@ViewChild('ajoutEquipes') ajoutEquipesTpl: TemplateRef<any>;
	@ViewChild('caractComp') caractComp: ChampCaracteristiquesComponent;

	championnat: Championnat;
	equipes = Array(24);
	itequipes = Array(this.equipes.length);
	equipesSport: Equipe[] = null;
	modeles: ChampModele[];
	selModele: ChampModele = null;


	/**
	 * Constructeur
	 * @param sportsService 
	 * @param championnatService 
	 */
    constructor(
		private route: ActivatedRoute,
		public modalService: NgbModal,
		public requeteService: RequeteService,
        private championnatService: ChampionnatService,
		private equipeService: EquipeService,
		private router: Router
    ) { }

	/**
	 * Initialisation
	 */
    ngOnInit() {
        // Construction de l'objet
        this.championnat = new Championnat({
			saison: getSaisonCourante()
		});
		
		// Récupération des données
		this.route.data.subscribe((data: { modeles: ChampModele[] }) => {
			this.modeles = data.modeles;
		});
	}
	
	/**
	 * Vérifie les paramètres de création
	 */
	submit(): void {

		// Est-ce que les équipes sont des équipes?
		this.ajusteEquipes();
		let newEquipes = this.equipes.filter((e: Equipe) => e && e.id == null);
		if (newEquipes.length > 0) {
			// Si non, affichage de la pop-up de connexion pour récupérer les identifiants et recommencer
			openModal(
				this,
				"Nouvelles équipes détectées",
				this.ajoutEquipesTpl,
				newEquipes,
				this.creation
			);
		}
		else {
			this.creation();
		}
	}

	/**
	 * Lancement de la création du championnat
	 */
	creation(): void {
		this.requeteService.requete(
			this.championnatService.cree(this.championnat, this.equipes.filter(e=>e)),
			champ => {
				this.router.navigate(['journees', champ.id])
			}
		);
	}

	/**
	 * Convertit les équipes qui n'ont pas été sélectionnées avec l'autocomplétion
	 */
	ajusteEquipes(): void {
		for (let i = 0; i < this.equipes.length; i++) {
			var nom = this.equipes[i];
			if (nom && typeof(nom) == "string") {
				// Est-ce que l'équipe existe déjà?
				let eq = this.equipesSport.find(e => e.nom == nom.trim());
				if (eq) this.equipes[i] = eq;
				else this.equipes[i] = new Equipe({nom: nom.trim()});
			}
		}
	}

	/**
	 * Autocomplétion sur les équipes
	 */
	searchEquipe = (texte$: Observable<string>) =>
		texte$.pipe(
			map(term => this.equipesSport
				.filter(e => e.nom.trim().toLowerCase().indexOf(term.toLowerCase()) > -1)
				.filter(e => !this.equipes.includes(e))
			)
		);

	/**
	 * Convertisseur d'affichage pour l'autocomplétion sur les équipes
	 */
	searchEquipeFormatter = (equipe: Equipe) => equipe.nom;

	/**
	 * Sélection d'un sport (rechargement des équipes existantes)
	 */
	selectionSport($sport): void {
		if ($sport == null) {
			this.equipesSport = [];
		}
		else {
			this.equipesSport = null;
			this.requeteService.requete(
				this.equipeService.getEquipes($sport),
				equipes => this.equipesSport = equipes
			);
		}
	}

	/**
	 * @returns Nombre d'équipe actuellement associées au championnat
	 */
	getNbEquipes(): number {
		return this.equipes.filter(e => e).length;
	}

	/**
	 * Sélection d'un modèle
	 * @param modele 
	 */
	selectionModele(modele: ChampModele): void {
		this.caractComp.avecNuls = (modele.ptnul != null);
		this.championnat.sport = modele.sport;
		this.championnat.nom = modele.nom;
		this.championnat.type = modele.type;
		this.championnat.ptvict = modele.ptvict;
		this.championnat.ptnul = modele.ptnul;
		this.championnat.ptdef = modele.ptdef;
		this.championnat.fpForm = modele.fpForm;
		this.selectionSport(modele.sport);
	}
}
