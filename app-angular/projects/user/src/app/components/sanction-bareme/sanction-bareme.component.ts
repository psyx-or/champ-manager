import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { SanctionCategorie } from '@commun/src/app/model/Sanction';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sanction-bareme',
  templateUrl: './sanction-bareme.component.html',
  styleUrls: ['./sanction-bareme.component.css']
})
export class SanctionBaremeComponent implements OnInit {

	menu = menus.sanctions;
	bareme: SanctionCategorie[];

	constructor(
		private route: ActivatedRoute,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		// Récupération des données
		this.route.data.subscribe((data: { bareme: SanctionCategorie[] }) => {
			this.bareme = data.bareme;
		});
	}

}
