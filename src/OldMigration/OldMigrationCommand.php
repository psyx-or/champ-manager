<?php

namespace App\OldMigration;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Sport;
use App\Entity\Equipe;
use App\Entity\Responsable;
use App\Entity\Creneau;
use App\Entity\Championnat;
use App\Entity\ChampionnatType;
use App\Entity\Classement;
use App\Outils\MatchFunctions;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use App\Entity\Journee;
use App\Entity\Match;

class OldMigrationCommand extends ContainerAwareCommand
{
	protected static $defaultName = 'app:old-migration';
	
	private $entityManager;

	public function __construct(EntityManagerInterface $entityManager)
	{
		$this->entityManager = $entityManager;

		parent::__construct();
	}

    protected function configure()
    {
        $this
            ->setDescription("Migration de l'ancien logiciel FSGT")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
		$io = new SymfonyStyle($input, $output);

		// Création des sports
		$sports = array();
		
		$sport = new Sport();
		$sport->setNom("Volley");
		$sports["VOLLEY"] = $this->entityManager->merge($sport);
		$sport = new Sport();
		$sport->setNom("Foot à 7");
		$sports["FOOT A 7"] = $this->entityManager->merge($sport);

		// Ajout des équipes
		$equipes = array("VOLLEY" => array(), "FOOT A 7" => array());
		foreach (DataCommun::$fsgt_equipes as $equipe)
		{
			if ($equipe["sport"] == '') continue;

			$nom = trim($equipe["nom"]);

			$entity = new Equipe();
			$entity->setLogin($equipe["login"]);
			// $entity->setPassword("toto");
			$entity->setSport($sports[$equipe["sport"]]);
			$entity->setNom($nom);
			$entity->setTerrain($equipe["adresse"]);
			$entity->setPosition($equipe["coord"]);

			$equipes[$equipe["sport"]][$nom] = $entity;

			$this->entityManager->persist($entity);

			for ($i = 1; $i <=2; $i++)
			{
				if ($equipe["responsable$i"] != null && $equipe["responsable$i"] != "")
				{
					$resp = new Responsable();
					$resp->setEquipe($entity);
					$resp->setNom($equipe["responsable$i"]);
					$resp->setMail($equipe["mail$i"]);
					$resp->setTel1($equipe["tel$i"]);
					$resp->setTel2($equipe["tel${i}b"]);
					$this->entityManager->persist($resp);
				}
			}

			if ($equipe["jour1"] != null && $equipe["heure1"] != null)
			{
				$creneau = new Creneau();
				$creneau->setEquipe($entity);
				$creneau->setJour($equipe["jour1"] - 1);
				$creneau->setHeure(\DateTime::createFromFormat("Hi", $equipe["heure1"]));
				$this->entityManager->persist($creneau);
			}
		}

		$this->entityManager->flush();

		// Création des championnats et classements
		$repEquipes = $this->getContainer()->get('doctrine')->getRepository(Equipe::class);
		$championnats = array();
		$champSports = array();
		foreach (DataCommun::$psg as $champ)
		{
			$entity = new Championnat();
			$entity->setNom($champ['libelle_champ']);
			$entity->setSport($sports[$champ["sport"]]);
			$entity->setSaison(str_replace(".", " / ", $champ['saison']));
			$entity->setType($champ['nb_tours'] == '1' ? ChampionnatType::ALLER : ChampionnatType::ALLER_RETOUR);
			$entity->setPtvict($champ['pts_vict']);
			$entity->setPtnul($champ['pts_nul']);
			$entity->setPtdef($champ['pts_def']);
			$this->entityManager->persist($entity);

			$champId = $champ['id_champ'];
			$championnats[$champId] = $entity;
			$champSports[$champId] = $champ["sport"];

			$classements = array();
			foreach (DataChamps::${"id_${champId}_classement"} as $class)
			{
				$nom = trim($class['Nom_equipe']);
				if (array_key_exists($nom, $equipes[$champ["sport"]]))
				{
					$equipe = $equipes[$champ["sport"]][$nom];
				}
				else
				{
					$equipe = $repEquipes->creeEquipe($nom, $sports[$champ["sport"]]);

					$equipes[$champ["sport"]][$nom] = $equipe;

					$this->entityManager->persist($equipe);
					$this->entityManager->flush();
				}

				$classement = new Classement();
				$classement->setChampionnat($entity);
				$classement->setEquipe($equipe);
				$classement->setPosition(1);
				$classement->setPts($class['Pts'] - $class['Pts_penal']);
				$classement->setMTotal($class['J']);
				$classement->setMVict($class['G']);
				$classement->setMNul($class['N']);
				$classement->setMDef($class['P']);
				$classement->setMFo(0);
				$classement->setPour($class['BP']);
				$classement->setContre($class['BC']);
				$classement->setPenalite($class['Pts_penal']);
				$this->entityManager->persist($classement);

				array_push($classements, $classement);
			}


			// On trie les équipes
			usort($classements, ['App\Outils\MatchFunctions', 'compare']);

			// On met à jour les positions
			$i = 1;
			foreach ($classements as $class) {
				if ($i > 1 && MatchFunctions::compare($class, $classements[$i-2]) == 0)
					$class->setPosition($classements[$i - 2]->getPosition());
				else
					$class->setPosition($i);
				
				$i++;
			}
		}

		$this->entityManager->flush();

		// Création des matches
		foreach (DataCommun::$psg as $champ)
		{
			$champId = $champ['id_champ'];
			$journees = array();
			foreach (DataChamps::${"id_${champId}_journees"} as $match)
			{
				if (array_key_exists($match['id_journee'], $journees))
				{
					$journee = $journees[$match['id_journee']];
				}
				else
				{
					$journee = new Journee();
					$journee->setChampionnat($championnats[$champId]);
					$journee->setNumero($match['id_journee']);
					$this->entityManager->persist($journee);
					$journees[$match['id_journee']] = $journee;
				}

				$entity = new Match();
				$entity->setJournee($journee);
	
				if ($match['equipe_1'] != 'EXEMPT')
					$entity->setEquipe1($equipes[$champSports[$champId]][trim($match['equipe_1'])]);
				if ($match['equipe_2'] != 'EXEMPT')
					$entity->setEquipe2($equipes[$champSports[$champId]][trim($match['equipe_2'])]);

				$score1 = trim(strtoupper($match['score_1']));
				$score2 = trim(strtoupper($match['score_2']));
				$entity->setForfait1($score1 == 'FO' || $score1 == 'P1' || $score1 == 'P2');
				$entity->setForfait2($score2 == 'FO' || $score2 == 'P1' || $score2 == 'P2');

				if ($match['equipe_1'] != 'EXEMPT' && $match['equipe_2'] != 'EXEMPT' && $score1 != '' && $score2 != '')
				{
					if (!$entity->getForfait1())
						$entity->setScore1($score1);
					if (!$entity->getForfait2())
						$entity->setScore2($score2);
					$entity->setValide(true);
				}

				$this->entityManager->persist($entity);
			}

			$this->entityManager->flush();
		}

        $io->success('Migration terminée');
    }
}
