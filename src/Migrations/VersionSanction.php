<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use App\Entity\SanctionCategorie;
use App\Entity\SanctionBareme;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class VersionSanction extends AbstractMigration implements ContainerAwareInterface
{
	use ContainerAwareTrait;

	public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
		$em = $this->container->get('doctrine.orm.entity_manager');

		$cat = new SanctionCategorie();
		$cat->setLibelle("Atteinte administrative");
		$em->persist($cat);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Feuille de match non parvenue dans les délais (8j après le match)")
			->setSanctionEquipe("Match perdu : 0 point")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Falsification de feuille de match")
			->setSanctionEquipe("Match perdu : 0 point")
			->setSanctionDirigeant("De 2 matchs à 6 mois de suspension à l'encontre du dirigeant ou du responsable")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Falsification d'identité")
			->setSanctionEquipe("Match(s) perdu(s) + passage en commission (possibilité d'exclusion)")
			->setSanctionDirigeant("4 matchs")
			->setSanctionJoueur("2 matchs")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Participation à une rencontre d'un joueur suspendu ou non qualifié")
			->setSanctionEquipe("Match perdu")
			->setSanctionDirigeant("2 matchs pour le responsable d'équipe")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Forfaits simple")
			->setSanctionEquipe("Match perdu : 0 point")
			;
		$em->persist($bar);

		// -----------------------------------------------

		$cat = new SanctionCategorie();
		$cat->setLibelle("Fautes relatives au jeu");
		$em->persist($cat);

		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Conduite antisportive")
			->setSanctionJoueur("2 matchs");
		$em->persist($bar);

		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Faute grossière")
			->setSanctionJoueur("3 matchs");
		$em->persist($bar);

		// -----------------------------------------------

		$cat = new SanctionCategorie();
		$cat->setLibelle("Atteinte à l'honneur");
		$em->persist($cat);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Conduite inconvenante")
			->setSanctionDirigeant("1 match de sursis / Répétée : 1 match ferme")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Propos ou gestes excessifs ou déplacés, propos blessants, propos injurieux ou grossiers")
			->setSanctionDirigeant("3 matchs")
			->setSanctionJoueur("2 matchs")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Gestes ou comportements obscènes")
			->setSanctionDirigeant("8 matchs")
			->setSanctionJoueur("3 matchs")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Propos ou comportement racistes ou discriminatoires")
			->setSanctionDirigeant("3 mois")
			->setSanctionJoueur("3 matchs")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Crachats")
			->setSanctionDirigeant("4 mois")
			->setSanctionJoueur("4 matchs")
			;
		$em->persist($bar);

		// -----------------------------------------------

		$cat = new SanctionCategorie();
		$cat->setLibelle("Atteinte morale");
		$em->persist($cat);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Menaces ou intimidations verbales ou physiques")
			->setSanctionDirigeant("12 matchs")
			->setSanctionJoueur("4 matchs")
			;
		$em->persist($bar);

		// -----------------------------------------------

		$cat = new SanctionCategorie();
		$cat->setLibelle("Atteinte physique");
		$em->persist($cat);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Bousculade volontaire")
			->setSanctionDirigeant("12 matchs")
			->setSanctionJoueur("4 matchs")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Tentative de coups")
			->setSanctionDirigeant("12 matchs")
			->setSanctionJoueur("5 matchs")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Brutalité ou coup sans ITT")
			->setSanctionDirigeant("6 mois")
			->setSanctionJoueur("5 matchs (hors temps de jeu : 8 matchs)")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Brutalité ou coup entrainant une ITT de moins de 8 jours")
			->setSanctionDirigeant("6 mois")
			->setSanctionJoueur("8 matchs (hors temps de jeu : 6 mois)")
			;
		$em->persist($bar);
		
		$bar = new SanctionBareme();
		$bar
			->setActif(true)
			->setCategorie($cat)
			->setLibelle("Brutalité ou coup entrainant une ITT de plus de 8 jours")
			->setSanctionDirigeant("5 ans")
			->setSanctionJoueur("12 matchs (hors temps de jeu : 1 an)")
			;
		$em->persist($bar);

		// -----------------------------------------------

		$em->flush();
    }

    public function down(Schema $schema) : void
    {
    }
}
