import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ParametreService } from 'projects/commun/src/app/services/parametre.service';

@Injectable()
export class SeuilsForfaitParamResolver implements Resolve<[Number,Number]> {

	constructor(
		private requeteService: RequeteService,
		private parametreService: ParametreService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[Number, Number]> {
		return this.requeteService.recupere(
			forkJoin(
				this.parametreService.getInt("SEUIL_FORFAIT_WARN"),
				this.parametreService.getInt("SEUIL_FORFAIT_DANGER")
			)
		);
	}
}
