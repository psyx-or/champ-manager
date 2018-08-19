<?php

namespace App\Outils;

use Symfony\Component\Security\Http\Logout\LogoutSuccessHandlerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Gestionnaire de déconnexion basique pour éviter la redirection automatique
 */
class CMLogoutSuccessHandler implements LogoutSuccessHandlerInterface
{
	/**
	 * {@inheritdoc}
	 */
	public function onLogoutSuccess(Request $request)
	{
		$data = array(
			'message' => "Déconnecté"
		);

		return new JsonResponse($data);
	}
}
