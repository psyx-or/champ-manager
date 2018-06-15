import { Pipe, PipeTransform } from '@angular/core';
import { Journee } from '../model/Journee';


/**
 * Calcule le libellé associé à une journée
 */
@Pipe({
  name: 'strJournee'
})
export class StrJourneePipe implements PipeTransform {

	transform(value: Journee): any {

		if (value.numero > 0) return "Journée " + value.numero;
		if (value.numero == -1) return "Finale";
		return "1/" + 2 ** (-value.numero - 1) + " Finale";
	}
}
