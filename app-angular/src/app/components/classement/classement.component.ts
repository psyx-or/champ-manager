import { Component, OnInit } from '@angular/core';
import { RequeteService } from '../../services/requete.service';
import { ClassementService } from '../../services/classement.service';
import { ActivatedRoute } from '@angular/router';
import { Championnat } from '../../model/Championnat';
import { Classement } from '../../model/Classement';
import { sort } from '../../utils/utils';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit {
	
	champ: Championnat = null;
	classements: Classement[];


	constructor(
		private route: ActivatedRoute,
		private requeteService: RequeteService,
		private classementService: ClassementService
	) { }

	ngOnInit() {
		const champId = +this.route.snapshot.paramMap.get('champId');

		this.requeteService.requete(
			this.classementService.get(champId),
			champ => {
				this.champ = champ;
				this.classements = sort(champ.classements, 'position');
			}
		);
	}
}
