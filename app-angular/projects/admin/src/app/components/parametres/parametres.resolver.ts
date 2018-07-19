import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ParametreService } from '../../services/parametre.service';
import { Parametre } from 'projects/commun/src/app/model/Parametre';

@Injectable()
export class ParametresResolver implements Resolve<Parametre[]> {

	constructor(
		private requeteService: RequeteService,
		private parametreService: ParametreService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Parametre[]> {
		return this.requeteService.recupere(
			this.parametreService.liste()
		);
	}
}
