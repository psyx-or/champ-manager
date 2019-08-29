import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ParametreService } from 'projects/commun/src/app/services/parametre.service';
import { Parametre } from 'projects/commun/src/app/model/Parametre';

@Injectable()
export class ParametresResolver implements Resolve<Parametre[]> {

	constructor(
		private parametreService: ParametreService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Parametre[]> {
		return this.parametreService.liste();
	}
}
