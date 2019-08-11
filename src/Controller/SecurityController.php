<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\DTO\UserDTO;

/**
 * @Route("/api")
 */
class SecurityController extends CMController
{
    /**
     * @Route("/me")
	 * @IsGranted("IS_AUTHENTICATED_REMEMBERED")
     */
	public function getCurrentUser() 
	{
		return $this->json(new UserDTO($this->getUser()));
	}
}
