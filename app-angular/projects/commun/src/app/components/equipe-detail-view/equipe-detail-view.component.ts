import { Component, Input, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Equipe } from "../../model/Equipe";
import { jours } from "../../utils/utils";

@Component({
  selector: 'app-equipe-detail-view',
  templateUrl: './equipe-detail-view.component.html',
  styleUrls: ['./equipe-detail-view.component.css']
})
export class EquipeDetailViewComponent implements AfterViewInit {

	@Input() equipe: Equipe;

	@ViewChild('gmap') gmapElement: ElementRef<Element>;

	jours = jours;
	map: google.maps.Map;
	marqueur: google.maps.Marker;

	constructor(
	) { }

	/**
	 * Initialisation de la carte
	 */
	ngAfterViewInit(): void {

		if (!this.equipe.position) return;

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
