<?php

namespace App\DTO;

use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\Equipe;

/**
 * DTO permettant de lister les championnats d'une équipe
 */
class ChampionnatEquipeDTO
{
	private $equipe;
	private $championnats;


	/**
	 * @Groups({"simple"})
	 */
	public function getEquipe() : Equipe
	{
		return $this->equipe;
	}

	public function setEquipe(Equipe $equipe) : self
	{
		$this->equipe = $equipe;
		return $this;
	}

	/**
	 * @Groups({"simple"})
	 */
	public function getChampionnats() : array
	{
		return $this->championnats;
	}

	public function setChampionnats(array $championnats) : self
	{
		$this->championnats = $championnats;
		return $this;
	}
}