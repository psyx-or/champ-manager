<?php

namespace App\Outils;

use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Command\Command;

class DumpCommand extends Command
{
    protected static $defaultName = 'app:dump';

    protected function configure()
    {
        $this
            ->setDescription("Sauvegarde de la base de données")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
		$io = new SymfonyStyle($input, $output);

		$io->title("Dump de la base");

		$mysqlDatabaseName = 'db746397900';
		$mysqlUserName = 'dbo746397900';
		$mysqlPassword = 'Didier38%';
		$mysqlHostName = 'db746397900.db.1and1.com';
		$mysqlExportPath = '../dumps/dump.'.date('D').'.sql.gz';

		$worked = -1;
		$output = array();

		$command = 'mysqldump --opt -h' . $mysqlHostName . ' -u' . $mysqlUserName . ' -p' . $mysqlPassword . ' ' . $mysqlDatabaseName . ' | gzip > ' . $mysqlExportPath;
		exec($command, $output, $worked);
		switch ($worked) {
			case 0:
				$io->success('Sauvegarde terminée');
				break;
			case 1:
				$io->error('Erreur lors de la sauvegarde');
				break;
			case 2:
				$io->error('Erreur lors de la sauvegarde');
				break;
			default:
				$io->caution("Code retour inconnu: $worked");
				break;
		}
	}
}
