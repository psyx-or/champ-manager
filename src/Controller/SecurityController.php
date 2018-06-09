<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * @Route("/api")
 */
class SecurityController extends Controller
{
    /**
     * @Route("/me")
	 * @IsGranted("IS_AUTHENTICATED_REMEMBERED")
     */
	public function getCurrentUser() {

		return $this->json([
			'login' => $this->getUser()->getUsername(),
			'roles' => $this->getUser()->getRoles()
		]);
	}
}
