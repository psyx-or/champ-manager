<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Championnat;

/**
 * @Route("/api")
 */
class ChampionnatController extends Controller
{
    /**
     * @Route("/championnat")
     * @Method("GET")
     */
    public function list()
    {
        $repository = $this->getDoctrine()->getRepository(Championnat::class);
        return $this->json($repository->findAll());
    }

    /**
     * @Route("/championnat")
     * @Method("POST")
	 * @ParamConverter("championnat", converter="cm_converter")
     */
	public function create(Championnat $championnat, EntityManagerInterface $entityManager) 
	{
		$championnat->setSport($entityManager->merge($championnat->getSport()));
		$championnat->setTermine(false);

        $entityManager->persist($championnat);
		$entityManager->flush();
		return $this->json($championnat);
	}
}
