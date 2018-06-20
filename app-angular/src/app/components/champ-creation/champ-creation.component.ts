import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Championnat, ChampType } from '../../model/Championnat';
import { Sport } from '../../model/Sport';
import { ChampionnatService } from '../../services/championnat.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EquipeService } from '../../services/equipe.service';
import { Equipe } from '../../model/Equipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { openModal } from '../../utils/utils';
import { RequeteService } from '../../services/requete.service';

@Component({
  selector: 'app-champ-creation',
  templateUrl: './champ-creation.component.html',
  styleUrls: ['./champ-creation.component.css']
})
export class ChampCreationComponent implements OnInit {

	@ViewChild('ajoutEquipes') ajoutEquipesTpl: TemplateRef<any>;

    sports: Sport[];
    types: [string,string][];
    newSport: Sport = new Sport();
	championnat: Championnat;
	equipes = Array(24);
	itequipes = Array(this.equipes.length);
	avecNuls: boolean = true;
	equipesSport: Equipe[] = null;


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
        // Récupération des données
        this.types = Object.entries(ChampType);
		this.route.data
			.subscribe((data: { sports: Sport[] }) => this.sports = data.sports);

        // Construction de l'objet
        let date = new Date();
        this.championnat = new Championnat({
            saison: date.getMonth() < 8 ? (date.getFullYear() - 1) + " / " + date.getFullYear() : date.getFullYear() + " / " + (date.getFullYear() + 1 )
        });
	}
	
	/**
	 * Vérifie les paramètres de création
	 */
	submit(): void {

		// Petits ajustements
		if (this.championnat.type == ChampType.Coupe) {
			this.championnat.ptvict = null;
			this.championnat.ptnul = null;
			this.championnat.ptdef = null;
		}
		if (!this.avecNuls) 
			this.championnat.ptnul = null;

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
			map(term => this.equipesSport.filter(
				e => e.nom.trim().toLowerCase().indexOf(term.toLowerCase()) > -1
			))
		);

	/**
	 * Convertisseur d'affichage pour l'autocomplétion sur les équipes
	 */
	searchEquipeFormatter = (equipe: Equipe) => equipe.nom;

	/**
	 * Sélection d'un sport (rechargement des équipes existantes)
	 */
	selectionSport(): void {
		if (this.championnat.sport == this.newSport) {
			this.equipesSport = [];
		}
		else {
			this.equipesSport = null;
			this.requeteService.requete(
				this.equipeService.getEquipes(this.championnat.sport.nom),
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
}
