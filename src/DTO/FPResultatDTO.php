<?php

namespace App\DTO;

use Symfony\Component\Serializer\Annotation\Groups;

use App\Entity\Championnat;

/**
 * DTO pour l'affichage des résultats de fair-play
 */
class FPResultatDTO
{
	/** Le championnat */
	private $champ;
	/** Les classements */
	private $fpClassements;

	/**
	 * @Groups({"simple"})
	 */
	public function getChamp(): Championnat
	{
		return $this->champ;
	}

	public function setChamp(Championnat $champ): self
	{
		$this->champ = $champ;
		return $this;
	}

	/**
	 * @Groups({"simple"})
	 */
	public function getFpClassements(): array
	{
		return $this->fpClassements;
	}

	public function setFpClassements(array $fpClassements): self
	{
		$this->fpClassements = $fpClassements;
		return $this;
	}
}
