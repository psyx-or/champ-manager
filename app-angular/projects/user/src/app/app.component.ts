import { Component } from '@angular/core';
import { LoadingInterceptor } from '@commun/src/app/utils/loading.interceptor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
	/** Indique si un chargement est en cours */
	chargement: boolean = false;

	constructor(
	) {
		LoadingInterceptor.getChargement().subscribe(
			val => this.chargement = val
		)
	}
}
