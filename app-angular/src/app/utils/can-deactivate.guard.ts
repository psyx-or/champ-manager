import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { NgbModalOptions, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalConfirmComponent } from "../components/modal-confirm/modal-confirm.component";

/**
 * Interface pour les composants utilisant ce guard
 */
export interface CanComponentDeactivate {
	canDeactivate(): boolean;
}

/**
 * Guard vérifiant si des modifications sont en cours
 */
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

	constructor(
		public modalService: NgbModal,
	) {}

	canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
		return component.canDeactivate() ? true : new Promise((resolve,reject)=>{
			let options: NgbModalOptions = { centered: true, backdrop: 'static' };

			const modal = this.modalService.open(ModalConfirmComponent, options);
			modal.result.then(() => resolve(true), () => resolve(false));
		});
	}
}
