<?php

namespace App\Outils;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class Outils
{
	/**
	 * Création de mot de passe
	 */
	public function makePassword()
	{
		$caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$password = "";
		for ($i = 0; $i < 8; $i++)
			$password .= $caracteres[rand(0, strlen($caracteres) - 1)];

		return $password;
	}

	/**
	 * Change le mot de passe d'une équipe et renvoie les infos du mail
	 */
	public function changeMdp(PasswordEntityInterface $entity, EntityManagerInterface $entityManager, UserPasswordEncoderInterface $encoder): string
	{
		$plainPassword = Outils::makePassword();
		$encoded = $encoder->encodePassword($entity, $plainPassword);

		$entity->setPassword($encoded);
		$entityManager->flush();

		return $plainPassword;
	}
}
