<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

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
}
