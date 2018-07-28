import { Component, OnInit, Input } from '@angular/core';
import { Championnat } from '@commun/src/app/model/Championnat';
import { Classement } from '@commun/src/app/model/Classement';
import { sort } from '@commun/src/app/utils/utils';
import { Equipe } from '@commun/src/app/model/Equipe';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit {

	@Input() champ: Championnat = null;
	@Input() equipe: Equipe = null;

	classements: Classement[];

	constructor(
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.classements = sort(this.champ.classements, 'position');
	}
}
