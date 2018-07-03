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

/**
 * @Route("/api")
 */
class FairPlayController extends CMController
{
	/**
	 * @Route("/fairplay")
	 * @Method("GET")
	 */
    public function liste(Request $request)
    {
		$repository = $this->getDoctrine()->getRepository(FPForm::class);
        return $this->groupJson(
			$repository->findBy(array("obsolete" => false), array("libelle" => "ASC")),
			"simple",
			$request->query->get('complet')=="true" ? "complet" : "simple");
	}

	/**
	 * @Route("/fairplay/{id}")
	 * @Method("DELETE")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function supprime(FPForm $form, EntityManagerInterface $entityManager)
	{
		// TODO: gestion des modèles
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
	public function maj(FPForm $dto, EntityManagerInterface $entityManager)
	{
		// TODO: gestion des modèles
		// En cas de modification, on supprime le formulaire actuel
		if ($dto->getId() != null)
		{
			$repository = $this->getDoctrine()->getRepository(FPForm::class);
			$entite = $repository->find($dto->getId());

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
		$dto->getFpFeuille()->setScore($score);
		$dto->getFpFeuille()->setRatio(100 * $score / count($dto->getReponses()));

		// On enregistre
		$entity = null;
		if ($dto->getFpFeuille()->getId() != null)
		{
			$entity = $entityManager->merge($dto->getFpFeuille());
		}
		else
		{
			$entity = $dto->getFpFeuille();
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
