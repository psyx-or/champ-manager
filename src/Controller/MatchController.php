<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

use App\Entity\Championnat;
use App\Entity\Journee;
use App\Entity\Match;
use Doctrine\ORM\EntityManagerInterface;


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

	/**
	 * @Route("/match/{id}")
	 * @Method("PATCH")
	 * @IsGranted("ROLE_ADMIN")
	 */
    public function valide(Match $match, EntityManagerInterface $entityManager)
    {
		if ($match->getScore1() != null && $match->getScore2() != null)
			$match->setValide(true);

		$entityManager->merge($match);
		$entityManager->flush();

        return $this->groupJson($match, 'simple');
	}

	/**
	 * @Route("/match/")
	 * @Method("PUT")
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("matches", converter="cm_converter", options={"classe":"App\Entity\Match[]"})
	 */
	public function maj(array $matches, EntityManagerInterface $entityManager) 
	{
		$res = array();
		$repository = $this->getDoctrine()->getRepository(Match::class);
		foreach ($matches as $match) 
		{
			$entity = $repository->find($match->getId());
			array_push($res, $entity);

			if ($entity->getScore1() == $match->getScore1() && $entity->getScore2() == $match->getScore2())
				continue;

			$entity->setScore1($match->getScore1());
			$entity->setForfait1($match->getForfait1());
			$entity->setScore2($match->getScore2());
			$entity->setForfait2($match->getForfait2());
			$entity->setValide(true);
			// TODO: date saisie && remplissage feuille de fair-play
			// TODO: Gestion du vainqueur en cas de coupe

			$entityManager->merge($entity);
			$entityManager->flush();
		}

		// TODO: maj classsement

		return $this->groupJson($res, 'simple');
	}
}
