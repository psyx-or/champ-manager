import { Component, OnInit, Injectable, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JourneeService } from '../../services/journee.service';
import { NgbDatepickerI18n, NgbDateStruct, NgbDatepickerConfig, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CanComponentDeactivate } from '@commun/src/app/utils/can-deactivate.guard';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Journee } from 'projects/commun/src/app/model/Journee';
import { menus } from '../../utils/menus';
import { User, AuthentService } from '../../services/authent.service';


const nbMois = 4;

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

	getWeekdayShortName(weekday: number): string {
		return ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'][weekday - 1];
	}
	getMonthShortName(month: number): string {
		return ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'][month - 1];
	}
	getMonthFullName(month: number): string {
		return ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][month - 1];
	}
	getDayAriaLabel(date: NgbDateStruct): string {
		return `${date.day}-${date.month}-${date.year}`;
	}
}

/**
 * Conversion calendrier => moment
 * @param date
 */
function toMoment(date: NgbDateStruct): moment.Moment {
	return moment([date.year, date.month - 1, date.day]);
}

/**
 * Conversion moment => calendrier
 * @param date 
 */
function toNgbDate(date: moment.Moment): NgbDateStruct {
	return {
		year: date.year(),
		month: date.month() + 1,
		day: date.date()
	};
}

enum EtatCalendrier { ChoixDebut, ChoixFin }


//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

@Component({
	selector: 'app-journees-champ',
	templateUrl: './journees-champ.component.html',
	styleUrls: ['./journees-champ.component.css'],
	providers: [NgbDatepickerConfig, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
})
export class JourneesChampComponent implements OnInit, AfterViewInit, CanComponentDeactivate {

	couleurs = Array(
		["primary", "white"], ["secondary", "white"], ["success", "white"], ["danger", "white"],
		["warning", "dark"], ["info", "white"], ["dark", "white"]
	);

	menu = menus.championnat;
	user: User = null;
	champ: Championnat = null;
	journees: Journee[];
	iJournee: number = null;
	defautJournees: {debut?:string, fin?:string} = {};
	retour: string;
	initial: string;

	private dateNavigation = moment();
	@ViewChildren(NgbDatepicker)
	private datePickers: QueryList<NgbDatepicker>;

	etat: EtatCalendrier = EtatCalendrier.ChoixDebut;
	dateDebut: moment.Moment;
	dateFin: moment.Moment;
	dateDebutSel: moment.Moment;
	dateFinSel: moment.Moment;


	/**
	 * Constructeur
	 * @param route 
	 * @param journeeService 
	 * @param config 
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private journeeService: JourneeService,
		private authentService: AuthentService,
		config: NgbDatepickerConfig
	) { 
		config.displayMonths = nbMois;
		config.navigation = "none";
		config.showWeekNumbers = true;
	}

	/**
	 * Initialisation du composant
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { champ: Championnat }) => {
				this.champ = data.champ;
				this.journees = data.champ.journees;
				this.initial = JSON.stringify(this.journees);
				this.iJournee = 0;
				this.initJournees();
			}
		);
		this.route.paramMap
			.subscribe(params => this.retour = params.get("retour"))
		this.authentService.getUser()
			.subscribe(user => this.user = user);
	}

	/**
	 * Réglage de l'affichage des calendriers
	 */
	ngAfterViewInit(): void {
		this.navigation(0);
	}

	/**
	 * Vérification de la présence de modification
	 */
	canDeactivate(): boolean {
		return JSON.stringify(this.journees) == this.initial;
	}


	/**
	 * Recopie les dates des dernières journées enregistrées
	 */
	initJournees(): void {
		let dates = this.journeeService.lastDates;
		for (let i = 0; i < this.journees.length && i < dates.length; i++) {
			if (this.journees[i].debut)
				break;

			if (!this.defautJournees.debut)
				this.defautJournees.debut = this.journees[i].libelle;

			this.journees[i].debut = dates[i][0];
			this.journees[i].fin = dates[i][1];
			this.iJournee = (i + 1) % this.journees.length;

			this.defautJournees.fin = this.journees[i].libelle;
		}
	}

	/**
	 * Enregistre le calendrier
	 */
	enregistrer(): void {
		this.journeeService.majJournees(this.champ, this.journees).subscribe(
			() => {
				this.initial = JSON.stringify(this.journees);
				if (this.retour)
					this.router.navigate(['calendrier', { sport: this.retour }]);
				else
					this.router.navigate(['championnats'])
			}
		);
	}

	/**
	 * Appelé au survol d'une date du calendrier
	 * @param date 
	 */
	daySel(date: NgbDateStruct): void {
		if (!this.user.isAdmin) return;
		this.dateDebutSel = date ? toMoment(date).startOf("isoWeek") : null;
		this.dateFinSel = date ? toMoment(date).endOf("isoWeek") : null;
	}

	/**
	 * Calcule la classe CSS associée à une date du calendrier
	 * @param date 
	 */
	dayClass(date: NgbDateStruct): Object {
		if (this.iJournee == null) return;

		let d = toMoment(date);

		// Semaines déjà sélectionnées ?
		let i = this.journees.findIndex(j => j.debut && j.fin && d.isBetween(j.debut, j.fin, null, "[]"));
		if (i > -1 ) {
			let couleur = this.couleurs[i % this.couleurs.length];
			return ['bg-' + couleur[0], 'text-' + couleur[1]];
		}

		// Semaine sélectionnée ?
		let couleur = this.couleurs[this.iJournee % this.couleurs.length];
		if (d.isBetween(this.dateDebut, this.dateFin, null, "[]"))
			return ['bg-' + couleur[0], 'text-' + couleur[1]];
		
		// Semaines en cours de sélection?
		if (!this.dateDebutSel || !this.dateFinSel)
			return;

		let debutSel = this.dateDebut ? moment.min(this.dateDebut, this.dateDebutSel) : this.dateDebutSel;
		let finSel = this.dateFin ? moment.max(this.dateFin, this.dateFinSel) : this.dateFinSel;
		if (d.isBetween(debutSel, finSel, null, "[]"))
			return ['bg-' + couleur[0], 'text-' + couleur[1], 'selection'];
	}

	/**
	 * Appelée quand on clique sur le calendrier
	 * @param date 
	 */
	onDaySelection(date: NgbDateStruct) {
		if (this.iJournee == null) return;
		if (!this.user.isAdmin) return;
		
		let debut = toMoment(date).startOf("isoWeek");
		let fin = toMoment(date).endOf("isoWeek");
		switch(this.etat) {
			case EtatCalendrier.ChoixDebut:
				this.dateDebut = debut;
				this.dateFin = fin;
				this.etat = EtatCalendrier.ChoixFin;
				break;

			case EtatCalendrier.ChoixFin:
				this.journees[this.iJournee].debut = moment.min(debut, this.dateDebut).toDate();
				this.journees[this.iJournee].fin = moment.max(fin, this.dateFin).toDate();
				this.dateDebut = undefined;
				this.dateFin = undefined;
				this.etat = EtatCalendrier.ChoixDebut;
				this.iJournee = (this.iJournee + 1) % this.journees.length;
				break;
		}
	}

	/**
	 * Décale tous les calendriers
	 * @param decalage 
	 */
	navigation(decalage: number): void {
		this.dateNavigation.add(decalage, 'month');
		this.datePickers.forEach((item, i) => {
			item.navigateTo(toNgbDate(moment(this.dateNavigation).add(i * nbMois, 'month')))
		});
	}
}
