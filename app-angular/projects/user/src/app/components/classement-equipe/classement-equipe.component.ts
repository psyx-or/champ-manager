import { Component, OnInit } from '@angular/core';
import { setMenuEquipe } from '../../utils/menus';
import { Championnat } from '@commun/src/app/model/Championnat';
import { ActivatedRoute } from '@angular/router';
import { ChampionnatEquipeDTO } from '@commun/src/app/model/ChampionnatEquipeDTO';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Menu } from '@commun/src/app/components/generic-menu/generic-menu.model';
import { AuthentService } from '../../services/authent.service';

@Component({
  selector: 'app-classement-equipe',
  templateUrl: './classement-equipe.component.html',
  styleUrls: ['./classement-equipe.component.css']
})
export class ClassementEquipeComponent implements OnInit {
	
	menu: Menu;
	equipe: Equipe;
	champs: Championnat[] = null;
	seuilsForfait: [Number, Number];


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
			.subscribe((data: { dto: ChampionnatEquipeDTO, seuilsForfait: [Number, Number] }) => {
				this.equipe = data.dto.equipe;
				this.champs = data.dto.championnats;
				this.seuilsForfait = data.seuilsForfait;

				setMenuEquipe(this);
			});
	}
}
