import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Equipe } from '@commun/src/app/model/Equipe';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentService } from '../../services/authent.service';
import { EquipeService } from '@commun/src/app/services/equipe.service';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent implements OnInit {

	menu = menus.equipe;
	equipe: Equipe;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authentService: AuthentService,
		private equipeService: EquipeService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe }) => {
				this.equipe = data.equipe;
			});

		this.authentService.getEquipe().subscribe(equipeConnectee => {
			if (this.equipe && (equipeConnectee != null) != (this.equipe.responsables[0].nom != null)) {
				this.equipeService.clearCache();
				this.router.navigate([]);
			}
		});
	}
}
