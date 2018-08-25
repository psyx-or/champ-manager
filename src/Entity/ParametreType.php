<?php

namespace App\Entity;

class ParametreType extends EnumType
{
	public const STR = 'STR';
	public const TEXTE = 'TEXTE';
	public const NOMBRE = 'NOMBRE';

	protected $name = 'championnatType';
	protected $values = array(ParametreType::NOMBRE, ParametreType::STR, ParametreType::TEXTE);
}
