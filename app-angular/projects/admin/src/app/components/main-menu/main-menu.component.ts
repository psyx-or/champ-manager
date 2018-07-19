import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Equipe } from 'projects/commun/src/app/model/Equipe';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

	DEPLOY_PATH = environment.DEPLOY_PATH;

	constructor(
		private router: Router
	) { }

	/**
	 * Sélection d'une équipe dans la zone de recherche
	 * @param equipe
	 */
	selectEquipe(equipe: Equipe): void {
		this.router.navigate(['equipe', equipe.id])
	}
}
