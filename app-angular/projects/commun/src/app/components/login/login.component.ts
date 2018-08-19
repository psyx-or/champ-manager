import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
	
	@Input() error: boolean;

	creds = { login: null, password: null };

	constructor(
		private activeModal: NgbActiveModal
	) { }

	submit(): void {
		this.activeModal.close(this.creds);
	}

}
