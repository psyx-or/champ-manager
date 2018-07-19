import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RequeteService } from "../../services/requete.service";
import { Observable } from "rxjs";
import { Journee } from "../../model/Journee";
import { MatchService } from "../../services/match.service";

@Injectable()
export class HierarchieResolver implements Resolve<Journee> {

	constructor(
		private requeteService: RequeteService,
		private matchService: MatchService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Journee> {
		const champId = +route.paramMap.get('champId');

		return this.requeteService.recupere(
			this.matchService.getHierarchie(champId)
		);
	}
}
