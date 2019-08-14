import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Journee } from '@commun/src/app/model/Journee';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coupe-user',
  templateUrl: './coupe-user.component.html',
  styleUrls: ['./coupe-user.component.css']
})
export class CoupeUserComponent implements OnInit {

	menu = menus.championnat;
	journee: Journee;

	constructor(
		private route: ActivatedRoute,
	) { }


	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data.subscribe(
			(data: { journee: Journee }) => {
				this.journee = data.journee;
			}
		);
	}
}
