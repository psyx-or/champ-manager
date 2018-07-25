
/**
 * Un élément de menu
 */
export class MenuItem {
	route: string;
	icone?: string;
	titre: string;
	cond?: (c: any) => boolean;
}

/**
 * Un menu complet
 */
export class Menu {
	titre: ((c: any) => string) | string;
	icone?: string;
	items: MenuItem[];
}
