<?php

namespace App\OldMigration;

use App\Entity\Championnat;
use App\Entity\ChampionnatType;
use App\Entity\Classement;
use App\Entity\Equipe;
use App\Outils\MatchFunctions;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use App\Repository\ChampionnatRepository;
use Symfony\Component\Console\Command\Command;

class InsertCoupeClassementCommand extends Command
{
	protected static $defaultName = 'app:add-coupe-class';

	/** @var EntityManagerInterface */
	private $entityManager;
	/** @var ChampionnatRepository */
	private $repChampionnat;

	public function __construct(EntityManagerInterface $entityManager, ChampionnatRepository $repChampionnat)
	{
		$this->entityManager = $entityManager;
		$this->repChampionnat = $repChampionnat;

		parent::__construct();
	}

	protected function configure()
	{
		$this
			->setDescription("Ajout des classements pour les coupes");
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$io = new SymfonyStyle($input, $output);

		$io->title("Ajout des classements pour les coupes");

		$champs = $this->repChampionnat->findBy([ "type" => ChampionnatType::COUPE]);
		foreach ($champs as $champ)
		{
			$this->traite($champ, $io);
			MatchFunctions::calculeClassement($champ, $this->entityManager);
		}
		
		$this->entityManager->flush();

		$io->success('Ajout terminé');
	}

	private function traite(Championnat $champ, SymfonyStyle $io)
	{
		$io->text("Traitement de ".$champ->getNom()."...");

		$equipes = array();

		foreach ($champ->getJournees() as $journee)
		{
			foreach ($journee->getMatches() as $match)
			{
				$this->add($match->getEquipe1(), $equipes);
				$this->add($match->getEquipe2(), $equipes);
			}
		}

		foreach ($equipes as $equipeId => $equipe) 
		{
			$classement = new Classement();
			$champ->addClassement($classement);
			$classement->setEquipe($equipe);
			$classement->setPosition(1);
			$classement->setPenalite(0);
			MatchFunctions::initClassements($champ, $classement);
			$this->entityManager->persist($classement);
		}
	}

	private function add(?Equipe $equipe, array &$equipes)
	{
		if ($equipe == null) return;
		$equipes[$equipe->getId()] = $equipe;
	}
}
