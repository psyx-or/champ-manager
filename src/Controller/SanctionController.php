<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\SanctionCategorie;

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

        return $this->groupJson($query->getResult(), "bareme");
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
}
