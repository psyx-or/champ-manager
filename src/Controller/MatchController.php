<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Championnat;
use App\Entity\Journee;
use App\Entity\Match;
use App\Entity\Sport;
use App\Outils\MatchFunctions;
use App\Entity\Equipe;
use App\Outils\Mail;
use App\Entity\Parametre;


/**
 * @Route("/api")
 */
class MatchController extends CMController
{
	/**
	 * @Route("/match/hierarchie/{id}", methods={"GET"})
	 */
    public function hierarchie(Championnat $championnat)
    {
		$repository = $this->getDoctrine()->getRepository(Journee::class);
		$journee = $repository->findBy(['championnat' => $championnat, 'numero' => "-1"]);

        return $this->groupJson($journee[0], 'simple', 'hierarchie');
	}

	/**
	 * @Route("/match/hierarchie/equipe/{id}", methods={"GET"})
	 */
    public function hierarchiesEquipe(Equipe $equipe, Request $request, EntityManagerInterface $entityManager)
    {
		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT j
			 FROM App\Entity\Journee j
			 JOIN j.championnat c
			 JOIN c.journees j1
			 JOIN j1.matches m 
			 LEFT JOIN m.equipe1 e1 LEFT JOIN m.equipe2 e2
			 WHERE c.saison = :saison
			   AND (m.equipe1 = :equipe OR m.equipe2 = :equipe)
			   AND j.numero = -1
			 ORDER BY c.id DESC"
		);

		$query->setParameter("saison", $saison);
		$query->setParameter("equipe", $equipe);

        return $this->groupJson($query->getResult(), 'simple', 'hierarchie');
	}

	/**
	 * @Route("/match/avalider", methods={"GET"})
	 * @IsGranted("ROLE_CHAMP")
	 */
	public function aValider(Request $request, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
	{
		$champId = null;
		if (false === $authChecker->isGranted('ROLE_ADMIN')) {
			$champId = $this->getUser()->getId();
		}

		$sport = $request->query->get('sport');

		$query = $entityManager->createQuery(
			"SELECT c, j, m, e1, e2 
			 FROM App\Entity\Championnat c
			 JOIN c.journees j 
			 JOIN j.matches m 
			 JOIN m.equipe1 e1 JOIN m.equipe2 e2
			 WHERE m.valide = 0
			   AND (:sport IS NULL OR c.sport = :sport)
			   AND (:champId IS NULL OR c.id = :champId)
		");
		
		$query->setParameter("sport", $sport);
		$query->setParameter("champId", $champId);

		return $this->groupJson($query->getResult(), 'simple', 'matches', 'fp', 'alerte');
	}

	/**
	 * @Route("/match/equipe/{id}", methods={"GET"})
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
	 * @Route("/match/{id}", requirements={"id"="\d+"}, methods={"GET"})
	 */
    public function liste(Championnat $championnat, AuthorizationCheckerInterface $authChecker)
    {
		$groupes = array('simple', 'matches');
		if (true === $authChecker->isGranted('ROLE_ADMIN') || 
			true === $authChecker->isGranted('ROLE_CHAMP') && $championnat->getId() == $this->getUser()->getId()) 
		{
			array_push($groupes, 'fp');
		}

        return $this->groupJson($championnat, ...$groupes);
	}

	/**
	 * @Route("/match/{feuille}", methods={"GET"})
	 * @Security("is_granted('ROLE_USER') or is_granted('ROLE_CHAMP')")
	 */
	public function getFeuille(string $feuille)
	{
		return $this->file($this->getParameter('rep_feuilles')."/".basename($feuille));
	}


	/**
	 * @Route("/match/{id}", methods={"PATCH"})
	 * @IsGranted("ROLE_CHAMP")
	 */
    public function valide(Match $match, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
    {
		if (false === $authChecker->isGranted('ROLE_ADMIN')) 
		{
			if ($match->getJournee()->getChampionnat()->getId() != $this->getUser()->getId())
				throw $this->createAccessDeniedException();
		}

		if (($match->getScore1() !== null || $match->getForfait1()) && ($match->getScore2() !== null || $match->getForfait2()))
			$match->setValide(true);

		$entityManager->flush();

        return $this->groupJson($match, 'simple');
	}

	/**
	 * @Route("/match/{id}/report", methods={"PATCH"})
	 * @ParamConverter("match", converter="doctrine.orm")
	 * @ParamConverter("date", converter="cm_converter", options={"classe":""})
	 * @IsGranted("ROLE_CHAMP")
	 */
    public function reporte(Match $match, string $date, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
    {
		if (false === $authChecker->isGranted('ROLE_ADMIN')) 
		{
			if ($match->getJournee()->getChampionnat()->getId() != $this->getUser()->getId())
				throw $this->createAccessDeniedException();
		}

		$match->setDateReport(new \DateTime($date));

		$entityManager->flush();

        return $this->groupJson($match, 'simple');
	}

	/**
	 * @Route("/match/", methods={"POST"})
	 * @IsGranted("ROLE_USER")
	 */
	public function maj(Request $request, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
	{
		$match = new Match();
		$match->setId($request->request->get('id'));
		$match->setForfait1($request->request->get('forfait1') == "true");
		$match->setForfait2($request->request->get('forfait2') == "true");

		if (!$match->getForfait1() && $request->request->has('score1'))
			$match->setScore1($request->request->get('score1'));
		if (!$match->getForfait2() && $request->request->has('score2'))
			$match->setScore2($request->request->get('score2'));

		$this->majMatchFeuille($request, $match);

		return $this->majListe(array($match), $entityManager, $authChecker);
	}

	/**
	 * @Route("/match/{id}/feuille", methods={"POST"})
	 * @ParamConverter("match", converter="doctrine.orm")
	 * @IsGranted("ROLE_CHAMP")
	 */
	public function majFeuille(Match $match, Request $request, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
	{
		if (false === $authChecker->isGranted('ROLE_ADMIN')) 
		{
			if ($match->getJournee()->getChampionnat()->getId() != $this->getUser()->getId())
			throw $this->createAccessDeniedException();
		}

		$this->majMatchFeuille($request, $match);

		$entityManager->flush();

		return $this->json($match->getFeuille());
	}

	/**
	 * Enregistre la feuille de match sur le disque et met à jour l'entité
	 */
	private function majMatchFeuille(Request $request, Match $match)
	{
		if ($request->files->has("feuille"))
		{
			$fichier = $request->files->get("feuille");
			$nom = "feuille_".$match->getId().".".$fichier->getClientOriginalExtension();

			$fichier->move($this->getParameter('rep_feuilles'),	$nom);

			$match->setFeuille($nom);
		}
	}

	/**
	 * @Route("/match/", methods={"PUT"})
	 * @IsGranted("ROLE_CHAMP")
	 * @ParamConverter("matches", converter="cm_converter", options={"classe":"App\Entity\Match[]"})
	 */
	public function majListe(array $matches, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker) 
	{
		$res = array();
		$repository = $this->getDoctrine()->getRepository(Match::class);
		$champ = null;

		$repositoryParam = $this->getDoctrine()->getRepository(Parametre::class);
		$dureeSaisie = $repositoryParam->find(Parametre::DUREE_SAISIE)->getValeur();

		foreach ($matches as $match) 
		{
			$entity = $repository->find($match->getId());

			// Petits contrôles pour les petits malins
			if (false === $authChecker->isGranted('ROLE_ADMIN')) 
			{
				if (true === $authChecker->isGranted('ROLE_USER')) 
				{
					if ($entity->getEquipe1()->getId() != $this->getUser()->getId() && $entity->getEquipe2()->getId() != $this->getUser()->getId())
						throw $this->createAccessDeniedException();
					if ($entity->getValide())
						throw $this->createAccessDeniedException();
					
					// Vérification de la date
					if (!MatchFunctions::verifieDateFin($entity, $dureeSaisie))
						throw $this->createAccessDeniedException();
				}
				else if (true === $authChecker->isGranted('ROLE_CHAMP')) 
				{
					if ($entity->getJournee()->getChampionnat()->getId() != $this->getUser()->getId())
						throw $this->createAccessDeniedException();
				}
				else
				{
					throw $this->createAccessDeniedException();
				}
			}

			array_push($res, $entity);
			$champ = $entity->getJournee()->getChampionnat();

			// Feuille de match
			if ($match->getFeuille() != null)
				$entity->setFeuille($match->getFeuille());

			// Si pas de modif, on passe
			if ($entity->getScore1() === $match->getScore1() && $entity->getScore2() === $match->getScore2() &&
				$entity->getForfait1() == $match->getForfait1() && $entity->getForfait2() == $match->getForfait2())
				continue;

			// Mise à jour du résultat
			$entity->setScore1($match->getScore1());
			$entity->setForfait1($match->getForfait1());
			$entity->setScore2($match->getScore2());
			$entity->setForfait2($match->getForfait2());
			if ($match->getScore1() !== null || $match->getScore2() !== null || $match->getForfait1() || $match->getForfait2())
			{
				$entity->setValide($authChecker->isGranted('ROLE_CHAMP') === true);

				// Petites vérifs
				if ($match->getScore1() === null && !$match->getForfait1())
					$entity->setScore1(0);
				if ($match->getScore2() === null && !$match->getForfait2())
					$entity->setScore2(0);

				if (false === $authChecker->isGranted('ROLE_CHAMP') && $entity->getDateSaisie() == null)
				{
					$entity->setDateSaisie(new \DateTime());

					// Envoi des mails d'avertissement pour remplir le fair-play
					if ($entity->getJournee()->getChampionnat()->getFpForm() != null && !$entity->getForfait1() && !$entity->getForfait2())
					{
						if ($entity->getFpFeuille1() == null)
							Mail::envoieMailFP($entity, $entity->getEquipe1(), $this->getDoctrine());
						if ($entity->getFpFeuille2() == null)
							Mail::envoieMailFP($entity, $entity->getEquipe2(), $this->getDoctrine());
					}
				}
			}
			else
			{
				// Annulation de saisie
				$entity->setValide(null);
				$entity->setFeuille(null);
				$entity->setDateSaisie(null);
				if ($entity->getFpFeuille1() != null)
					$entityManager->remove($entity->getFpFeuille1());
				if ($entity->getFpFeuille2() != null)
					$entityManager->remove($entity->getFpFeuille2());
			}

			// Si c'est un match de coupe, on met à jour le match suivant
			// avec l'équipe vainqueur
			if ($entity->getParent1() != null) 
				$entity->getParent1()->setEquipe1(MatchFunctions::getVainqueur($entity));

			if ($entity->getParent2() != null) 
				$entity->getParent2()->setEquipe2(MatchFunctions::getVainqueur($entity));
		}

		// Recalcul du classement des championnats
		if ($champ != null)
			MatchFunctions::calculeClassement($champ, $entityManager);

		$entityManager->flush();

		$groupes = array('simple');
		if (true === $authChecker->isGranted('ROLE_CHAMP')) 
		{
			array_push($groupes, 'fp');
		}

		return $this->groupJson($res, ...$groupes);
	}

	/**
	 * @Route("/match/{id}/inverse", methods={"PATCH"})
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
	 * @Route("/match/{nom}/doublons", methods={"GET"})
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function doublons(Sport $sport, Request $request, EntityManagerInterface $entityManager)
	{
		$saison = $request->query->get('saison');
		$nb = $request->query->get('nb');

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
			 HAVING count(m) >= :nb
			 ORDER BY j.debut, e.terrain"
		);

		$query->setParameter("sport", $sport);
		$query->setParameter("saison", $saison);
		$query->setParameter("nb", $nb);

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
