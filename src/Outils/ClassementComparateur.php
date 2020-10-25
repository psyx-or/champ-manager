<?php

namespace App\Outils;

use App\Entity\Championnat;
use App\Entity\Classement;
use App\Entity\EgaliteType;
use App\Entity\Equipe;
use App\Entity\Match;

/**
 * Comparaison de deux classements
 */
class ClassementComparateur {

    private $egaliteType;
    private $diffs = array();

    /**
     * Constructeur
     */
    public function __construct(Championnat $champ)
    {
        $this->egaliteType = $champ->getEgaliteType();
    }

    /**
     * Enregistre un match pour gérer les comparaisons plus tard
     */
    public function ajouteMatch(Match $match)
    {
        $this->ajouteDiff($match->getEquipe1(), $match->getEquipe2(), $match->getScore1() - $match->getScore2());
        $this->ajouteDiff($match->getEquipe2(), $match->getEquipe1(), $match->getScore2() - $match->getScore1());
    }

    /**
     * Enregistre la différence entre équipe 1 et équipe 2
     */
    private function ajouteDiff(Equipe $equipe1, Equipe $equipe2, int $diff)
    {
        $clef = $this->getClef($equipe1, $equipe2);
        if (isset($diffs[$clef]))
            $this->diffs[$clef] += $diff;
        else
            $this->diffs[$clef] = $diff;
    }

	/**
	 * Compare le classement de deux équipes
	 */
	public function compare(Classement $class1, Classement $class2): int
	{
		if ($class1->getPts() != $class2->getPts())
			return $class2->getPts() - $class1->getPts();

        // Si différence particulière, rechercher les matches entre les équipes
        if ($this->egaliteType === EgaliteType::DIFF_PARTICULIERE)
        {
            $clef = $this->getClef($class2->getEquipe(), $class1->getEquipe());
            if (isset($this->diffs[$clef]))
            {
                $diffPart = $this->diffs[$clef];
                if ($diffPart !== 0)
                    return $diffPart;
            }
        }

        // Sinon ou si égalité particulière, rechercher la différence générale
		$diff = ($class2->getPour() - $class2->getContre()) - ($class1->getPour() - $class1->getContre());
		if ($diff != 0)
			return $diff;

		if ($class1->getPour() != $class2->getPour())
			return $class2->getPour() - $class1->getPour();

		return $class2->getMVict() - $class1->getMVict();
    }
    
    /**
     * Construit la clef d'une différence
     */
    private function getClef(Equipe $equipe1, Equipe $equipe2): string
    {
        return "{$equipe1->getId()}_{$equipe2->getId()}";
    }
}
