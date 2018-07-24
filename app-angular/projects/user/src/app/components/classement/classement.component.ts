import { Component, OnInit } from '@angular/core';
import { Championnat } from '@commun/src/app/model/Championnat';
import { Classement } from '@commun/src/app/model/Classement';
import { ActivatedRoute } from '@angular/router';
import { sort } from '@commun/src/app/utils/utils';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit {

	champ: Championnat = null;
	classements: Classement[];

	constructor(
		private route: ActivatedRoute,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { champ: Championnat }) => {
				this.champ = data.champ;
				this.classements = sort(data.champ.classements, 'position');
			}
		);
	}
}
