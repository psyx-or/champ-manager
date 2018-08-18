import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Championnat } from '@commun/src/app/model/Championnat';
import { ActivatedRoute, Router } from '@angular/router';
import { ChampionnatEquipeDTO } from '@commun/src/app/model/ChampionnatEquipeDTO';

@Component({
  selector: 'app-historique-equipe',
  templateUrl: './historique-equipe.component.html',
  styleUrls: ['./historique-equipe.component.css']
})
export class HistoriqueEquipeComponent implements OnInit {

	menu = menus.equipe;
	equipe: Equipe;
	champs: Championnat[] = null;


	/**
	 * Constructeur
	 * @param route 
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { dto: ChampionnatEquipeDTO }) => {
				this.equipe = data.dto.equipe;
				this.champs = data.dto.championnats;
			}
			);
	}

	/**
	 * Affiche le classement d'un championnat
	 * @param champ 
	 */
	afficheClassement(champ: Championnat) {
		this.router.navigate(["classement", champ.id]);
	}
}
