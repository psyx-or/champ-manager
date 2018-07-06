import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Sport } from '../../model/Sport';
import { ActivatedRoute } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { EquipeService } from '../../services/equipe.service';
import { Equipe } from '../../model/Equipe';
import { Responsable } from '../../model/Responsable';
import { Creneau } from '../../model/Creneau';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartePositionnementComponent } from '../carte-positionnement/carte-positionnement.component';
import { openModal } from '../../utils/utils';

@Component({
  selector: 'app-equipes',
  templateUrl: './equipes.component.html',
  styleUrls: ['./equipes.component.css']
})
export class EquipesComponent implements OnInit {

	@ViewChild('envoiMail') envoiMailTpl: TemplateRef<any>;

	sports: Sport[];
	selSport: Sport;
	equipes: Equipe[];
	jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
	
	constructor( 
		private route: ActivatedRoute,
		public requeteService: RequeteService,
		private equipeService: EquipeService,
		public modalService: NgbModal
	) { }

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
			e.creneaux.forEach(c => c.heure = moment("1970-01-01 " + c.heureDisp, "YYYY-MM-DD HH:mm").add(1, 'hour').toDate())
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

	/**
	 * Ouvre la carte pour positionner l'équipe
	 * @param equipe 
	 */
	positionne(equipe: Equipe): void {
		const modal = this.modalService.open(CartePositionnementComponent, { backdrop: 'static', windowClass: 'modal-xl' });
		modal.componentInstance.equipe = equipe;
		modal.result.then((res: string) => equipe.position = res, err => {});
	}

	/**
	 * Change le mail d'une équipe et affiche le mail à envoyer
	 * @param equipe 
	 */
	changeMdp(equipe: Equipe): void {
		this.requeteService.requete(
			this.equipeService.changeMdp(equipe),
			mail => openModal(
				this,
				"Envoi manuel de mail",
				this.envoiMailTpl,
				mail,
				null,
				"lg"
			)
		);
	}
}
