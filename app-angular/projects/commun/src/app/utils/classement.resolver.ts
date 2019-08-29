import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Championnat } from '../model/Championnat';
import { Observable } from 'rxjs';
import { ClassementService } from '../services/classement.service';

@Injectable()
export class ClassementResolver implements Resolve<Championnat> {

	constructor(
		private classementService: ClassementService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championnat> {
		const champId = +route.paramMap.get('champId');

		return this.classementService.get(champId);
	}
}
