<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Ajoute des méthodes utilitaires pour les controlleurs
 */
class CMController extends Controller {

	/**
	 * Surcharge de la méthode json() pour ajouter uniquement la notion de groupe pour la sérialisation
	 */
	public function groupJson($obj, ...$groups) {
        return $this->json($obj, 200, array(), array('groups' => $groups));		
	}

}
