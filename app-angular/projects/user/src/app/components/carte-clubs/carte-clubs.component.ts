import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Sport } from '@commun/src/app/model/Sport';
import { ActivatedRoute } from '@angular/router';
import { Equipe } from '@commun/src/app/model/Equipe';
import { EquipeService } from '@commun/src/app/services/equipe.service';
import { RequeteService } from '@commun/src/app/services/requete.service';

@Component({
  selector: 'app-carte-clubs',
  templateUrl: './carte-clubs.component.html',
  styleUrls: ['./carte-clubs.component.css']
})
export class CarteClubsComponent implements OnInit {

	@ViewChild('gmap', {static: true}) gmapElement: ElementRef<Element>;

	map: google.maps.Map;
	geocoder: google.maps.Geocoder;
	lastInfoBulle: google.maps.InfoWindow;
	sports: Sport[];
	selSport: Sport = null;
	equipes: Equipe[];
	adresse: string;

	/**
	 * Constructeur
	 * @param route 
	 */
	constructor(
		private route: ActivatedRoute,
		private equipeService: EquipeService,
		private requeteService: RequeteService,
		private changeDetector: ChangeDetectorRef
	) { }

	/**
	 * Initialisation du composant
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { sports: Sport[] }) => {
				this.sports = data.sports;
			});
	}

	/**
	 * Charge les équipes et affiche la carte
	 * @param sport 
	 */
	chargeEquipes(sport: Sport) {
		this.requeteService.requete(
			this.equipeService.getEquipesCourantes(sport),
			equipes => this.afficheCarte(equipes)
		);
	}

	/**
	 * Initialise la carte et affiche les équipes
	 * @param equipes 
	 */
	afficheCarte(equipes: Equipe[]) {

		this.equipes = equipes;

		// Création des objets Google Maps
		this.map = new google.maps.Map(this.gmapElement.nativeElement, {
			center: new google.maps.LatLng(45.183, 5.717),
			zoom: 10,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		
		this.geocoder = new google.maps.Geocoder();

		// On regroupe les équipes par club (en supprimant le chiffre à la fin)
		var clubs = equipes
			.filter(equipe => equipe.position)
			.reduce((tab, equipe) => {
				let club = equipe.nom.replace(/ \d+$/, "").trim();

				let tabEquipes = tab[club];
				if (!tabEquipes) tabEquipes = tab[club] = [];
				tabEquipes.push(equipe);

				return tab;
			}, {});

		// On regroupe les clubs par position pour éviter qu'un marqueur en cache un autre
		var groupes = Object.entries(clubs).reduce((tab, entry) => {
			let position = entry[1][0].position;
			let tabClubs = tab[position];
			if (!tabClubs) tabClubs = tab[position] = {};
			tabClubs[entry[0]] = entry[1];
			return tab;
		}, {});

		// On n'a plus qu'à parcourir les positions pour créer les marqueurs
		// Ici groupes est de type {position => {club => [equipes]}}
		for (const position in groupes) {
			if (groupes.hasOwnProperty(position)) {
				const clubs = groupes[position];
				let pos = position.split(',');

				let marqueur = new google.maps.Marker({
					map: this.map,
					position: new google.maps.LatLng(parseFloat(pos[0]), parseFloat(pos[1]))
				});

				google.maps.event.addListener(marqueur, 'click', () => this.ouverture(marqueur, clubs));
			}
		}
	}

	/**
	 * Affichage de l'infobulle quand on clique sur un marqueur
	 * @param marqueur 
	 * @param clubs 
	 */
	ouverture(marqueur: google.maps.Marker, clubs: { [nom: string]: Array<Equipe> }) {
		if (this.lastInfoBulle != null) this.lastInfoBulle.close();

		let texte = "";
		for (const club in clubs) {
			if (clubs.hasOwnProperty(club)) {
				const equipes = clubs[club];
				texte += `<h4>${club}</h4>`;
				texte += "Equipes: ";
				texte += equipes.map(e => `<div>${e.nom}</div>`).join("");
				texte += '<br><a href="http://www.fsgt38.org" target="_blank">Contactez le comité</a>'; // TODO fix contact url
			}
		}

		let infoBulle = new google.maps.InfoWindow();
		infoBulle.setContent(texte);
		infoBulle.open(this.map, marqueur);

		this.lastInfoBulle = infoBulle;
	}

	/**
	 * Lance le géocodage
	 */
	geocode() {
		this.geocoder.geocode(
			{ address: this.adresse },
			(results, status) => {
				if (status == google.maps.GeocoderStatus.OK) {
					this.adresse = results[0].formatted_address;
					let position = results[0].geometry.location;
					this.map.setCenter(position);
					if (this.map.getZoom() < 16) this.map.setZoom(16);
					this.changeDetector.detectChanges();
				}
				else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
					alert("Adresse non trouvée");
				}
				else {
					alert('Géocodage impossible pour cause de ' + status);
				}
			});
	}
}
