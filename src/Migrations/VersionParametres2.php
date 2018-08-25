<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;
use App\Entity\Parametre;
use App\Entity\ParametreType;

final class VersionParametres2 extends AbstractMigration implements ContainerAwareInterface
{
	use ContainerAwareTrait;

	public function up(Schema $schema) : void
    {
		$em = $this->container->get('doctrine.orm.entity_manager');

		$param = new Parametre();
		$param->setNom("FP_DUREE")
			  ->setDescription("Nombre de jours pour remplir la feuille de fair-play")
			  ->setType(ParametreType::NOMBRE)
			  ->setValeur("7");
		$em->persist($param);

		$param = new Parametre();
		$param->setNom("MAIL_FP_OBJET")
			  ->setDescription("Objet du mail pour la feuille de fair-play")
			  ->setType(ParametreType::STR)
			  ->setValeur("Feuille de fair-play à remplir");
		$em->persist($param);
		
		$param = new Parametre();
		$param->setNom("MAIL_FP_VALEUR")
			  ->setDescription("Contenu du mail pour la feuille de fair-play")
			  ->setType(ParametreType::TEXTE)
			  ->setValeur('Bonjour,

Vous avez $nb jours pour mettre à jour la feuille de fair-play pour le match $equipe1 - $equipe2.

Site: https://clubs.fsgt38.org/

Cordialement,
Le comité de la FSGT38
');
		$em->persist($param);

		$em->flush();
    }

    public function down(Schema $schema) : void
    {
    }
}
