<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Doctrine\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;
use App\Entity\Parametre;
use App\Entity\ParametreType;

final class VersionParametres extends AbstractMigration implements ContainerAwareInterface
{
	use ContainerAwareTrait;

	public function up(Schema $schema) : void
    {
		$em = $this->container->get('doctrine.orm.entity_manager');

		$param = new Parametre();
		$param->setNom("MAIL_EMETTEUR")
			  ->setDescription("Adresse mail à utiliser comme expéditeur des envois de mail")
			  ->setType(ParametreType::STR)
			  ->setValeur("Nom affiché <xx@xx.com>");
		$em->persist($param);
		
		$param = new Parametre();
		$param->setNom("MAIL_MDP_OBJET")
			  ->setDescription("Objet du mail de changement de mot de passe")
			  ->setType(ParametreType::STR)
			  ->setValeur("Identifiants pour mettre à jour en ligne les résultats des rencontres");
		$em->persist($param);
		
		$param = new Parametre();
		$param->setNom("MAIL_MDP_VALEUR")
			  ->setDescription("Contenu du mail de changement de mot de passe")
			  ->setType(ParametreType::TEXTE)
			  ->setValeur('Bonjour,

Vous pouvez désormais mettre à jour les résultats de votre équipe directement sur le site de la FSGT38:

Site: https://clubs.fsgt38.org/
Identifiant: $equipe
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
