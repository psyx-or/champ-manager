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
		$cat->setLibelle("Atteintes administratives");
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

		$em->flush();
    }

    public function down(Schema $schema) : void
    {
    }
}
