import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Equipe } from '@commun/src/app/model/Equipe';
import { ActivatedRoute } from '@angular/router';
import { Journee } from '@commun/src/app/model/Journee';

@Component({
  selector: 'app-coupes-equipe',
  templateUrl: './coupes-equipe.component.html',
  styleUrls: ['./coupes-equipe.component.css']
})
export class CoupesEquipeComponent implements OnInit {

	menu = menus.equipe;
	equipe: Equipe;
	journees: Journee[] = null;

	/**
	 * Constructeur
	 * @param route 
	 */
	constructor(
		private route: ActivatedRoute,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe, journees: Journee[] }) => {
				this.equipe = data.equipe;
				this.journees = data.journees;
			}
		);
	}
}
