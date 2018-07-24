import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

	DEPLOY_PATH = environment.DEPLOY_PATH;
	
	constructor() { }

	ngOnInit() {
	}

}
