<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Championnat;
use App\Entity\Journee;


/**
 * @Route("/api")
 */
class JourneeController extends CMController
{
    /**
     * @Route("/journee/{id}")
     * @Method("GET")
     */
    public function list(Championnat $championnat)
    {
        return $this->groupJson($championnat, 'simple', 'journees');
	}
	
    /**
     * @Route("/journee/{id}/{numero}")
     * @Method("GET")
     */
    public function detail(Championnat $championnat, $numero)
    {
        $repository = $this->getDoctrine()->getRepository(Journee::class);
		$journee = $repository->findBy(array('championnat' => $championnat, 'numero' => $numero));
        return $this->groupJson($journee, 'simple', 'matches');
    }
	
    /**
     * @Route("/journee/{id}")
     * @Method("PUT")
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("championnat", converter="doctrine.orm")
	 * @ParamConverter("journees", converter="cm_converter", options={"classe":"App\Entity\Journee[]"})
     */
    public function majCalendrier(Championnat $championnat, array $journees, EntityManagerInterface $entityManager)
    {
		foreach ($journees as $journee) 
		{
			$journee->setChampionnat($championnat);
			$entityManager->merge($journee);
		}

		$entityManager->flush();

        return $this->json("ok");
    }
}
