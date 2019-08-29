import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthentService } from '../../services/authent.service';
import { LoginComponent } from '@commun/src/app/components/login/login.component';
import { Equipe } from '@commun/src/app/model/Equipe';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

	DEPLOY_PATH = environment.DEPLOY_PATH;

	equipe: Equipe;
	navbarOpen: boolean = false;
	
	constructor(
		private modalService: NgbModal,
		private authentService: AuthentService
	) { }

	ngOnInit() {
		this.authentService.getEquipe().subscribe(
			equipe => this.equipe = equipe
		);
	}

	/**
	 * Affiche/masque le menu en vue réduite
	 */
	toggleNavbar() {
		this.navbarOpen = !this.navbarOpen;
	}

	/**
	 * Connexion
	 * @param erreur Vrai s'il y a eu une erreur lors de la tentative précédente'
	 */
	connexion(erreur: boolean): void {
		const modal = this.modalService.open(LoginComponent, { centered: true, backdrop: 'static' });
		modal.componentInstance.error = erreur;
		modal.componentInstance.dismissable = true;
		modal.result.then(creds => {
			this.authentService.authentifie(creds).subscribe(
				ok => {
					if (!ok) this.connexion(true);
				}
			);
		});
	}

	/**
	 * Déconnexion
	 */
	deconnexion(): void {
		this.authentService.deconnecte().subscribe();
	}
}
