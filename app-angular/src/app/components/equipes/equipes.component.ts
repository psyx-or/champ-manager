import { Component, OnInit } from '@angular/core';
import { Sport } from '../../model/Sport';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { EquipeService } from '../../services/equipe.service';
import { Equipe } from '../../model/Equipe';
import { Responsable } from '../../model/Responsable';
import { Creneau } from '../../model/Creneau';
import * as moment from 'moment';

moment.locale('fr');

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
	// TODO: Gestion des heures et suppression de la locale moment

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
					// On s'assure de pouvoir saisir 2 responsables
					for (let i = e.responsables.length; i < 2; i++)
						e.responsables.push(new Responsable());
					// Et au moins un créneau
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
		// On filtre
		this.equipes.forEach(e => {
			e.creneaux.forEach(c => c.heure = moment(c.heureDisp, "HH:mm").toDate())
			e.creneaux = e.creneaux.filter(c => c.heure != null && c.jour != null);
		});

		// On pousse
		this.requeteService.requete(
			this.equipeService.majEquipes(this.equipes),
			n => { alert("Equipes mises à jour"); this.selectionSport(); } // TO: alerte
		);
	}

	/**
	 * Renvoie le lien vers l'annuaire
	 */
	lienAnnuaire(): string {
		return this.equipeService.lienAnnuaire(this.selSport);
	}

	/**
	 * Ajoute des espaces dans le numéro de téléphone et supprime les points
	 * @param equipe 
	 * @param i 
	 */
	completeTel(equipe: Equipe, i: number, newval: string): void {

		newval = newval.replace(/\./g, " ").replace("  ", " ");

		if (newval.startsWith(equipe.responsables[i].tel1)) {
			var l = newval.length;
			if (l < 14 && l % 3 == 2 && !newval.endsWith(" "))
				newval += " ";
		}

		equipe.responsables[i].tel1 = newval;
	}
}