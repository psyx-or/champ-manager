<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Equipe;
use App\Entity\Sport;
use Symfony\Component\HttpFoundation\Request;


/**
 * @Route("/api")
 */
class EquipeController extends CMController
{
    /**
     * @Route("/equipe/{nom}")
     * @Method("GET")
     */
    public function listeSport(Sport $sport)
    {
        $repository = $this->getDoctrine()->getRepository(Equipe::class);
        return $this->groupJson($repository->findBy(['sport' => $sport], ['nom' => 'ASC']), 'simple');
	}

	/**
	 * @Route("/equipe/{nom}/detail")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
    public function listeSportSaisonDetail(Sport $sport, Request $request, EntityManagerInterface $entityManager)
    {
		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT e
			 FROM App\Entity\Equipe e
			 JOIN e.classements classe
			 JOIN classe.championnat champ
			 WHERE champ.saison = :saison
			   AND champ.sport = :sport
			 ORDER BY e.nom");

		$query->setParameter("sport", $sport);
		$query->setParameter("saison", $saison);

        return $this->groupJson($query->getResult(), 'simple', 'coordonnees');
	}
}
