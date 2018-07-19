import { ModalComponent } from "./components/modal/modal.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { SportResolver } from "./utils/sports.resolver";

@NgModule({
	declarations: [
		ModalComponent,
	],
	imports: [
		BrowserModule,
		NgbModule.forRoot(),
		HttpClientModule,
	],
	providers: [
		SportResolver,
	],
	entryComponents: [
		ModalComponent,
	],
	exports: [
		ModalComponent,
	]
})
export class CommunModule { }
