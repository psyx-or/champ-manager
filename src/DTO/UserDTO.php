<?php

namespace App\DTO;

use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Information renvoyées lors de l'authentification
 */
class UserDTO
{
	public $id;
	public $nom;
	public $roles;

	public function __construct(UserInterface $user)
	{
		if (is_a($user, 'App\\Entity\\Equipe'))
		{
			$this->id = $user->getId();
			$this->nom = $user->getNom();
		}
		else if (is_a($user, 'App\\Entity\\Championnat'))
		{
			$this->champId = $user->getId();
			$this->champNom = $user->getNom();
		}

		$this->roles = $user->getRoles();
	}
}
