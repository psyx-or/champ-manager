<?php

namespace App\Outils;

class Mail
{
	/**
	 * Envoi d'un mail
	 */
	public static function envoie(array $mail)
	{
		if ($mail['destinataires'] == null || $mail['destinataires'] =='')
			return;

		$headers = 'From: FSGT 38 <fsgt38@wanadoo.fr>' . "\r\n" .
			'Reply-To: fsgt38@wanadoo.fr' . "\r\n" .
			'X-Mailer: PHP/' . phpversion();

		$res = mail($mail['destinataires'], $mail['objet'], $mail['corps'], $headers);
	}
}
