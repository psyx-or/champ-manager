import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Sanction } from '@commun/src/app/model/Sanction';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sanction-equipe',
  templateUrl: './sanction-equipe.component.html',
  styleUrls: ['./sanction-equipe.component.css']
})
export class SanctionEquipeComponent implements OnInit {

	menu = menus.equipe;
	equipe: Equipe;
	sanctions: Sanction[];

	constructor(
		private route: ActivatedRoute,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		// Récupération des données
		this.route.data.subscribe((data: { equipe: Equipe, sanctions: Sanction[] }) => {
			this.equipe = data.equipe;
			this.sanctions = data.sanctions;
		});
	}

}
