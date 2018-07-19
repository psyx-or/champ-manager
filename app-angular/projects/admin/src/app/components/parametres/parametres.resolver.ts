import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RequeteService } from '../../services/requete.service';
import { Parametre } from '../../model/Parametre';
import { ParametreService } from '../../services/parametre.service';

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
