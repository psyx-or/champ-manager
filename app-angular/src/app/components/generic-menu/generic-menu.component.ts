import { Component, OnInit, Input } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Championnat, ChampType } from '../../model/Championnat';
import { Menu, menus } from '../../utils/menus';

@Component({
  selector: 'app-generic-menu',
  templateUrl: './generic-menu.component.html',
  styleUrls: ['./generic-menu.component.css']
})
export class GenericMenuComponent implements OnInit {

	@Input() obj?: any;
	@Input() nomMenu: string;
	
	menu: Menu;
	active: number;

	constructor(
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.menu = menus[this.nomMenu];
		this.route.url.subscribe(segments => {
			const route = segments.slice(0, segments.length - 1).map(s => s.path).join("/");
			this.active = this.menu.items.findIndex(t => t.route == route);
		})
	}
	
	public beforeChange($event: NgbTabChangeEvent) {
		$event.preventDefault();
		let index = $event.nextId.substr(2);

		let nextRoute = [this.menu.items[+index].route];
		if (this.obj && this.obj.id) nextRoute.push(this.obj.id);

		this.router.navigate(nextRoute);
	};
}
