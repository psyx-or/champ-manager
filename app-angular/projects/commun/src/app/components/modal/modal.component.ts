import { Component, Input, TemplateRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

	@Input() titre: string;
	@Input() contenu: TemplateRef<any>;
	@Input() contexte: Object;
	@Input() valider: boolean;
	@Input() formulaire: boolean;

	constructor(
		public activeModal: NgbActiveModal
	) { }
}
