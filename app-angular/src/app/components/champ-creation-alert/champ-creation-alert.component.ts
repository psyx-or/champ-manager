import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Equipe } from '../../model/Equipe';

@Component({
  selector: 'app-champ-creation-alert',
  templateUrl: './champ-creation-alert.component.html',
  styleUrls: ['./champ-creation-alert.component.css']
})
export class ChampCreationAlertComponent {

	@Input() equipes: Equipe[];

	constructor(
		public activeModal: NgbActiveModal
	) { }
}
