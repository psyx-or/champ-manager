import { Component, Input } from '@angular/core';
import { Sanction, SanctionBareme } from '../../model/Sanction';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sanction-liste',
  templateUrl: './sanction-liste.component.html',
  styleUrls: ['./sanction-liste.component.css']
})
export class SanctionListeComponent {

	@Input() sanctions: Sanction[];
	@Input() avecJoueur: boolean;
	@Input() avecLien: boolean;
  
	constructor() { }

	/**
	 * Affiche ou masque le barème d'une faute
	 * @param popOver 
	 * @param bareme 
	 */
	toggleBareme(popOver: NgbPopover, bareme: SanctionBareme) {
		if (popOver.isOpen()) {
			popOver.close();
		} else {
			popOver.open({ bareme });
		}
	}
}
