import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Championnat } from '@commun/src/app/model/Championnat';
import { ActivatedRoute } from '@angular/router';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Match } from '@commun/src/app/model/Match';
import { toDisp } from '@commun/src/app/utils/utils';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

	menu = menus.equipe;
	equipe: Equipe;
	championnats: ChampionnatExt[];

	constructor(
		private route: ActivatedRoute,
		private sanitizer: DomSanitizer,
	) { }

	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe, championnats: ChampionnatExt[] }) => {
				this.equipe = data.equipe;
				this.championnats = data.championnats;
				this.championnats.forEach(c => {
					c.matches = c.journees.map(j => { j.matches[0].journee = j; return j.matches[0]; });

					// TODO: gérer les créneaux
					c.calendrier = this.sanitizer.bypassSecurityTrustUrl(encodeURI(
						'data:text/calendar;charset=utf8,' + [
							'BEGIN:VCALENDAR',
							'VERSION:2.0',
							'NAME:' + c.nom,
							c.matches.map(toDisp).map( m => [
								'BEGIN:VEVENT',
								'URL:' + document.URL,
								'DTSTART:' + (m.journee.debut && m.journee.debut.toString().replace(/-|:|\.\d+/g, '') || ''),
								'DTEND:' + (m.journee.fin && m.journee.fin.toString().replace(/-|:|\.\d+/g, '') || ''),
								'SUMMARY:' + (m.dispEquipe1 + " - " + m.dispEquipe2),
								'DESCRIPTION:' + (c.nom),
								'LOCATION:' + (m.equipe1 && m.equipe1.terrain || ''),
								'END:VEVENT'].join("\n")).join("\n"),
							'END:VCALENDAR'
						].join('\n')));
				});
			}
		);
	}
}
