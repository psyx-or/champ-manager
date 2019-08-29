import { Injectable } from "@angular/core";
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { MatchService } from "../services/match.service";
import { Championnat } from "../model/Championnat";

@Injectable()
export class MatchesResolver implements Resolve<Championnat> {

	constructor(
		private matchService: MatchService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championnat> {
		const champId = +route.paramMap.get('champId');

		return this.matchService.liste(champId);
	}
}
