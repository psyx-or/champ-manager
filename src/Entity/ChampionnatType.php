<?php

namespace App\Entity;

class ChampionnatType extends EnumType
{
	public const ALLER = 'ALLER';
	public const ALLER_RETOUR = 'ALLER_RETOUR';
	public const COUPE = 'COUPE';

    protected $name = 'championnatType';
    protected $values = array(ChampionnatType::ALLER, ChampionnatType::ALLER_RETOUR, ChampionnatType::COUPE);
}
