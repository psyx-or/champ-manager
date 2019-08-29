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

		$param = new Parametre();
		$param->setNom("SEUIL_FORFAIT_WARN")
			  ->setDescription("Nombre de forfaits déclenchant un avertissement")
			  ->setType(ParametreType::NOMBRE)
			  ->setValeur("3");
		$em->persist($param);

		$param = new Parametre();
		$param->setNom("SEUIL_FORFAIT_DANGER")
			  ->setDescription("Nombre de forfaits déclenchant une alerte")
			  ->setType(ParametreType::NOMBRE)
			  ->setValeur("4");
		$em->persist($param);

		$param = new Parametre();
		$param->setNom("MAIL_MDPCHAMP_OBJET")
			->setDescription("Objet du mail de changement de mot de passe pour les championnats")
			->setType(ParametreType::STR)
			->setValeur('Identifiants pour valider les résultats des rencontres de $champ');
		$em->persist($param);

		$param = new Parametre();
		$param->setNom("MAIL_MDPCHAMP_VALEUR")
			->setDescription("Contenu du mail de changement de mot de passe pour les championnats")
			->setType(ParametreType::TEXTE)
			->setValeur('Bonjour,

Vous pouvez désormais valider les résultats du championnat $champ sur le site de la FSGT38:

Site: https://clubs.fsgt38.org/admin
Identifiant: $login
Mot de passe: $password

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
