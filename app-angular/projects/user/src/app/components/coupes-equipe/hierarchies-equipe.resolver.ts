import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Journee } from "@commun/src/app/model/Journee";
import { MatchService } from "@commun/src/app/services/match.service";

@Injectable()
export class HierarchiesEquipeResolver implements Resolve<Journee[]> {

	constructor(
		private matchService: MatchService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Journee[]> {
		const equipeId = +route.paramMap.get('equipeId');

		return this.matchService.getHierarchies(equipeId);
	}
}
