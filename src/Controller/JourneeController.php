<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use App\Entity\Championnat;
use App\Entity\Journee;


/**
 * @Route("/api")
 */
class JourneeController extends Controller
{
    /**
     * @Route("/journee/{id}")
     */
    public function list(Championnat $championnat)
    {
        return $this->json($championnat->listeJournees(), 200, array(), array('groups' => array('simple')));
	}
	
    /**
     * @Route("/journee/{id}/{numero}")
     */
    public function detail(Championnat $championnat, $numero)
    {
        $repository = $this->getDoctrine()->getRepository(Journee::class);
		$journee = $repository->findBy(array('championnat' => $championnat, 'numero' => $numero));
        return $this->json($journee, 200, array(), array('groups' => array('simple', 'matches')));
    }
}
