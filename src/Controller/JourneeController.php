<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Championnat;


/**
 * @Route("/api")
 */
class JourneeController extends CMController
{
	/**
	 * @Route("/journee/{id}", methods={"GET"})
	 */
    public function liste(Championnat $championnat)
    {
        return $this->groupJson($championnat, 'simple', 'journees');
	}

	/**
	 * @Route("/journee/{id}", methods={"PUT"})
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
