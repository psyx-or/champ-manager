import { Component, OnInit } from '@angular/core';
import { setMenuEquipe } from '../../utils/menus';
import { Equipe } from '@commun/src/app/model/Equipe';
import { ActivatedRoute } from '@angular/router';
import { Journee } from '@commun/src/app/model/Journee';
import { Menu } from '@commun/src/app/components/generic-menu/generic-menu.model';
import { AuthentService } from '../../services/authent.service';

@Component({
  selector: 'app-coupes-equipe',
  templateUrl: './coupes-equipe.component.html',
  styleUrls: ['./coupes-equipe.component.css']
})
export class CoupesEquipeComponent implements OnInit {

	menu: Menu;
	equipe: Equipe;
	journees: Journee[] = null;

	/**
	 * Constructeur
	 * @param route 
	 */
	constructor(
		private route: ActivatedRoute,
		public authentService: AuthentService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe, journees: Journee[] }) => {
				this.equipe = data.equipe;
				this.journees = data.journees;

				setMenuEquipe(this);
			});
	}
}
