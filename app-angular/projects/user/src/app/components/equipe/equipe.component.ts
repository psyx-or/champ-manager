import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { menus } from '../../utils/menus';
import { Equipe } from '@commun/src/app/model/Equipe';
import { ActivatedRoute, Router } from '@angular/router';
import { jours } from 'projects/commun/src/app/utils/utils';
import { AuthentService } from '../../services/authent.service';
import { EquipeService } from '@commun/src/app/services/equipe.service';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent implements OnInit, AfterViewInit {

	@ViewChild('gmap', {static: false}) gmapElement: ElementRef<Element>;

	menu = menus.equipe;
	jours = jours;
	map: google.maps.Map;
	marqueur: google.maps.Marker;
	equipe: Equipe;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authentService: AuthentService,
		private equipeService: EquipeService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe }) => {
				this.equipe = data.equipe;
			});

		this.authentService.getEquipe().subscribe(equipeConnectee => {
			if (this.equipe && (equipeConnectee != null) != (this.equipe.responsables[0].nom != null)) {
				this.equipeService.clearCache();
				this.router.navigate([]);
			}
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
