import { Component, OnInit, Input } from '@angular/core';
import { Championnat } from '@commun/src/app/model/Championnat';
import { Classement } from '@commun/src/app/model/Classement';
import { sort } from '@commun/src/app/utils/utils';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit {

	@Input() champ: Championnat = null;
	@Input() equipe: Equipe = null;
	@Input() seuilsForfait: [Number, Number];

	classements: Classement[];

	constructor(
		private router: Router,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.classements = sort(this.champ.classements, 'position');
	}

	/**
	 * Affichage des matches d'une équipe
	 * @param equipe 
	 */
	afficheMatches(equipe: Equipe) {
		// TODO: afficher les matches du championnat uniquement
		this.router.navigate(["equipe", "matches", equipe.id]);
	}
}
