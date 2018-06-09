import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { AuthentService } from './services/authent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	/** Indique si l'utilisateur est authentifié */
	authentifie: boolean = false;

	/**
	 * Constructor
	 * @param modalService 
	 * @param authentService 
	 */
	constructor(
		private modalService: NgbModal,
		private authentService: AuthentService
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit(): void {
		this.checkConnexion(true);
	}

	/**
	 * Vérifie si l'utilisateur est connecté
	 * @param first Vrai si c'est le premier appel
	 * @param creds Identifiants de l'utilisateur
	 */
	checkConnexion(first: boolean, creds?: Object): void {
		// Appel au serveur
		this.authentService.authentifie(creds).subscribe(connected => {
			this.authentifie = connected;

			// Si on est connecté, c'est bon
			if (connected) return;

			// Sinon, affichage de la pop-up de connexion pour récupérer les identifiants et recommencer
			const modal = this.modalService.open(LoginComponent, { centered: true, backdrop: 'static' });
			modal.componentInstance.error = !first;
			modal.result.then(creds => this.checkConnexion(false, creds));
		});
	}
}
