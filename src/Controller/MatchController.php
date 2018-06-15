<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use App\Entity\Championnat;
use App\Entity\Journee;


/**
 * @Route("/api")
 */
class MatchController extends CMController
{
    /**
     * @Route("/match/hierarchie/{id}")
     * @Method("GET")
     */
    public function hierarchie(Championnat $championnat)
    {
		$repository = $this->getDoctrine()->getRepository(Journee::class);
		$journee = $repository->findBy(array('championnat' => $championnat, 'numero' => "-1"));

        return $this->groupJson($journee[0], 'simple', 'hierarchie');
	}
	
    /**
     * @Route("/match/{id}")
     * @Method("GET")
     */
    public function liste(Championnat $championnat)
    {
        return $this->groupJson($championnat, 'simple', 'matches');
    }
}
