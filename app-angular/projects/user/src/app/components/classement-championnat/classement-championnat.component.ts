import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Championnat } from '@commun/src/app/model/Championnat';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-classement-championnat',
  templateUrl: './classement-championnat.component.html',
  styleUrls: ['./classement-championnat.component.css']
})
export class ClassementChampionnatComponent implements OnInit {

	menu = menus.championnat;
	champ: Championnat = null;
	seuilsForfait: [Number, Number];


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
			.subscribe((data: { champ: Championnat, seuilsForfait: [Number, Number] }) => {
				this.champ = data.champ;
				this.seuilsForfait = data.seuilsForfait;
			}
		);
	}
}
