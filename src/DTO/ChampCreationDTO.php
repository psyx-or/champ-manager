<?php

namespace App\DTO;

use App\Entity\Championnat;
use App\Entity\Equipe;

/**
 * DTO permettant de créer un championnat
 */
class ChampCreationDTO 
{
	private $championnat;
	private $equipes;

	public function getChampionnat(): Championnat 
	{
		return $this->championnat;
	}

	public function setChampionnat(Championnat $championnat): self 
	{
		$this->championnat = $championnat;
		return $this;
	}

	public function getEquipes(): array 
	{
		return $this->equipes;
	}

	public function setEquipes(array $equipes): self 
	{
		$this->equipes = $equipes;
		return $this;
	}
}
