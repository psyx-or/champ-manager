import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ParametreService } from 'projects/commun/src/app/services/parametre.service';

@Injectable()
export class DureeSaisieParamResolver implements Resolve<Number> {

	constructor(
		private parametreService: ParametreService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Number> {
		return this.parametreService.getInt("DUREE_SAISIE");
	}
}
