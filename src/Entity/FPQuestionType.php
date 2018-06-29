<?php

namespace App\Entity;

class FPQuestionType extends EnumType
{
	public const BOOLEEN = 'BOOLEEN';
	public const EVAL = 'EVAL';

    protected $name = 'questionType';
    protected $values = array(FPQuestionType::BOOLEEN, FPQuestionType::EVAL);
}
