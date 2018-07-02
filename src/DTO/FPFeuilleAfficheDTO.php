<?php

namespace App\DTO;

use Symfony\Component\Serializer\Annotation\Groups;

use App\Entity\FPForm;
use App\Entity\FPFeuille;

/**
 * DTO pour la création/modification/affichage d'une feuille de fair-play
 */
class FPFeuilleAfficheDTO
{
	/** Le formulaire de fair-play, avec les questions */
	private $fpForm;
	/** L'enveloppe de la feuille (sans les réponses) */
	private $fpFeuille;
	/** Les réponses aux questions sous forme de tableau id question => réponse */
	private $reponses;

	/**
	 * @Groups({"simple"})
	 */
	public function getFpForm(): FPForm
	{
		return $this->fpForm;
	}

	public function setFpForm(FPForm $fpForm): self
	{
		$this->fpForm = $fpForm;
		return $this;
	}

	/**
	 * @Groups({"simple"})
	 */
	public function getFpFeuille(): FPFeuille
	{
		return $this->fpFeuille;
	}

	public function setFpFeuille(FPFeuille $fpFeuille): self
	{
		$this->fpFeuille = $fpFeuille;
		return $this;
	}

	/**
	 * @Groups({"simple"})
	 */
	public function getReponses(): array
	{
		return $this->reponses;
	}

	public function setReponses(array $reponses) : self
	{
		$this->reponses = $reponses;
		return $this;
	}
}
