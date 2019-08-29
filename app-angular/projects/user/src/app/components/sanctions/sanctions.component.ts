import { Component, OnInit } from '@angular/core';
import { menus } from '../../utils/menus';
import { Sport } from '@commun/src/app/model/Sport';
import { Sanction } from '@commun/src/app/model/Sanction';
import { ActivatedRoute } from '@angular/router';
import { SanctionService } from '@commun/src/app/services/sanction.service';

@Component({
  selector: 'app-sanctions',
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.css']
})
export class SanctionsComponent implements OnInit {

	menu = menus.sanctions;
	sports: Sport[];
	selSport: Sport;
	sanctions: Sanction[];

	constructor(
		private route: ActivatedRoute,
		private sanctionService: SanctionService,
	) { }

	/**
	 * Initialisation
	 */
	ngOnInit() {
		this.route.data
			.subscribe((data: { sports: Sport[] }) => this.sports = data.sports);
	}

	/**
	 * Sélection d'un sport
	 */
	selectionSport(): void {
		this.sanctionService.get(this.selSport).subscribe(
			sanctions => this.sanctions = sanctions
		);
	}

}
