<?php

namespace App\Entity;

class ParametreType extends EnumType
{
	public const STR = 'STR';
	public const TEXTE = 'TEXTE';

	protected $name = 'championnatType';
	protected $values = array(ParametreType::STR, ParametreType::TEXTE);
}
