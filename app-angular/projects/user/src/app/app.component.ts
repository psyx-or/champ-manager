import { Component } from '@angular/core';
import { RequeteService } from 'projects/commun/src/app/services/requete.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
	constructor(
		public requeteService: RequeteService,
	){}
}
