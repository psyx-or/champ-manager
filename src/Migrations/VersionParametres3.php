<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;
use App\Entity\Parametre;
use App\Entity\ParametreType;

final class VersionParametres3 extends AbstractMigration implements ContainerAwareInterface
{
	use ContainerAwareTrait;

	public function up(Schema $schema) : void
    {
		$em = $this->container->get('doctrine.orm.entity_manager');

		$param = new Parametre();
		$param->setNom("DUREE_SAISIE")
			  ->setDescription("Nombre de jours pour saisir un résultat (à partir de la date de fin de la journée)")
			  ->setType(ParametreType::NOMBRE)
			  ->setValeur("14");
		$em->persist($param);

		$param = new Parametre();
		$param->setNom("FP_DUREE");
		$param = $em->merge($param);
		$em->remove($param);

		$em->flush();
    }

    public function down(Schema $schema) : void
    {
    }
}
