<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Entity\Parametre;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @Route("/api")
 */
class ParametreController extends CMController
{
	/**
	 * @Route("/parametre", methods={"GET"})
	 * @IsGranted("ROLE_ADMIN")
	 */
    public function liste()
    {
		$repository = $this->getDoctrine()->getRepository(Parametre::class);
        return $this->json($repository->findAll());
    }

	/**
	 * @Route("/parametre", methods={"POST"})
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("parametres", converter="cm_converter", options={"classe":"App\Entity\Parametre[]"})
	 */
	public function maj(array $parametres, EntityManagerInterface $entityManager)
	{
		$repository = $this->getDoctrine()->getRepository(Parametre::class);

		foreach ($parametres as $param)
		{
			$entite = $repository->find($param->getNom());
			$entite->setValeur($param->getValeur());
		}

		$entityManager->flush();

		return $this->liste();
	}

	/**
	 * @Route("/parametre/{nom}", methods={"GET"})
	 * @IsGranted("ROLE_USER")
	 */
	public function getParam(Parametre $param)
	{
		return $this->json($param->getValeur());
	}
}
