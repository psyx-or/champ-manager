<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\SanctionCategorie;
use App\Entity\Sanction;
use App\Entity\SanctionBareme;
use App\Entity\Equipe;

/**
 * @Route("/api")
 */
class SanctionController extends CMController
{
	/**
	 * @Route("/sanction/bareme", methods={"GET"})
	 */
    public function getBareme(EntityManagerInterface $entityManager)
    {
		$query = $entityManager->createQuery(
			"SELECT c, b
			 FROM App\Entity\SanctionCategorie c
			 JOIN c.baremes b
			 WHERE b.actif = true
			 ORDER BY c.libelle, b.libelle"
		);

        return $this->groupJson($query->getResult(), "bareme", "baremes");
	}

	/**
	 * @Route("/sanction/bareme", methods={"POST"})
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("categories", converter="cm_converter", options={"classe":"App\Entity\SanctionCategorie[]"})
	 */
    public function majBareme(array $categories, EntityManagerInterface $entityManager)
    {
		$repo = $entityManager->getRepository(SanctionCategorie::class);
		
		foreach ($categories as $categorie)
		{
			$entity = null;

			// On essaie de voir si une nouvelle catégorie n'existe pas déjà
			if ($categorie->getId() === null)
				$entity = $repo->findByLibelle($categorie->getLibelle());
			
			// Sinon, on merge
			if ($entity == null)
				$entity = $entityManager->merge($categorie);

			// Et puis les baremes
			foreach ($categorie->getBaremes() as $bareme)
			{
				$bareme->setCategorie($entity);
				$entityManager->merge($bareme);
			}
		}
			
		$entityManager->flush();

        return $this->getBareme($entityManager);
	}

	/**
	 * @Route("/sanction", methods={"GET"})
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function getHistorique(Request $request, EntityManagerInterface $entityManager)
	{
		$date = $request->get("from");

		$query = $entityManager->createQuery(
			"SELECT s
			 FROM App\Entity\Sanction s
			 WHERE s.date > :date
			 ORDER BY s.date DESC"
		);

		$query->setParameter("date", $date);

		return $this->groupJson($query->getResult(), "simple", "equipe", "sanction_complet", "bareme", "sport", "categorie");
	}

	/**
	 * @Route("/sanction", methods={"POST"})
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("sanction", converter="cm_converter")
	 */
	public function creeSanction(Sanction $sanction, EntityManagerInterface $entityManager)
	{
		$sanction->setBareme(
			$entityManager->getRepository(SanctionBareme::class)->find($sanction->getBareme()->getId())
		);

		$sanction->setEquipe(
			$entityManager->getRepository(Equipe::class)->find($sanction->getEquipe()->getId())
		);

		$entityManager->persist($sanction);
		$entityManager->flush();

		return new Response();
	}
}
