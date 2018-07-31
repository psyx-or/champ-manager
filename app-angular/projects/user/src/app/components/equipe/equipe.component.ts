import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Equipe } from '@commun/src/app/model/Equipe';
import { ActivatedRoute } from '@angular/router';
import { jours } from 'projects/commun/src/app/utils/utils';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent implements OnInit, AfterViewInit {

	@ViewChild('gmap') gmapElement: any;

	menu = menus.equipe;
	jours = jours;
	map: google.maps.Map;
	marqueur: google.maps.Marker;
	equipe: Equipe;

	constructor(
		private route: ActivatedRoute,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe }) => {
				this.equipe = data.equipe;
			});
	}

	/**
	 * Initialisation de la carte
	 */
	ngAfterViewInit(): void {

		if(!this.equipe.position) return;

		let pos = this.equipe.position.split(',');
		let position = new google.maps.LatLng(parseFloat(pos[0]), parseFloat(pos[1]));

		// Création des objets Google Maps
		this.map = new google.maps.Map(this.gmapElement.nativeElement, {
			center: position,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		// Création du marqueur
		this.marqueur = new google.maps.Marker({
			map: this.map,
			draggable: false,
			position: position
		});
	}
}
