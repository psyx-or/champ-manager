import { Injectable } from "@angular/core";
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RequeteService } from "../services/requete.service";
import { MatchService } from "../services/match.service";
import { Championnat } from "../model/Championnat";

@Injectable()
export class MatchesResolver implements Resolve<Championnat> {

	constructor(
		private requeteService: RequeteService,
		private matchService: MatchService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championnat> {
		const champId = +route.paramMap.get('champId');

		return this.requeteService.recupere(
			this.matchService.liste(champId),
		);
	}
}
