<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Sport;
use App\Entity\Championnat;
use App\Entity\ChampionnatType;
use App\Entity\Equipe;
use App\Entity\Classement;
use App\Entity\Journee;
use App\Entity\Match;
use App\DTO\ChampCreationDTO;
use App\Outils\MatchFunctions;
use App\Outils\Calendrier;
use App\Entity\FPForm;
use App\Entity\ChampModele;

/**
 * @Route("/api")
 */
class ChampionnatController extends CMController
{
    /**
     * @Route("/championnat")
     * @Method("GET")
     */
    public function liste(Request $request)
    {
		$query = array();

		if ($request->query->has('sport'))
		{
			$repSport = $this->getDoctrine()->getRepository(Sport::class);
			$query['sport'] = $repSport->find($request->query->get('sport'));
		}
		if ($request->query->has('saison'))
		{
			$query['saison'] = $request->query->get('saison');
		}

        $repository = $this->getDoctrine()->getRepository(Championnat::class);
        return $this->groupJson($repository->findBy($query), 'simple');
	}

	/**
	 * @Route("/championnat/modele")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function listeModeles()
	{
		$repository = $this->getDoctrine()->getRepository(ChampModele::class);
		return $this->groupJson($repository->findAll(), 'simple_modele', 'simple');
	}

	/**
	 * @Route("/championnat/modele/{id}")
	 * @Method("DELETE")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function supprimeModele(ChampModele $modele, EntityManagerInterface $entityManager)
	{
		$entityManager->remove($modele);
		$entityManager->flush();
		return $this->json("ok");
	}

	/**
	 * @Route("/championnat/modele")
	 * @Method("POST")
	 * @ParamConverter("modele", converter="cm_converter")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function majModele(ChampModele $modele, EntityManagerInterface $entityManager)
	{
		// Récupération des entités pour les relations
		$modele->setSport($entityManager->merge($modele->getSport()));

		if ($modele->getFpForm() != null)
		{
			$repository = $this->getDoctrine()->getRepository(FPForm::class);
			$modele->setFpForm($repository->find($modele->getFpForm()->getId()));
		}

		// Enregistrement
		if ($modele->getId() == null)
			$entityManager->persist($modele);
		else
			$entityManager->merge($modele);

		$entityManager->flush();

		return $this->json("ok");
	}

	/**
	 * @Route("/championnat/{nom}/calendrier")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function calendrier(Sport $sport, Request $request, EntityManagerInterface $entityManager)
	{
		$saison= $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT c AS championnat, count(j.numero) AS nbJournees, count(j.debut) AS nbJourneesDefinies, min(j.debut) AS debut, max(j.fin) AS fin
			 FROM App\Entity\Championnat c
			 JOIN c.journees j
			 WHERE c.sport = :sport
			   AND c.saison = :saison
			 GROUP BY c
			 ORDER BY c.nom"
		);

		$query->setParameter("sport", $sport);
		$query->setParameter("saison", $saison);

		return $this->groupJson($query->getResult(), 'simple');
	}

	/**
	 * @Route("/championnat/{nom}/calendrier/genere")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function genereCalendrier(Sport $sport, Request $request, EntityManagerInterface $entityManager)
	{
		$champs = explode(",", $request->query->get('champs'));

		$repository = $this->getDoctrine()->getRepository(Championnat::class);
		$ftmp = Calendrier::genere($sport, $repository->findBy(['id' => $champs], ['nom' => 'ASC']));

		return $this->file($ftmp, "Calendrier " . $sport->getNom() . " - " . date('Y-m-d') . ".docx");
	}

    /**
     * @Route("/championnat/{id}")
     * @Method("DELETE")
	 * @IsGranted("ROLE_ADMIN")
     */
    public function supprime(Championnat $championnat, EntityManagerInterface $entityManager)
    {
		$entityManager->remove($championnat);
		$entityManager->flush();
        return $this->json("ok");
    }

	/**
	 * @Route("/championnat/{id}/remplace/{old}/{new}")
	 * @Method("PATCH")
	 * @ParamConverter("championnat", options={"id" = "id"})
	 * @ParamConverter("oldEquipe", options={"id" = "old"})
	 * @ParamConverter("newEquipe", options={"id" = "new"})
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function remplace(Championnat $championnat, Equipe $oldEquipe, Equipe $newEquipe, EntityManagerInterface $entityManager)
	{
		// Mise à jour du classement
		foreach ($championnat->getClassements() as $class)
		{
			if ($class->getEquipe() != $oldEquipe)
				continue;
				
			$class->setEquipe($newEquipe);
			$entityManager->merge($class);
			break;
		}

		// Mise à jour des matches
		$q = $entityManager->createQuery("SELECT m FROM App\Entity\Match m JOIN m.journee j WHERE j.championnat = :champ")->setParameter("champ", $championnat);
		foreach ($q->getResult() as $match)
		{
			if ($match->getEquipe1() == $oldEquipe)
				$match->setEquipe1($newEquipe);
			if ($match->getEquipe2() == $oldEquipe)
				$match->setEquipe2($newEquipe);
		}

		$entityManager->flush();

		return $this->groupJson($championnat->getClassements(), 'simple');
	}

	/**
	 * @Route("/championnat/{id}/importe")
	 * @Method("POST")
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("champDest", converter="doctrine.orm")
	 * @ParamConverter("championnats", converter="cm_converter", options={"classe":"App\Entity\Championnat[]"})
	 */
	public function importe(Championnat $champDest, array $championnats, EntityManagerInterface $entityManager)
	{
		$repMatches = $this->getDoctrine()->getRepository(Match::class);

		$i = 0;
		$matchesDest = $repMatches->findByChampionnat($champDest);

		foreach ($championnats as $champSource)
		{
			foreach ($repMatches->findByChampionnat($champSource) as $matchSource)
			{
				foreach ($matchesDest as $matchDest)
				{
					if ($matchDest->getEquipe1() != null && $matchDest->getEquipe2() != null &&
						$matchDest->getEquipe1() == $matchSource->getEquipe1() && $matchDest->getEquipe2() == $matchSource->getEquipe2() &&
						($matchSource->getScore1() != null || $matchSource->getScore2() != null || $matchSource->getForfait1() || $matchSource->getForfait2()))
					{
						$i++;
						$matchDest->setScore1($matchSource->getScore1());
						$matchDest->setForfait1($matchSource->getForfait1());
						$matchDest->setScore2($matchSource->getScore2());
						$matchDest->setForfait2($matchSource->getForfait2());
						$matchDest->setValide(true);
					}
				}
			}
		}

		// Recalcul du classement des championnats
		if ($champDest->getType() != ChampionnatType::COUPE)
			MatchFunctions::calculeClassement($champDest, $entityManager);

		$entityManager->flush();

		return $this->json($i);
	}

    /**
     * @Route("/championnat")
     * @Method("POST")
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("dto", converter="cm_converter")
     */
	public function cree(ChampCreationDTO $dto, EntityManagerInterface $entityManager) 
	{
		// Création du sport si besoin
		$sport = $entityManager->merge($dto->getChampionnat()->getSport());

		// Création des objets
		$championnat = $this->creeChampionnat($dto->getChampionnat(), $sport, $entityManager);
		$equipes = $this->getEquipes($dto->getEquipes(), $sport, $entityManager);

		// Création des matches
		switch ($championnat->getType())
		{
			case ChampionnatType::ALLER :
				$this->creeClassements($championnat, $equipes, $entityManager);
				$this->creeMatchesChampionnat($championnat, $equipes, 1, $entityManager);
				break;

			case ChampionnatType::ALLER_RETOUR :
				$this->creeClassements($championnat, $equipes, $entityManager);
				$this->creeMatchesChampionnat($championnat, $equipes, 2, $entityManager);
				break;
				
			case ChampionnatType::COUPE :
				$this->creeMatchesCoupe($championnat, $equipes, $entityManager);
				break;
		}

		$entityManager->flush();

		return $this->groupJson($championnat, 'simple');
	}

	/**
	 * Création d'un championnat
	 */
	private function creeChampionnat(Championnat $championnat, Sport $sport, EntityManagerInterface $entityManager): Championnat
	{
		$championnat->setSport($sport);

		if ($championnat->getFpForm() != null)
		{
			$repository = $this->getDoctrine()->getRepository(FPForm::class);
			$championnat->setFpForm($repository->find($championnat->getFpForm()->getId()));
		}

        $entityManager->persist($championnat);

		return $championnat;
	}

	/**
	 * Création/récupération des équipes
	 */
	private function getEquipes(array $equipes, Sport $sport, EntityManagerInterface $entityManager): array
	{
		$entities = array();
        $repEquipes = $this->getDoctrine()->getRepository(Equipe::class);

		foreach($equipes as $equipe) 
		{
			if (isset($equipe['id'])) 
			{
				array_push($entities, $repEquipes->find($equipe['id']));
			}
			else 
			{
				$entity = $repEquipes->creeEquipe($equipe['nom'], $sport);
				$entityManager->persist($entity);
				array_push($entities, $entity);
			}
		}

		return $entities;
	}

	/**
	 * Création des classements
	 */
	private function creeClassements(Championnat $championnat, array $equipes, EntityManagerInterface $entityManager)
	{
		foreach ($equipes as $equipe)
		{
			$classement = new Classement();
			$classement->setChampionnat($championnat);
			$classement->setEquipe($equipe);
			$classement->setPosition(1);
			$classement->setPenalite(0);
			MatchFunctions::initClassements($championnat, $classement);
			$entityManager->persist($classement);
		}		
	}

	/**
	 * Création des journées et des matches d'un championnat
	 */
	private function creeMatchesChampionnat(Championnat $championnat, array $equipes, int $nbTours, EntityManagerInterface $entityManager)
	{
		if (count($equipes) % 2 == 1)
			array_push($equipes, null);

		$nbEquipes = count($equipes);
		$nbJournees = $nbEquipes - 1;
		for ($t = 0; $t < $nbTours; $t++)
		{
			for ($i = 0; $i < $nbJournees; $i++)
			{
				// La journée
				$journee = new Journee();
				$journee->setChampionnat($championnat);
				$journee->setNumero($i + 1 + $t*$nbJournees);
				$entityManager->persist($journee);
				
				// Les matches
				for ($k = 0; $k < $nbEquipes/2; $k++)
				{
					$match = new Match();
					$match->setJournee($journee);
					$match->setForfait1(false);
					$match->setForfait2(false);

					$equipes_match = array(
						$equipes[($i + $k) % $nbJournees],
						$k==0 ?
							$equipes[$nbEquipes - 1] :
							$equipes[($i + $nbEquipes - $k - 1) % $nbJournees]);

					if ($k==0)
					{
						$match->setEquipe1($equipes_match[($i+$t) % 2]);
						$match->setEquipe2($equipes_match[($i+$t+1) % 2]);
					}
					else
					{
						$match->setEquipe1($equipes_match[($k+$t) % 2]);
						$match->setEquipe2($equipes_match[($k+$t+1) % 2]);
					}
					$entityManager->persist($match);
				}
			}
		}	
	}

	/**
	 * Création des journées et des matches d'une coupe.
	 * Fonction récursive.
	 * @param $championnat Le championnat
	 * @param $equipes Les équipes (découpé en deux à chaque étape)
	 * @param $entityManager
	 * @param $i Numéro de la journée
	 * @param $journees Liste des journées déjà créées (partagée entre tous les appels)
	 */
	private function creeMatchesCoupe(Championnat $championnat, array $equipes, EntityManagerInterface $entityManager, int $i = -1, array &$journees = array())
	{
		// TODO: supprimer la finale et les demi (plateau final)?
		// La journée
		if (isset($journees[$i]))
		{
			$journee = $journees[$i];
		}
		else
		{
			$journee = new Journee();
			$journee->setChampionnat($championnat);
			$journee->setNumero($i);
			$entityManager->persist($journee);
			$journees[$i] = $journee;
		}

		// Une seule équipe => pas de match
		if (count($equipes) == 1)
		{
			return $equipes[0];
		}
		// Deux équipes => un match
		else if (count($equipes) == 2)
		{
			$match = new Match();
			$match->setJournee($journee);
			$match->setForfait1(false);
			$match->setForfait2(false);
			$match->setEquipe1($equipes[0]);
			$match->setEquipe2($equipes[1]);
			$entityManager->persist($match);
			return $match;
		}
		// Plus de deux équipes => on fait deux paquets et on confronte les deux vainqueurs
		else
		{
			$i--;
			
			$res1 = $this->creeMatchesCoupe($championnat, array_slice($equipes, 0, count($equipes) / 2), $entityManager, $i, $journees);
			$res2 = $this->creeMatchesCoupe($championnat, array_slice($equipes, count($equipes) / 2), $entityManager, $i, $journees);

			$match = new Match();
			$match->setJournee($journee);
			$match->setForfait1(false);
			$match->setForfait2(false);
			if ($res1 instanceof Equipe)
				$match->setEquipe1($res1);
			else
				$match->setMatch1($res1);
			if ($res2 instanceof Equipe)
				$match->setEquipe2($res2);
			else
				$match->setMatch2($res2);
			$entityManager->persist($match);

			return $match;
		}
	}
}
