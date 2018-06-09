<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use App\Entity\Sport;

/**
 * @Route("/api")
 */
class SportController extends Controller
{
    /**
     * @Route("/sport")
     * @Method("GET")
     */
    public function index()
    {
        $repository = $this->getDoctrine()->getRepository(Sport::class);
        return $this->json($repository->findAll());
    }
}
