<?php

namespace App\Outils;

use App\Entity\Match;
use App\Entity\Equipe;
use App\Entity\Championnat;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Classement;

/**
 * Fonctions outils liées à la gestion des matches
 */
class MatchFunctions {

	/**
	 * Renvoie le vainqueur d'un match (si vainqueur il y a)
	 */
	public static function getVainqueur(Match $match) : ?Equipe
	{
		// Gestion des forfaits
		if ($match->getForfait1() && $match->getForfait2())
			return null;
		if ($match->getForfait1())
			return $match->getEquipe2();
		if ($match->getForfait2())
			return $match->getEquipe1();

		// Gestion du score
		if ($match->getScore1() == $match->getScore2())
			return null;
		else
			return ($match->getScore1() > $match->getScore2()) ? $match->getEquipe1() : $match->getEquipe2();
	}

	/**
	 * Réinitialise une ligne du classement
	 */
	public static function initClassements(Championnat $championnat, Classement $classement)
	{
		$classement->setPts(-$classement->getPenalite());
		$classement->setMTotal(0);
		$classement->setMVict(0);
		if ($championnat->getPtnul() != null) $classement->setMNul(0);
		$classement->setMDef(0);
		$classement->setMFo(0);
		$classement->setPour(0);
		$classement->setContre(0);
	}

	/**
	 * Recalcule un classement complet
	 */
	public static function calculeClassement(Championnat $champ, EntityManagerInterface $entityManager) 
	{
		$classements = $champ->getClassements()->toArray();
		$mapClass = array();

		// Réinitialisation du classement existant
		foreach ($classements as $class) {
			$mapClass[$class->getEquipe()->getId()] = $class;
			MatchFunctions::initClassements($champ, $class);
		}

		// Analyse des matches
		$q = $entityManager->createQuery("SELECT m FROM App\Entity\Match m JOIN m.journee j WHERE j.championnat = :champ")->setParameter("champ", $champ);

		foreach ($q->getResult() as $match) 
		{
			// Si le match n'a pas été joué, on laisse tomber
			if ($match->getScore1() == null && $match->getScore2() == null &&
				!$match->getForfait1() && !$match->getForfait2())
				continue;

			// S'il a été joué, on met à jour le score total
			$vainqueur = MatchFunctions::getVainqueur($match);
			
			MatchFunctions::majClassement(
				$mapClass[$match->getEquipe1()->getId()], $champ,
				$vainqueur,
				$match->getEquipe1(), $match->getForfait1(), $match->getScore1(), $match->getScore2()
			);
			MatchFunctions::majClassement(
				$mapClass[$match->getEquipe2()->getId()], $champ,
				$vainqueur,
				$match->getEquipe2(), $match->getForfait2(), $match->getScore2(), $match->getScore1()
			);
		}

		// On trie les équipes
		usort($classements, ['App\Outils\MatchFunctions', 'compare']);

		// On met à jour les positions
		$i = 1;
		foreach ($classements as $class) {
			if ($i > 1 && MatchFunctions::compare($class, $classements[$i-2]) == 0)
				$class->setPosition($classements[$i - 2]->getPosition());
			else
				$class->setPosition($i);
			
			$i++;
		}
	}

	/**
	 * Calcul des points en fonction du résultat d'un match
	 */
	private static function majClassement(Classement $class, Championnat $champ, ?Equipe $vainqueur, Equipe $equipe, $forfait, $scorePour, $scoreContre)
	{
		$class->setMTotal($class->getMTotal() + 1);
		if ($forfait) 
		{
			$class->setMFo($class->getMFo() + 1);
		}
		else if ($vainqueur == $equipe) 
		{
			$class->setPts($class->getPts() + $champ->getPtvict());
			$class->setMVict($class->getMVict() + 1);
		} 
		else if ($vainqueur == null && $champ->getPtnul() != null)
		{
			$class->setPts($class->getPts() + $champ->getPtnul());
			$class->setMNul($class->getMNul() + 1);
		} 
		else if ($vainqueur != null)
		{
			$class->setPts($class->getPts() + $champ->getPtdef());
			$class->setMDef($class->getMDef() + 1);
		}

		if ($scorePour != null)
			$class->setPour($class->getPour() + $scorePour);
		if ($scoreContre != null)
			$class->setContre($class->getContre() + $scoreContre);
	}

	/**
	 * Compare le classement de deux équipes
	 */
	public static function compare(Classement $class1, Classement $class2)
	{
		if ($class1->getPts() != $class2->getPts())
			return $class2->getPts() - $class1->getPts();

		$diff = ($class2->getPour() - $class2->getContre()) - ($class1->getPour() - $class1->getContre());
		if ($diff != 0)
			return $diff;

		if ($class1->getPour() != $class2->getPour())
			return $class2->getPour() - $class1->getPour();

		return $class2->getMVict() - $class1->getMVict();
	}
}
