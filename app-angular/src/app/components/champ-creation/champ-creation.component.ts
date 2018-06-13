import { Component, OnInit } from '@angular/core';
import { Championnat, ChampType } from '../../model/Championnat';
import { SportService } from '../../services/sport.service';
import { Sport } from '../../model/Sport';
import { ChampionnatService } from '../../services/championnat.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EquipeService } from '../../services/equipe.service';
import { Equipe } from '../../model/Equipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChampCreationAlertComponent } from '../champ-creation-alert/champ-creation-alert.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-champ-creation',
  templateUrl: './champ-creation.component.html',
  styleUrls: ['./champ-creation.component.css']
})
export class ChampCreationComponent implements OnInit {

    sports: Sport[];
    types: [string,string][];
    newSport: Sport = new Sport();
	championnat: Championnat;
	equipes = Array(24);
	itequipes = Array(this.equipes.length);
	avecNuls: boolean = true;
	equipesSport: Equipe[] = null;
	validation: boolean = false;


	/**
	 * Constructeur
	 * @param sportsService 
	 * @param championnatService 
	 */
    constructor(
		private modalService: NgbModal,
        private sportsService: SportService,
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
        this.sportsService.getSports().subscribe(sports => this.sports = sports);

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
		this.validation = true;

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
		let news = this.equipes.filter((e: Equipe) => e && e.id == null);
		if (news.length > 0) {
			// Si non, affichage de la pop-up de connexion pour récupérer les identifiants et recommencer
			const modal = this.modalService.open(ChampCreationAlertComponent, { centered: true, backdrop: 'static' });
			modal.componentInstance.equipes = news;
			modal.result.then(() => this.creation());
		}
		else {
			this.creation();
		}
	}

	/**
	 * Lancement de la création du championnat
	 */
	creation(): void {
		this.championnatService.create(this.championnat, this.equipes.filter(e=>e)).subscribe(
			champ => {
				this.router.navigate(['journees', champ.id])
			},
			err => {
				alert("Erreur lors de la création");
				this.validation = false;
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
			this.equipeService.getEquipes(this.championnat.sport.nom).subscribe(
				equipes => this.equipesSport = equipes
			)
		}
	}

	/**
	 * @returns Nombre d'équipe actuellement associées au championnat
	 */
	getNbEquipes(): number {
		return this.equipes.filter(e => e).length;
	}
}
