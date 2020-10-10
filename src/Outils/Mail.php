<?php

namespace App\Outils;

use App\Entity\Match;
use App\Entity\Equipe;
use Doctrine\Common\Persistence\ManagerRegistry;
use App\Entity\Parametre;
use ErrorException;

class Mail
{
	/**
	 * Envoi d'un mail
	 */
	public static function envoie(array $mail, ManagerRegistry $doctrine)
	{
		if ($mail['destinataires'] == null || $mail['destinataires'] =='')
			return;

		$repository = $doctrine->getRepository(Parametre::class);
		$emetteur = $repository->find(Parametre::MAIL_EMETTEUR)->getValeur();

		$headers = "From: $emetteur\r\n" .
			"Reply-To: $emetteur\r\n" .
			'X-Mailer: PHP/' . phpversion();

		try
		{
			mail($mail['destinataires'], $mail['objet'], $mail['corps'], $headers);
		}
		catch (ErrorException $e)
		{}
	}

	/**
	 * Envoi du mail pour le remplissage de la feuille de fair-play
	 */
	public static function envoieMailFP(Match $match, Equipe $equipe, ManagerRegistry $doctrine)
	{
		$repository = $doctrine->getRepository(Parametre::class);

		Mail::envoie(
			array
			(
				"destinataires" => Mail::getDestinataires($equipe),
				"objet" => $repository->find(Parametre::MAIL_FP_OBJET)->getValeur(),
				"corps" => str_replace(
					array('$nb', '$equipe1', '$equipe2'),
					array($repository->find(Parametre::DUREE_SAISIE)->getValeur(), $match->getEquipe1()->getNom(), $match->getEquipe2()->getNom()),
					$repository->find(Parametre::MAIL_FP_VALEUR)->getValeur())
			),
			$doctrine
		);
	}

	/**
	 * Récupération des destinataires d'une équipe
	 */
	public static function getDestinataires(Equipe $equipe): string
	{
		$destinataires = array();
		foreach ($equipe->getResponsables() as $resp)
			if ($resp->getMail() != null)
				if (strpos($resp->getMail(),'psycholive') !== false || strpos($resp->getMail(), 'fsgt') !== false) // TODO: filtre mail
					array_push($destinataires, $resp->getMail());

		return implode(",", $destinataires);
	}
}
