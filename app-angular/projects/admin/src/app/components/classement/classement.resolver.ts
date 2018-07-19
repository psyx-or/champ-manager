import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Championnat } from 'projects/commun/src/app/model/Championnat';
import { Observable } from 'rxjs';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';
import { ClassementService } from '../../services/classement.service';

@Injectable()
export class ClassementResolver implements Resolve<Championnat> {

	constructor(
		private requeteService: RequeteService,
		private classementService: ClassementService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championnat> {
		const champId = +route.paramMap.get('champId');

		return this.requeteService.recupere(
			this.classementService.get(champId)
		);
	}
}
