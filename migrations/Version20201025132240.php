<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201025132240 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE cm_championnat ADD egalite_type ENUM(\'DIFF_GENERALE\', \'DIFF_PARTICULIERE\') DEFAULT NULL COMMENT \'(DC2Type:egaliteType)\'');
        $this->addSql('ALTER TABLE cm_champ_modele ADD egalite_type ENUM(\'DIFF_GENERALE\', \'DIFF_PARTICULIERE\') DEFAULT NULL COMMENT \'(DC2Type:egaliteType)\'');
        $this->addSql('UPDATE cm_champ_modele SET egalite_type = \'DIFF_GENERALE\' WHERE sport=\'Volley\' AND type <> \'COUPE\'');
        $this->addSql('UPDATE cm_champ_modele SET egalite_type = \'DIFF_PARTICULIERE\' WHERE sport<>\'Volley\' AND type <> \'COUPE\'');
        $this->addSql('UPDATE cm_championnat SET egalite_type = \'DIFF_GENERALE\' WHERE sport=\'Volley\' AND type <> \'COUPE\'');
        $this->addSql('UPDATE cm_championnat SET egalite_type = \'DIFF_PARTICULIERE\' WHERE sport<>\'Volley\' AND type <> \'COUPE\'');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE cm_champ_modele DROP egalite_type');
        $this->addSql('ALTER TABLE cm_championnat DROP egalite_type');
    }
}
