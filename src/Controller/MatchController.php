<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

use App\Entity\Championnat;
use App\Entity\Journee;
use App\Entity\Match;
use App\Entity\Sport;
use Doctrine\ORM\EntityManagerInterface;
use App\Outils\MatchFunctions;
use App\Entity\ChampionnatType;


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
		$journee = $repository->findBy(['championnat' => $championnat, 'numero' => "-1"]);

        return $this->groupJson($journee[0], 'simple', 'hierarchie');
	}

	/**
	 * @Route("/match/avalider/{nom}")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function aValider(Sport $sport, EntityManagerInterface $entityManager)
	{
		$query = $entityManager->createQuery(
			"SELECT c, j, m, e1, e2 
			 FROM App\Entity\Championnat c
			 JOIN c.journees j 
			 JOIN j.matches m 
			 JOIN m.equipe1 e1 JOIN m.equipe2 e2
			 WHERE m.valide = 0 AND c.sport = :sport");
		
		$query->setParameter("sport", $sport);

		return $this->groupJson($query->getArrayResult(), 'simple', 'matches');
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

		// TODO: passer à terminé?

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
		$champ = null;

		foreach ($matches as $match) 
		{
			$entity = $repository->find($match->getId());
			array_push($res, $entity);
			$champ = $entity->getJournee()->getChampionnat();

			// Si pas de modif, on passe
			if ($entity->getScore1() == $match->getScore1() && $entity->getScore2() == $match->getScore2() &&
				$entity->getForfait1() == $match->getForfait1() && $entity->getForfait2() == $match->getForfait2())
				continue;

			// Mise à jour du résultat
			$entity->setScore1($match->getScore1());
			$entity->setForfait1($match->getForfait1());
			$entity->setScore2($match->getScore2());
			$entity->setForfait2($match->getForfait2());
			if ($match->getScore1() != null || $match->getScore2() != null || $match->getForfait1() || $match->getForfait2())
				$entity->setValide(true);
			else
				$entity->setValide(null);

			// TODO: date saisie && remplissage feuille de fair-play && feuille de match

			// Si c'est un match de coupe, on met à jour le match suivant
			// avec l'équipe vainqueur
			if ($entity->getParent1() != null) 
			{
				$entity->getParent1()->setEquipe1(MatchFunctions::getVainqueur($entity));
				$entityManager->merge($entity->getParent1());
			}
			if ($entity->getParent2() != null) 
			{
				$entity->getParent2()->setEquipe2(MatchFunctions::getVainqueur($entity));
				$entityManager->merge($entity->getParent2());
			}

			$entityManager->merge($entity);
		}

		// TODO: passer le championnat à terminé

		// Recalcul du classement des championnats
		if ($champ != null && $champ->getType() != ChampionnatType::COUPE)
			MatchFunctions::calculeClassement($champ, $entityManager);

		$entityManager->flush();

		return $this->groupJson($res, 'simple');
	}
}
