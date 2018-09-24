import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Championnat } from '@commun/src/app/model/Championnat';
import { ActivatedRoute } from '@angular/router';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Match } from '@commun/src/app/model/Match';
import { toDisp } from '@commun/src/app/utils/utils';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Creneau } from '@commun/src/app/model/Creneau';
import * as moment from 'moment';

class ChampionnatExt extends Championnat {
	matches: Match[];
	calendrier: SafeUrl;
}

@Component({
	selector: 'app-matches-equipe',
	templateUrl: './matches-equipe.component.html',
	styleUrls: ['./matches-equipe.component.css']
})
export class MatchesEquipeComponent implements OnInit {

	// TODO: mise en relief des matches concernant son équipe!

	menu = menus.equipe;
	equipe: Equipe;
	championnats: ChampionnatExt[];

	constructor(
		private route: ActivatedRoute,
		private sanitizer: DomSanitizer,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe, championnats: ChampionnatExt[] }) => {
				this.equipe = data.equipe;
				this.championnats = data.championnats;
				this.championnats.forEach(c => {
					c.matches = c.journees.map(j => { j.matches[0].journee = j; return j.matches[0]; });

					c.calendrier = this.sanitizer.bypassSecurityTrustUrl(encodeURI(
						'data:text/calendar;charset=utf8,' + this.createCalendar(c)));
				});
			}
			);
	}

	/**
	 * Création d'un calendrier au format iCal
	 * @param c 
	 */
	private createCalendar(c: ChampionnatExt): string {
		return `
BEGIN:VCALENDAR
VERSION:2.0
X-WR-CALNAME:${c.sport.nom} - ${c.nom}
X-WR-TIMEZONE:Europe/Paris
${this.createMatches(c)}
END:VCALENDAR
		`.trim()
	}

	/**
	 * Création de la liste des événements du calendrier
	 * @param champ 
	 */
	private createMatches(champ: ChampionnatExt): string {
		let events = new Array<string>();

		champ.matches
			.filter(m => m.exempt == null && m.journee.debut != null)
			.map(toDisp)
			.forEach(m => {
				if (m.equipe1 && m.equipe1.creneaux && m.equipe1.creneaux.length > 0)
					m.equipe1.creneaux.forEach(c => events.push(this.createMatch(champ, m, c)));
				else
					events.push(this.createMatch(champ, m, null));
			});

		return events.join("\n");
	}

	/**
	 * Création d'un événement
	 * @param champ 
	 * @param m 
	 * @param c 
	 */
	private createMatch(champ: ChampionnatExt, m: Match, c: Creneau): string {
		let deb, fin, terrain, prefixe = '';

		if (c && m.equipe1.creneaux.length > 1)
			prefixe = "[A confirmer] ";

		if (!m.equipe1) {
			deb = moment(m.journee.debut);
			fin = moment(m.journee.fin);
			terrain = "A décider";
		}
		else if (!m.equipe1.terrain) {
			deb = moment(m.journee.debut);
			fin = moment(m.journee.fin);
			terrain = "Pas de terrain";
		}
		else {
			deb = moment(m.journee.debut).add(c.jour, 'days').add(moment(c.heure).hours(), 'hours').add(moment(c.heure).minutes(), 'minutes');
			fin = moment(deb).add(3, 'hours');
			terrain = m.equipe1.terrain.replace("\n", ", ");
		}

		return `
BEGIN:VEVENT
UID:${m.id}
URL:${document.URL}
DTSTART:${deb.format('YYYYMMDDTHHmmss[Z]')}
DTEND:${fin.format('YYYYMMDDTHHmmss[Z]')}
SUMMARY:${prefixe}${m.dispEquipe1} - ${m.dispEquipe2} (${champ.nom})
LOCATION:${terrain},
END:VEVENT
		`.trim();
	}
}
