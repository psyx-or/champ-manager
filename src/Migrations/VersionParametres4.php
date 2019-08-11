<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Doctrine\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;
use App\Entity\Parametre;
use App\Entity\ParametreType;

final class VersionParametres4 extends AbstractMigration implements ContainerAwareInterface
{
	use ContainerAwareTrait;

	public function up(Schema $schema) : void
    {
		$this->addSql("UPDATE cm_fpquestion SET alerte = 1 WHERE titre = 'Vérification des licences'");
	
		$em = $this->container->get('doctrine.orm.entity_manager');

		$em->flush();
    }

    public function down(Schema $schema) : void
    {
    }
}
