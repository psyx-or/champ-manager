import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { Equipe } from '../../model/Equipe';
import { Creneau } from '../../model/Creneau';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartePositionnementComponent } from '../carte-positionnement/carte-positionnement.component';
import { RequeteService } from '../../services/requete.service';
import { openModal, jours } from '../../utils/utils';
import { EquipeService } from '../../services/equipe.service';

@Component({
  selector: 'app-equipe-detail',
  templateUrl: './equipe-detail.component.html',
  styleUrls: ['./equipe-detail.component.css']
})
export class EquipeDetailComponent {

	@ViewChild('envoiMail', {static: true}) envoiMailTpl: TemplateRef<any>;

	@Input() equipe: Equipe;
	@Input() motdepasse: boolean;

	jours = jours;

	constructor(
		public requeteService: RequeteService,
		private equipeService: EquipeService,
		public modalService: NgbModal
	) { }

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
	 * Ouvre la carte pour positionner l'équipe
	 * @param equipe 
	 */
	positionne(equipe: Equipe): void {
		const modal = this.modalService.open(CartePositionnementComponent, { backdrop: 'static', windowClass: 'modal-xxl' });
		modal.componentInstance.equipe = equipe;
		modal.result.then((res: string) => equipe.position = res, () => { });
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
