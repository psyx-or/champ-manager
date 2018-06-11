<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\ArrayCollection;

use App\Entity\Championnat;
use App\Entity\Equipe;
use App\Entity\Classement;
use App\Entity\Journee;
use App\Entity\Match;
use App\DTO\ChampCreationDTO;

/**
 * @Route("/api")
 */
class ChampionnatController extends Controller
{
    /**
     * @Route("/championnat")
     * @Method("GET")
     */
    public function list()
    {
        $repository = $this->getDoctrine()->getRepository(Championnat::class);
        return $this->json($repository->findAll());
    }

    /**
     * @Route("/championnat")
     * @Method("POST")
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("dto", converter="cm_converter")
     */
	public function create(ChampCreationDTO $dto, EntityManagerInterface $entityManager, SerializerInterface $serializer) 
	{
		$championnat = $dto->getChampionnat();

		// Création du sport si besoin
		$sport = $entityManager->merge($championnat->getSport());

		// Création du championnat
		$championnat->setSport($sport);
		$championnat->setTermine(false);

        $entityManager->persist($championnat);
		$entityManager->flush();

		// Création/récuération des équipes
		$equipes = array();
        $repEquipes = $this->getDoctrine()->getRepository(Equipe::class);

		foreach($dto->getEquipes() as $equipe) 
		{
			if (isset($equipe['id'])) 
			{
				array_push($equipes, $repEquipes->find($equipe['id']));
			}
			else 
			{
				$entity = $repEquipes->creeEquipe($equipe['nom'], $sport);
				$entityManager->persist($entity);
				$entityManager->flush();
				array_push($equipes, $entity);
			}
		}

		// Création des classements
		foreach ($equipes as $equipe)
		{
			$classement = new Classement();
			$classement->setChampionnat($championnat);
			$classement->setEquipe($equipe);
			$classement->setPosition(1);
			$classement->setPts(0);
			$classement->setMTotal(0);
			$classement->setMVict(0);
			if ($championnat->getPtnul() != null) $classement->setMNul(0);
			$classement->setMDef(0);
			$classement->setMFo(0);
			$classement->setPenalite(0);
			$classement->setPour(0);
			$classement->setContre(0);
			$entityManager->persist($classement);
		}

		// Création des journées
		if (count($equipes) % 2 == 1)
			array_push($equipes, null);

		$nbEquipes = count($equipes);
		$nbJournees = $nbEquipes - 1;
		for ($i = 0; $i < $nbJournees; $i++)
		{
			// La journée
			$journee = new Journee();
			$journee->setChampionnat($championnat);
			$journee->setNumero($i+1);
			$entityManager->persist($journee);
			
			// Les matches
			for ($k = 0; $k < $nbEquipes/2; $k++)
			{
				$match = new Match();
				$match->setJournee($journee);
				$match->setValide(false);
				$match->setForfait1(false);
				$match->setForfait2(false);

				$equipes_match = array(
					$equipes[($i + $k) % $nbJournees],
					$k==0 ?
						$equipes[$nbEquipes - 1] :
						$equipes[($i + $nbEquipes - $k - 1) % $nbJournees]);

				if ($k==0)
				{
					$match->setEquipe1($equipes_match[$i % 2]);
					$match->setEquipe2($equipes_match[($i+1) % 2]);
				}
				else
				{
					$match->setEquipe1($equipes_match[$k % 2]);
					$match->setEquipe2($equipes_match[($k+1) % 2]);
				}
				$entityManager->persist($match);
			}
		}

		$entityManager->flush();

		return $this->json($championnat);
	}
}
