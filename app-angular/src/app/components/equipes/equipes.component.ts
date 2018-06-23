import { Component, OnInit } from '@angular/core';
import { Sport } from '../../model/Sport';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { EquipeService } from '../../services/equipe.service';
import { Equipe } from '../../model/Equipe';
import { Responsable } from '../../model/Responsable';
import { Creneau } from '../../model/Creneau';
import * as moment from 'moment';

@Component({
  selector: 'app-equipes',
  templateUrl: './equipes.component.html',
  styleUrls: ['./equipes.component.css']
})
export class EquipesComponent implements OnInit {

	sports: Sport[];
	selSport: Sport;
	equipes: Equipe[];
	jours = moment.weekdays(true);
	
	constructor(
		private route: ActivatedRoute,
		private requeteService: RequeteService,
		private equipeService: EquipeService
	) { }

	// TODO: Position sur la carte
	// TODO: Envoi de mot de passe manuel

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { sports: Sport[] }) => this.sports = data.sports);
	}

	/**
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.requeteService.requete(
			this.equipeService.getEquipesCourantes(this.selSport),
			equipes => {
				equipes.forEach(e => {
					for (let i = e.responsables.length; i < 2; i++)
						e.responsables.push(new Responsable());
					if (e.creneaux.length == 0)
						e.creneaux.push(new Creneau());
					else
						e.creneaux.forEach(e => e.heureDisp = moment(e.heure).format("HH:mm"));
				});
				this.equipes = equipes;
			}
		);
	}

	/**
	 * Ajout d'un créneau
	 * @param equipe 
	 */
	ajoutCreneau(equipe: Equipe): void {
		equipe.creneaux.push(new Creneau());
	}

	/**
	 * Supprime un créneau
	 * @param equipe 
	 * @param creneau 
	 */
	supprimeCreneau(equipe: Equipe, creneau: Creneau): void {
		equipe.creneaux = equipe.creneaux.filter(c => c != creneau);
	}

	/**
	 * Pousse les modifications
	 */
	submit(): void {
		this.equipes.forEach(e => {
			e.responsables = e.responsables.filter(r => r.nom && r.nom.trim().length > 0);
			e.creneaux = e.creneaux.filter(c => c.heure && c.jour);
		});
	}
}
