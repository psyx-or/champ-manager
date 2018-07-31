import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Equipe } from "../model/Equipe";
import { RequeteService } from "../services/requete.service";
import { EquipeService } from "../services/equipe.service";
import { Observable } from "rxjs";

@Injectable()
export class EquipeResolver implements Resolve<Equipe> {

	constructor(
		private requeteService: RequeteService,
		private equipeService: EquipeService,
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Equipe> {
		const equipeId = +route.paramMap.get('equipeId');

		return this.requeteService.recupere(
			this.equipeService.get(equipeId)
		);
	}
}
