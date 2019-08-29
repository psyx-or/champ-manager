import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { ParametreService } from 'projects/commun/src/app/services/parametre.service';

@Injectable()
export class SeuilsForfaitParamResolver implements Resolve<[Number,Number]> {

	constructor(
		private parametreService: ParametreService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[Number, Number]> {
		return forkJoin(
			this.parametreService.getInt("SEUIL_FORFAIT_WARN"),
			this.parametreService.getInt("SEUIL_FORFAIT_DANGER")
		);
	}
}
