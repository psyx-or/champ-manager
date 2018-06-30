<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\FPForm;

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
}
