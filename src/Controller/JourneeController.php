<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;

use App\Entity\Championnat;
use App\Entity\Journee;


/**
 * @Route("/api")
 */
class JourneeController extends CMController
{
    /**
     * @Route("/journee/{id}")
     */
    public function list(Championnat $championnat)
    {
        return $this->groupJson($championnat, 'simple', 'journees');
	}
	
    /**
     * @Route("/journee/{id}/{numero}")
     */
    public function detail(Championnat $championnat, $numero)
    {
        $repository = $this->getDoctrine()->getRepository(Journee::class);
		$journee = $repository->findBy(array('championnat' => $championnat, 'numero' => $numero));
        return $this->groupJson($journee, 'simple', 'matches');
    }
}
