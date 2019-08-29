import { Directive, ElementRef, Input } from '@angular/core';
import { LoadingInterceptor } from './loading.interceptor';

@Directive({
	selector: '[appLoadDisable]'
})
export class LoadDisableDirective {

	@Input("appLoadDisable") set additionalCondition(value: boolean) {
		this._additionalCondition = value;
		this.update();
	}

	private _chargement: boolean = false;
	private _additionalCondition: boolean = false;

	constructor(
		private el: ElementRef<HTMLButtonElement>
	) {
		LoadingInterceptor.getChargement().subscribe(
			val => {
				this._chargement = val;
				this.update();
			}
		);
	}

	/**
	 * Grise le bouton si un chargement est en cours ou si la condition additionnelle n'est pas remplie
	 */
	private update() {
		this.el.nativeElement.disabled = this._chargement || this._additionalCondition;
	}
}
