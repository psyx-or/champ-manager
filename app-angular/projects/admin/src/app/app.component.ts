import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthentService, User } from './services/authent.service';
import { LoginComponent } from '@commun/src/app/components/login/login.component';
import { Router } from '@angular/router';
import { LoadingInterceptor } from '@commun/src/app/utils/loading.interceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	/** Indique si l'utilisateur est authentifié */
	authentifie: boolean = false;
	/** Indique si un chargement est en cours */
	chargement: boolean = false;

	/**
	 * Constructor
	 * @param modalService 
	 * @param authentService 
	 */
	constructor(
		private modalService: NgbModal,
		private authentService: AuthentService,
		private router: Router,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit(): void {
		this.authentService.getUser().subscribe(
			this.authentification.bind(this)
		);
		LoadingInterceptor.getChargement().subscribe(
			val => this.chargement = val
		)
	}

	/**
	 * Affichage de la popup de login si nécessaire
	 * @param user Utilisateur connecté
	 */
	authentification(user: User): void {

		// Si on est connecté, c'est bon
		if (user.isAdmin || user.champId) {
			this.authentifie = true;

			if (!user.isAdmin)
				this.router.navigate(["matches", "avalider"]);
			return;
		}

		// Sinon, affichage de la pop-up de connexion pour récupérer les identifiants et recommencer
		const modal = this.modalService.open(LoginComponent, { centered: true, backdrop: 'static', keyboard: false });
		modal.componentInstance.error = user.isError;
		modal.componentInstance.dismissable = false;
		modal.result.then(creds => this.authentService.authentifie(creds).subscribe());
	}
}
