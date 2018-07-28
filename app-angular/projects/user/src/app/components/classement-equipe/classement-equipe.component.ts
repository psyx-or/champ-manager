import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Championnat } from '@commun/src/app/model/Championnat';
import { ActivatedRoute } from '@angular/router';
import { ChampionnatEquipeDTO } from '@commun/src/app/model/ChampionnatEquipeDTO';
import { Equipe } from '@commun/src/app/model/Equipe';

@Component({
  selector: 'app-classement-equipe',
  templateUrl: './classement-equipe.component.html',
  styleUrls: ['./classement-equipe.component.css']
})
export class ClassementEquipeComponent implements OnInit {
	
	menu = menus.equipe;
	equipe: Equipe;
	champs: Championnat[] = null;


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
			.subscribe((data: { dto: ChampionnatEquipeDTO }) => {
				this.equipe = data.dto.equipe;
				this.champs = data.dto.championnats;
			}
		);
	}
}
