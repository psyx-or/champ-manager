<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use App\Entity\Equipe;


/**
 * @Route("/api")
 */
class EquipeController extends Controller
{
    /**
     * @Route("/equipe/{sport}")
     * @Method("GET")
     */
    public function liste(string $sport)
    {
        $repository = $this->getDoctrine()->getRepository(Equipe::class);
        return $this->json(array_map(
			function(Equipe $equipe) { return array('id' => $equipe->getId(), 'nom' => $equipe->getNom()); },
			$repository->findBySport($sport)
		));
    }
}
