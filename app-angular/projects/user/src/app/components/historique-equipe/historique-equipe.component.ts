import { Component, OnInit } from '@angular/core';
import { setMenuEquipe } from '../../utils/menus';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Championnat } from '@commun/src/app/model/Championnat';
import { ActivatedRoute, Router } from '@angular/router';
import { ChampionnatEquipeDTO } from '@commun/src/app/model/ChampionnatEquipeDTO';
import { AuthentService } from '../../services/authent.service';
import { Menu } from '@commun/src/app/components/generic-menu/generic-menu.model';

@Component({
  selector: 'app-historique-equipe',
  templateUrl: './historique-equipe.component.html',
  styleUrls: ['./historique-equipe.component.css']
})
export class HistoriqueEquipeComponent implements OnInit {

	menu: Menu;
	equipe: Equipe;
	champs: Championnat[] = null;


	/**
	 * Constructeur
	 * @param route 
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public authentService: AuthentService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { dto: ChampionnatEquipeDTO }) => {
				this.equipe = data.dto.equipe;
				this.champs = data.dto.championnats;

				setMenuEquipe(this);
			});
	}

	/**
	 * Affiche le classement d'un championnat
	 * @param champ 
	 */
	afficheClassement(champ: Championnat) {
		this.router.navigate(["classement", champ.id]);
	}
}
