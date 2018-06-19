import { Component, OnInit } from '@angular/core';
import { RequeteService } from '../../services/requete.service';
import { ClassementService } from '../../services/classement.service';
import { ActivatedRoute } from '@angular/router';
import { Championnat } from '../../model/Championnat';
import { Classement } from '../../model/Classement';
import { sort } from '../../utils/utils';
import { Equipe } from '../../model/Equipe';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit {
	
	champ: Championnat = null;
	classements: Classement[];


	/**
	 * Constructeur
	 * @param route 
	 * @param requeteService 
	 * @param classementService 
	 */
	constructor(
		private route: ActivatedRoute,
		private requeteService: RequeteService,
		private classementService: ClassementService
	) { }

	/**
	 * Initialisation
	 */
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

	/**
	 * Modification des points de pénalité
	 */
	submit() {
		this.requeteService.requete(
			this.classementService.maj(this.champ, this.classements),
			champ => {
				this.champ = champ;
				this.classements = sort(champ.classements, 'position');
			}
		);
	}

	/**
	 * Remplace une équipe par une autre
	 * @param equipe
	 */
	change(equipe: Equipe): void {
		// TODO
	}
}
