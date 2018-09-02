import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ParametreService } from 'projects/commun/src/app/services/parametre.service';
import { map } from 'rxjs/operators';

@Injectable()
export class DureeSaisieParamResolver implements Resolve<Number> {

	constructor(
		private requeteService: RequeteService,
		private parametreService: ParametreService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Number> {
		return this.requeteService.recupere(
			this.parametreService.get("DUREE_SAISIE").pipe(
				map(p => parseInt(p))
			)
		);
	}
}
