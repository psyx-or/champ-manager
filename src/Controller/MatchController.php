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
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use App\Entity\Equipe;


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

		return $this->groupJson($query->getResult(), 'simple', 'matches', 'fp');
	}

	/**
	 * @Route("/match/equipe/{id}")
	 * @Method("GET")
	 */
	public function listeEquipe(Equipe $equipe, Request $request, EntityManagerInterface $entityManager)
	{
		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT c, j, m
			 FROM App\Entity\Championnat c
			 JOIN c.journees j 
			 JOIN j.matches m 
			 WHERE c.saison = :saison
			   AND (m.equipe1 = :equipe OR m.equipe2 = :equipe)
			 ORDER BY c.id DESC, j.numero");
		
		$query->setParameter("saison", $saison);
		$query->setParameter("equipe", $equipe);

		return $this->groupJson($query->getResult(), 'simple', 'matches', 'coordonnees', 'hasfp');
	}
	
    /**
     * @Route("/match/{id}")
     * @Method("GET")
     */
    public function liste(Championnat $championnat, AuthorizationCheckerInterface $authChecker)
    {
		$groupes = array('simple', 'matches');
		if (true === $authChecker->isGranted('ROLE_ADMIN')) {
			array_push($groupes, 'fp');
		}

        return $this->groupJson($championnat, ...$groupes);
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
				$entity->getParent1()->setEquipe1(MatchFunctions::getVainqueur($entity));

			if ($entity->getParent2() != null) 
				$entity->getParent2()->setEquipe2(MatchFunctions::getVainqueur($entity));
		}

		// Recalcul du classement des championnats
		if ($champ != null && $champ->getType() != ChampionnatType::COUPE)
			MatchFunctions::calculeClassement($champ, $entityManager);

		$entityManager->flush();

		return $this->groupJson($res, 'simple');
	}

	/**
	 * @Route("/match/{id}/inverse")
	 * @Method("PATCH")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function inverse(Match $match, EntityManagerInterface $entityManager)
	{
		$equipe1 = $match->getEquipe1();
		$equipe2 = $match->getEquipe2();

		// On inverse le match
		$match->setEquipe1($equipe2);
		$match->setEquipe2($equipe1);

		// On recherche le match retour
		$query = $entityManager->createQuery(
			"SELECT m
			 FROM App\Entity\Match m
			 JOIN m.journee j
			 WHERE j.championnat = :championnat
			   AND m.equipe1 = :equipe1
			   AND m.equipe2 = :equipe2"
		);

		$query->setParameter("championnat", $match->getJournee()->getChampionnat());
		$query->setParameter("equipe1", $equipe2);
		$query->setParameter("equipe2", $equipe1);

		// On l'inverse aussi
		foreach ($query->getResult() as $match2)
		{
			// En vrai, 0 ou 1 match
			$match2->setEquipe1($equipe1);
			$match2->setEquipe2($equipe2);
		}

		$entityManager->flush();

		return $this->json("ok");
	}

	/**
	 * @Route("/match/{nom}/doublons")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function doublons(Sport $sport, Request $request, EntityManagerInterface $entityManager)
	{
		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT e.terrain, j.debut
			 FROM App\Entity\Match m
			 JOIN m.journee j
			 JOIN j.championnat c
			 JOIN m.equipe1 e
			 WHERE c.sport = :sport
			   AND c.saison = :saison
			   AND m.equipe2 IS NOT NULL
			   AND e.terrain IS NOT NULL
			   AND j.debut IS NOT NULL
			 GROUP BY e.terrain, j.debut
			 HAVING count(m)>2
			 ORDER BY j.debut, e.terrain"
		); // TODO: paramètre pour 2?

		$query->setParameter("sport", $sport);
		$query->setParameter("saison", $saison);

		$resultat = array();
		foreach ($query->getResult() as $doublon)
		{
			$query2 = $entityManager->createQuery(
				"SELECT m
				 FROM App\Entity\Match m
				 JOIN m.journee j
				 JOIN m.equipe1 e
				 WHERE j.debut = :debut
				   AND e.terrain = :terrain
				   AND m.equipe2 IS NOT NULL"
			);

			$query2->setParameter("debut", $doublon["debut"]);
			$query2->setParameter("terrain", $doublon["terrain"]);
			
			array_push($resultat, array("debut" => $doublon["debut"], "matches" => $query2->getResult()));
		}

		return $this->groupJson($resultat, "simple", "doublon");
	}
}
