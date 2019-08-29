import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ClassementService } from "@commun/src/app/services/classement.service";
import { ChampionnatEquipeDTO } from "@commun/src/app/model/ChampionnatEquipeDTO";

@Injectable()
export class HistoriqueEquipeResolver implements Resolve<ChampionnatEquipeDTO> {

	constructor(
		private classementService: ClassementService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChampionnatEquipeDTO> {
		const equipeId = +route.paramMap.get('equipeId');

		return this.classementService.getHistoriqueEquipe(equipeId);
	}
}
