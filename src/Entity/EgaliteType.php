<?php

namespace App\Entity;

class EgaliteType extends EnumType
{
	public const DIFF_GENERALE = 'DIFF_GENERALE';
	public const DIFF_PARTICULIERE = 'DIFF_PARTICULIERE';

    protected $name = 'egaliteType';
    protected $values = array(EgaliteType::DIFF_GENERALE, EgaliteType::DIFF_PARTICULIERE);
}
