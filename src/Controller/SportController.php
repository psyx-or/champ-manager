<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;

use App\Entity\Sport;

/**
 * @Route("/api")
 */
class SportController extends CMController
{
	/**
	 * @Route("/sport", methods={"GET"})
	 */
    public function index()
    {
        $repository = $this->getDoctrine()->getRepository(Sport::class);
        return $this->groupJson($repository->findAll(), 'simple');
    }
}
