<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\FPForm;
use App\Entity\Match;
use App\DTO\FPFeuilleAfficheDTO;
use App\Entity\FPFeuille;
use App\Entity\FPQuestion;
use App\Entity\FPReponse;
use App\Entity\Equipe;
use App\Entity\Sport;

/**
 * @Route("/api")
 */
class FairPlayController extends CMController
{
	/**
	 * @Route("/fairplay")
	 * @Method("GET")
	 */
    public function listeForm(Request $request)
    {
		$repository = $this->getDoctrine()->getRepository(FPForm::class);
        return $this->groupJson(
			$repository->findBy(array("obsolete" => false), array("libelle" => "ASC")),
			... ($request->query->get('complet')=="true" ? array("simple","complet","utilisation") : array("simple")));
	}

	/**
	 * @Route("/fairplay/classement/{nom}")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
    public function classement(Sport $sport, Request $request, EntityManagerInterface $entityManager)
    {
		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT e AS equipe, AVG(f.ratio) AS ratio, COUNT(f) AS nb
			 FROM App\Entity\Equipe e
			 JOIN e.fpEvaluees f
			 JOIN f.fpMatch m
			 JOIN m.journee j
			 JOIN j.championnat c
			 WHERE c.sport = :sport
			   AND c.saison = :saison
			 GROUP BY e
			 ORDER BY AVG(f.ratio) DESC"
		);

		$query->setParameter("sport", $sport);
		$query->setParameter("saison", $saison);

        return $this->groupJson($query->getResult(), "simple");
	}

	/**
	 * @Route("/fairplay/{id}")
	 * @Method("DELETE")
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
	 * @Route("/fairplay")
	 * @Method("POST")
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
	 * @Route("/fairplay/feuille/{id}/{equipe}")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function getFeuille(Match $match, $equipe, EntityManagerInterface $entityManager)
	{
		$fpForm = $match->getJournee()->getChampionnat()->getFpForm();
		$feuille = $equipe == 1 ? $match->getFpFeuille1() : $match->getFpFeuille2();
		
		$res = new FPFeuilleAfficheDTO();
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
	 * @Route("/fairplay/feuille/{id}")
	 * @Method("POST")
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("match", converter="doctrine.orm")
	 * @ParamConverter("dto", converter="cm_converter")
	 */
	public function majFeuille(Match $match, FPFeuilleAfficheDTO $dto, EntityManagerInterface $entityManager)
	{
		// Récupération des équipes
		$repository = $this->getDoctrine()->getRepository(Equipe::class);
		$dto->getFpFeuille()->setEquipeRedactrice($repository->find($dto->getFpFeuille()->getEquipeRedactrice()->getId()));
		$dto->getFpFeuille()->setEquipeEvaluee($repository->find($dto->getFpFeuille()->getEquipeEvaluee()->getId()));

		// On remet les réponses
		$score = 0;
		$repository = $this->getDoctrine()->getRepository(FPQuestion::class);
		foreach ($dto->getReponses() as $id => $val)
		{
			$question = $repository->find($id);
			$reponse = new FPReponse();
			$dto->getFpFeuille()->addReponse($reponse);
			$reponse->setQuestion($question);
			$reponse->setReponse($val);
			$score += $val;
		}
		$dto->getFpFeuille()->setRatio(100 * $score / count($dto->getReponses()));

		// On enregistre
		$entity = null;
		if ($dto->getFpFeuille()->getId() != null)
		{
			$dto->getFpFeuille()->setFpMatch($match);
			$entity = $entityManager->merge($dto->getFpFeuille());
		}
		else
		{
			$entity = $dto->getFpFeuille();
			$entity->setFpMatch($match);
			$entityManager->persist($entity);
			if ($entity->getEquipeRedactrice()->getId() == $match->getEquipe1()->getId())
				$match->setFpFeuille1($entity);
			if ($entity->getEquipeRedactrice()->getId() == $match->getEquipe2()->getId())
				$match->setFpFeuille2($entity);
		}

		$entityManager->flush();

		return $this->groupJson($entity, 'simple');
	}
}