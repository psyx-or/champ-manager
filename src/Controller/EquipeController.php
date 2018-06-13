<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use App\Entity\Equipe;


/**
 * @Route("/api")
 */
class EquipeController extends CMController
{
    /**
     * @Route("/equipe/{sport}")
     * @Method("GET")
     */
    public function liste(string $sport)
    {
        $repository = $this->getDoctrine()->getRepository(Equipe::class);
        return $this->groupJson($repository->findBy(array('sport' => $sport), array('nom' => 'ASC')), 'simple');
    }
}
