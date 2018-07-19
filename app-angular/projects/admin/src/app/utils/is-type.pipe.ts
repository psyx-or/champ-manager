import { Pipe, PipeTransform } from '@angular/core';

/**
 * Vérifie si l'objet a le type indiqué
 */
@Pipe({
  name: 'isType'
})
export class IsTypePipe implements PipeTransform {

	transform(value: any, arg: string): boolean {
    	return typeof value == arg;
	}

}
