<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\FPForm;
use App\Entity\Match;
use App\DTO\FPFeuilleAfficheDTO;
use App\Entity\FPFeuille;
use App\Entity\FPQuestion;
use App\Entity\FPReponse;
use App\Entity\Equipe;
use App\Entity\Parametre;
use App\Entity\Championnat;
use App\DTO\FPResultatDTO;

/**
 * @Route("/api")
 */
class FairPlayController extends CMController
{
	/**
	 * @Route("/fairplay", methods={"GET"})
	 */
    public function listeForm(Request $request)
    {
		$repository = $this->getDoctrine()->getRepository(FPForm::class);
        return $this->groupJson(
			$repository->findBy(array("obsolete" => false), array("libelle" => "ASC")),
			... ($request->query->get('complet')=="true" ? array("simple","complet","utilisation") : array("simple")));
	}

	/**
	 * @Route("/fairplay/classement/{id}", methods={"GET"})
	 * @IsGranted("ROLE_CHAMP")
	 */
    public function classement(Championnat $champ, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
    {
		// Petits contrôles pour les petits malins
		if (false === $authChecker->isGranted('ROLE_ADMIN')) {
			if ($champ->getId() != $this->getUser()->getId())
				throw $this->createAccessDeniedException();
		}

		// C'est bon
		$query = $entityManager->createQuery(
			"SELECT e AS equipe, AVG(f.ratio) AS ratio, COUNT(f) AS nb
			 FROM App\Entity\Equipe e
			 JOIN e.fpEvaluees f
			 JOIN f.fpMatch m
			 JOIN m.journee j
			 WHERE j.championnat = :champ
			 GROUP BY e
			 ORDER BY AVG(f.ratio) DESC"
		);

		$query->setParameter("champ", $champ);

		$res = new FPResultatDTO();
		$res->setChamp($champ);
		$res->setFpClassements($query->getResult());

        return $this->groupJson($res, "simple");
	}

	/**
	 * @Route("/fairplay/{id}", methods={"DELETE"})
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function supprimeForm(FPForm $form, EntityManagerInterface $entityManager)
	{
		if ($form->getChampionnats()->count() == 0)
			$entityManager->remove($form);
		else
			$form->setObsolete(true);

		$entityManager->flush();
		return $this->json("ok");
	}

	/**
	 * @Route("/fairplay", methods={"POST"})
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("dto", converter="cm_converter")
	 */
	public function majForm(FPForm $dto, EntityManagerInterface $entityManager)
	{
		// En cas de modification, on supprime le formulaire actuel
		$modeles = array();
		if ($dto->getId() != null)
		{
			$repository = $this->getDoctrine()->getRepository(FPForm::class);
			$entite = $repository->find($dto->getId());
			$modeles = $entite->getChampModeles()->toArray();

			if ($entite->getChampionnats()->count() == 0)
				$entityManager->remove($entite);
			else
				$entite->setObsolete(true);
		}

		// On enregistre le nouveau formulaire
		$dto->setObsolete(false);

		$i = 0;
		foreach ($dto->getCategories() as $categorie)
		{
			$categorie->setOrdre($i++);
			$j = 0;
			foreach ($categorie->getQuestions() as $question)
				$question->setOrdre($j++);
		}

		$entityManager->persist($dto);
		foreach ($modeles as $modeles)
			$modeles->setFpForm($dto);
		$entityManager->flush();

		return $this->json("ok");
	}

	/**
	 * @Route("/fairplay/feuille/{id}", methods={"GET"})
	 * @IsGranted("ROLE_CHAMP")
	 */
	public function getFeuilleById(FPFeuille $feuille, AuthorizationCheckerInterface $authChecker)
	{
		// Petits contrôles pour les petits malins
		if (false === $authChecker->isGranted('ROLE_ADMIN')) {
			if ($feuille->getFpMatch()->getJournee()->getChampionnat()->getId() != $this->getUser()->getId())
				throw $this->createAccessDeniedException();
		}

		// C'est bon
		$fpForm = $feuille->getFpMatch()->getJournee()->getChampionnat()->getFpForm();
		
		$res = new FPFeuilleAfficheDTO();
		$res->setMatchId($feuille->getFpMatch()->getId());
		$res->setFpForm($fpForm);
		$res->setFpFeuille($feuille);
		$reponses = array();
		foreach ($feuille->getReponses() as $reponse)
			$reponses[$reponse->getQuestion()->getId()] = $reponse->getReponse();
		$res->setReponses($reponses);

		return $this->groupJson($res, 'simple', 'complet');
	}

	/**
	 * @Route("/fairplay/feuille/{id}/{equipe}", methods={"GET"})
	 * @Security("is_granted('ROLE_USER') or is_granted('ROLE_CHAMP')")
	 */
	public function getFeuille(Match $match, $equipe, AuthorizationCheckerInterface $authChecker)
	{
		if (false === $authChecker->isGranted('ROLE_ADMIN')) 
		{
			if (true === $authChecker->isGranted('ROLE_USER')) 
			{
				$redacteur = ($equipe == 1 ? $match->getEquipe1() : $match->getEquipe2());
				if ($redacteur->getId() != $this->getUser()->getId())
					throw $this->createAccessDeniedException();
			}
			else if (true === $authChecker->isGranted('ROLE_CHAMP')) 
			{
				if ($match->getJournee()->getChampionnat()->getId() != $this->getUser()->getId())
					throw $this->createAccessDeniedException();
			}
			else
			{
				throw $this->createAccessDeniedException();
			}
		}

		$fpForm = $match->getJournee()->getChampionnat()->getFpForm();
		$feuille = $equipe == 1 ? $match->getFpFeuille1() : $match->getFpFeuille2();
		
		$res = new FPFeuilleAfficheDTO();
		$res->setMatchId($match->getId());
		$res->setFpForm($fpForm);
		if ($feuille == null)
		{
			$feuille = new FPFeuille();
			$feuille->setEquipeRedactrice($equipe == 1 ? $match->getEquipe1() : $match->getEquipe2());
			$feuille->setEquipeEvaluee($equipe == 1 ? $match->getEquipe2() : $match->getEquipe1());
			$res->setFpFeuille($feuille);

			$reponses = array();
			foreach ($fpForm->getCategories() as $cat)
				foreach ($cat->getQuestions() as $q)
					$reponses[$q->getId()] = null;
			$res->setReponses($reponses);
		}
		else
		{
			$res->setFpFeuille($feuille);
			$reponses = array();
			foreach ($feuille->getReponses() as $reponse)
				$reponses[$reponse->getQuestion()->getId()] = $reponse->getReponse();
			$res->setReponses($reponses);
		}

		return $this->groupJson($res, 'simple', 'complet');
	}

	/**
	 * @Route("/fairplay/feuille/{id}", methods={"POST"})
	 * @Security("is_granted('ROLE_USER') or is_granted('ROLE_CHAMP')")
	 * @ParamConverter("match", converter="doctrine.orm")
	 * @ParamConverter("dto", converter="cm_converter")
	 */
	public function majFeuille(Match $match, FPFeuilleAfficheDTO $dto, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
	{
		if (false === $authChecker->isGranted('ROLE_ADMIN'))
		{
			if (true === $authChecker->isGranted('ROLE_USER')) 
			{
				// Vérification du rédacteur
				if ($dto->getFpFeuille()->getEquipeRedactrice()->getId() != $this->getUser()->getId())
					throw $this->createAccessDeniedException();

				// Vérification de la date
				if ($match->getJournee()->getFin() != null) 
				{
					$repository = $this->getDoctrine()->getRepository(Parametre::class);
					$dureeSaisie = $repository->find(Parametre::DUREE_SAISIE)->getValeur();
					$interval = date_diff(new \DateTime(), $match->getJournee()->getFin());
					if ($interval->invert == 1 && $interval->days > $dureeSaisie)
						throw $this->createAccessDeniedException();
				}
			}
			else if (true === $authChecker->isGranted('ROLE_CHAMP')) 
			{
				if ($match->getJournee()->getChampionnat()->getId() != $this->getUser()->getId())
					throw $this->createAccessDeniedException();
			}
			else
			{
				throw $this->createAccessDeniedException();
			}
		}

		$entity = new FPFeuille();
		$entity->setCommentaire($dto->getFpFeuille()->getCommentaire());
		$entity->setFpMatch($match);

		// Récupération des équipes
		$repository = $this->getDoctrine()->getRepository(Equipe::class);
		$entity->setEquipeRedactrice($repository->find($dto->getFpFeuille()->getEquipeRedactrice()->getId()));
		$entity->setEquipeEvaluee($repository->find($dto->getFpFeuille()->getEquipeEvaluee()->getId()));

		// On remet les réponses
		$score = 0;
		$repository = $this->getDoctrine()->getRepository(FPQuestion::class);
		$reponses = array();
		foreach ($dto->getReponses() as $id => $val)
		{
			$question = $repository->find($id);
			$reponse = new FPReponse();
			$reponse->setQuestion($question);
			$reponse->setReponse($val);
			$score += $val;
			array_push($reponses, $reponse);
		}
		$entity->setRatio(100 * $score / count($dto->getReponses()));

		// On enregistre
		if ($dto->getFpFeuille()->getId() != null)
		{
			$entity->setId($dto->getFpFeuille()->getId());
			foreach ($reponses as $reponse)
				$entity->addReponse($reponse);

			$entity = $entityManager->merge($entity);
		}
		else
		{
			$entityManager->persist($entity);
			if ($entity->getEquipeRedactrice()->getId() == $match->getEquipe1()->getId())
				$match->setFpFeuille1($entity);
			if ($entity->getEquipeRedactrice()->getId() == $match->getEquipe2()->getId())
				$match->setFpFeuille2($entity);

			$entityManager->flush();

			foreach ($reponses as $reponse)
				$entity->addReponse($reponse);
		}

		$entityManager->flush();

		return $this->groupJson($entity, 'simple', 'alerte');
	}

	/**
	 * @Route("/fairplay/{id}/evaluation", methods={"GET"})
	 * @IsGranted("ROLE_CHAMP")
	 */
	public function getEvaluation(Equipe $equipe, Request $request, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
	{
		$champId = null;
		if (false === $authChecker->isGranted('ROLE_ADMIN')) {
			$champId = $this->getUser()->getId();
		}

		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT c, j, m, f
			 FROM App\Entity\Championnat c
			 JOIN c.journees j
			 JOIN j.matches m
			 JOIN m.fpFeuilles f
			 WHERE f.equipeEvaluee = :equipe
			   AND c.saison = :saison
			   AND (:champId IS NULL OR c.id = :champId)
			 ORDER BY c.id DESC, f.ratio DESC"
		);

		$query->setParameter("equipe", $equipe);
		$query->setParameter("saison", $saison);
		$query->setParameter("champId", $champId);

		return $this->groupJson($query->getResult(), "complet", "simple", "feuilles");
	}

	/**
	 * @Route("/fairplay/{id}/redaction", methods={"GET"})
	 * @IsGranted("ROLE_CHAMP")
	 */
	public function getRedaction(Equipe $equipe, Request $request, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
	{
		$champId = null;
		if (false === $authChecker->isGranted('ROLE_ADMIN')) {
			$champId = $this->getUser()->getId();
		}

		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT c, j, m, f
			 FROM App\Entity\Championnat c
			 JOIN c.journees j
			 JOIN j.matches m
			 JOIN m.fpFeuilles f
			 WHERE f.equipeRedactrice = :equipe
			   AND c.saison = :saison
			   AND (:champId IS NULL OR c.id = :champId)
			 ORDER BY c.id DESC, f.ratio DESC"
		);

		$query->setParameter("equipe", $equipe);
		$query->setParameter("saison", $saison);
		$query->setParameter("champId", $champId);

		return $this->groupJson($query->getResult(), "complet", "simple", "feuilles");
	}
}
