import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Equipe } from 'projects/commun/src/app/model/Equipe';
import { AuthentService, User } from '../../services/authent.service';
import { RequeteService } from '@commun/src/app/services/requete.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

	DEPLOY_PATH = environment.DEPLOY_PATH;

	navbarOpen: boolean = false;
	user: User = null;

	constructor(
		private router: Router,
		private authentService: AuthentService,
		private requeteService: RequeteService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit(): void {
		this.authentService.getUser().subscribe(user => this.user = user);
	}

	/**
	 * Affiche/masque le menu en vue réduite
	 */
	toggleNavbar() {
		this.navbarOpen = !this.navbarOpen;
	}

	/**
	 * Sélection d'une équipe dans la zone de recherche
	 * @param equipe
	 */
	selectEquipe(equipe: Equipe): void {
		this.router.navigate(['equipe', equipe.id])
	}

	/**
	 * Déconnexion
	 */
	deconnexion(): void {
		this.requeteService.requete(
			this.authentService.deconnecte()
		);
	}
}
