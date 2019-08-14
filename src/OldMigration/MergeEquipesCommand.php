<?php

namespace App\OldMigration;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Proxies\__CG__\App\Entity\Equipe;
use App\Repository\EquipeRepository;

class MergeEquipesCommand extends ContainerAwareCommand
{
	protected static $defaultName = 'app:equipes-fusion';
	
	private $entityManager;

	private $fusions = array(
		228 => 120,
		375 => 377,
		49 => 402,
		70 => 401,
		103 => 237,
		238 => 315,
		161 => 289,
		175 => 229,
		380 => 187,
		240 => 57,
		111 => 314,
		348 => 126,
		297 => 332,
		332 => 117,
		236 => 331,
		331 => 116,
		259 => 169,
		287 => 115,
		245 => 164,
		184 => 389,
		77 => 300,
		69 => 403,
		220 => 338,
		98 => 342,
		336 => 172,
		233 => 165,
		244 => 160,
		381 => 123,
		160 => 386,
		123 => 391,
		171 => 266,
		158 => 388,
		356 => 149,
		219 => 284,
		284 => 112,
		164 => 385,
		136 => 307,
		135 => 307,
		167 => 283,
		52 => 210,
		191 => 383,
		199 => 151,
		208 => 154,
		371 => 384,
		31 => 384,
		189 => 100,
		278 => 83,
		203 => 102,
		291 => 257,
		363 => 162,
		330 => 289,
		273 => 114,
	);

	public function __construct(EntityManagerInterface $entityManager)
	{
		$this->entityManager = $entityManager;

		parent::__construct();
	}

    protected function configure()
    {
        $this
            ->setDescription("Fusion des équipes")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
		$io = new SymfonyStyle($input, $output);

		$io->title("Fusion des anciennes équipes");

		$repEquipes = $this->getContainer()->get('doctrine')->getRepository(Equipe::class);

		foreach ($this->fusions as $old => $new)
			$this->fusionne($old, $new, $io, $repEquipes, $this->entityManager);

		$this->entityManager->flush();

		$io->success('Migration terminée');
	}

	private function fusionne($oldId, $newId, SymfonyStyle $io, EquipeRepository $repEquipes, EntityManagerInterface $entityManager)
	{
		$io->text("Fusion de $oldId vers $newId...");

		$old = $repEquipes->find($oldId);
		$new = $repEquipes->find($newId);

		// Contrôles
		if ($old == null)
		{
			$io->note("Ancienne équipe $oldId non trouvée");
			return;
		}

		if ($new == null)
		{
			$io->caution("Nouvelle équipe $newId non trouvée");
			return;
		}

		$io->text(" -> Fusion de ".$old->getNom()." vers ".$new->getNom());

		if ($old->getPassword() != null)
		{
			$io->caution("Ancienne équipe ".$old->getNom()." avec mot de passe");
			return;
		}

		// Classements
		$query = $entityManager->createQuery(
			"UPDATE App\Entity\Classement c
			 SET c.equipe = :new
			 WHERE c.equipe = :old"
		);
		$query->setParameter("new", $new);
		$query->setParameter("old", $old);
		$nbClassements = $query->execute();

		// Matches
		$query = $entityManager->createQuery(
			"UPDATE App\Entity\Match m
			 SET m.equipe1 = :new
			 WHERE m.equipe1 = :old"
		);
		$query->setParameter("new", $new);
		$query->setParameter("old", $old);
		$nbMatches = $query->execute();

		$query = $entityManager->createQuery(
			"UPDATE App\Entity\Match m
			 SET m.equipe2 = :new
			 WHERE m.equipe2 = :old"
		);
		$query->setParameter("new", $new);
		$query->setParameter("old", $old);
		$nbMatches += $query->execute();

		// Feuilles de fair-play
		$query = $entityManager->createQuery(
			"UPDATE App\Entity\FpFeuille f
			 SET f.equipeRedactrice = :new
			 WHERE f.equipeRedactrice = :old"
		);
		$query->setParameter("new", $new);
		$query->setParameter("old", $old);
		$nbFeuilles = $query->execute();

		$query = $entityManager->createQuery(
			"UPDATE App\Entity\FpFeuille f
			 SET f.equipeEvaluee = :new
			 WHERE f.equipeEvaluee = :old"
		);
		$query->setParameter("new", $new);
		$query->setParameter("old", $old);
		$nbFeuilles += $query->execute();

		// Bilan
		if ($nbClassements == 0 && $nbMatches == 0 && $nbFeuilles == 0)
			$io->note("Aucune mise à jour");

		$io->text(" -> $nbClassements classements, $nbMatches matches modifiés et $nbFeuilles feuilles modifiées");

		// Suppression
		$entityManager->remove($old);
	}
}
