import { Component, OnInit, Input } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Championnat, ChampType } from '../../model/Championnat';

@Component({
  selector: 'app-champ-menu',
  templateUrl: './champ-menu.component.html',
  styleUrls: ['./champ-menu.component.css']
})
export class ChampMenuComponent implements OnInit {

	@Input() champ?: Championnat;

	active: number;
	menu = [
		{ route: "matches", titre: "<i class='icon ion-md-clipboard'></i> Matches" },
		{ route: "classement", titre: "<i class='icon ion-md-podium'></i> Classement", types: [ChampType.Aller, ChampType["Aller/Retour"]]},
		{ route: "coupe", titre: "<i class='icon ion-md-git-network'></i> Plateau", types: [ChampType.Coupe] },
		{ route: "journees", titre: "<i class='icon ion-md-calendar'></i> Calendrier"},
	]

	constructor(
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		const route = this.route.snapshot.url;
		this.active = this.menu.findIndex(t => t.route == route[0].path);
	}
	
	public beforeChange($event: NgbTabChangeEvent) {
		$event.preventDefault();
		let index = $event.nextId.substr(2);
		this.router.navigate([this.menu[+index].route, this.champ.id]);
	};
}
