<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use App\Entity\Championnat;


/**
 * @Route("/api")
 */
class ClassementController extends CMController
{
    /**
     * @Route("/classement/{id}")
     * @Method("GET")
     */
    public function getClassement(Championnat $championnat)
    {
        return $this->groupJson($championnat, 'simple', 'classement');
    }
}
