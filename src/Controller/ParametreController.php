<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Entity\Parametre;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @Route("/api")
 */
class ParametreController extends Controller
{
	/**
	 * @Route("/parametre")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
    public function liste()
    {
		$repository = $this->getDoctrine()->getRepository(Parametre::class);
        return $this->json($repository->findAll());
    }

	/**
	 * @Route("/parametre")
	 * @Method("POST")
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
}
