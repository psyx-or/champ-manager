<?php

namespace App\Outils;

use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Surcouche à UserInterface permettant de modifier le mot de passe
 */
interface PasswordEntityInterface extends UserInterface
{
	public function setPassword(string $password);
}
