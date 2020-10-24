<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201023175413 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE cm_match ADD date_report DATE DEFAULT NULL');
        $this->addSql('ALTER TABLE cm_parametre CHANGE type type ENUM(\'NOMBRE\', \'STR\', \'TEXTE\') NOT NULL COMMENT \'(DC2Type:championnatType)\'');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE cm_match DROP date_report');
        $this->addSql('ALTER TABLE cm_parametre CHANGE type type ENUM(\'ALLER\', \'ALLER_RETOUR\', \'COUPE\') CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:championnatType)\'');
    }
}
