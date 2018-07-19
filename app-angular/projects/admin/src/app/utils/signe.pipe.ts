import { Pipe, PipeTransform } from '@angular/core';

/**
 * Ajoute le signe "+" pour les nombres positifs
 */
@Pipe({
  name: 'signe'
})
export class SignePipe implements PipeTransform {

	transform(value: number): any {
		return value > 0 ? "+" + value : value;
	}

}
