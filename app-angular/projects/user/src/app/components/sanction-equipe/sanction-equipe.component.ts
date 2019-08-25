import { Component, OnInit } from '@angular/core';
import { setMenuEquipe } from '../../utils/menus';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Sanction } from '@commun/src/app/model/Sanction';
import { ActivatedRoute } from '@angular/router';
import { AuthentService } from '../../services/authent.service';
import { Menu } from 'projects/admin/src/app/utils/menus';

@Component({
  selector: 'app-sanction-equipe',
  templateUrl: './sanction-equipe.component.html',
  styleUrls: ['./sanction-equipe.component.css']
})
export class SanctionEquipeComponent implements OnInit {

	menu: Menu;
	equipe: Equipe;
	sanctions: Sanction[];

	constructor(
		private route: ActivatedRoute,
		public authentService: AuthentService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		// Récupération des données
		this.route.data.subscribe((data: { equipe: Equipe, sanctions: Sanction[] }) => {
			this.equipe = data.equipe;
			this.sanctions = data.sanctions;

			setMenuEquipe(this);
		});
	}

}
