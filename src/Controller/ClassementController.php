<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Championnat;
use App\Entity\ChampionnatType;
use App\Entity\Classement;
use App\Entity\Equipe;
use App\DTO\ChampionnatEquipeDTO;
use App\Outils\MatchFunctions;
use App\Outils\Classements;

/**
 * @Route("/api")
 */
class ClassementController extends CMController
{
	/**
	 * @Route("/classement/{id}", requirements={"id"="\d+"}, methods={"GET"})
	 */
    public function getClassement(Championnat $championnat)
    {
        return $this->groupJson($championnat, 'simple', 'classement');
    }

	/**
	 * @Route("/classement/equipe/{id}", methods={"GET"})
	 */
	public function getClassementsEquipe(Equipe $equipe, Request $request, EntityManagerInterface $entityManager)
	{
		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT c
			 FROM App\Entity\Championnat c
			 JOIN c.classements class
			 WHERE class.equipe = :equipe
			   AND c.saison = :saison
			 ORDER BY c.id DESC"
		);

		$query->setParameter("equipe", $equipe);
		$query->setParameter("saison", $saison);

		$res = new ChampionnatEquipeDTO();
		$res->setEquipe($equipe);
		$res->setChampionnats($query->getResult());

		return $this->groupJson($res, 'simple', 'classement');
	}

	/**
	 * @Route("/classement/equipe/{id}/historique", methods={"GET"})
	 */
	public function getHistoriqueClassementsEquipe(Equipe $equipe, EntityManagerInterface $entityManager)
	{
		$query = $entityManager->createQuery(
			"SELECT c, class
			 FROM App\Entity\Championnat c
			 JOIN c.classements class
			 WHERE class.equipe = :equipe
			 ORDER BY c.id DESC"
		);

		$query->setParameter("equipe", $equipe);

		$res = new ChampionnatEquipeDTO();
		$res->setEquipe($equipe);
		$res->setChampionnats($query->getResult());

		return $this->groupJson($res, 'simple', 'classement');
	}

	/**
	 * @Route("/classement/{id}", methods={"PATCH"})
	 * @IsGranted("ROLE_CHAMP")
	 * @ParamConverter("championnat", converter="doctrine.orm")
	 * @ParamConverter("classements", converter="cm_converter", options={"classe":"App\Entity\Classement[]"})
	 */
	public function majPenalites(Championnat $championnat, array $classements, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
	{
		// Petits contrôles pour les petits malins
		if (false === $authChecker->isGranted('ROLE_ADMIN')) {
			if ($championnat->getId() != $this->getUser()->getId())
				throw $this->createAccessDeniedException();
		}

		// C'est bon
		$repository = $this->getDoctrine()->getRepository(Classement::class);

		foreach ($classements as $class) {
			$entity = $repository->findOneBy(['championnat' => $championnat, 'equipe' => $class->getEquipe()]);

			// Si pas de modif, on passe
			if ($entity->getPenalite() == $class->getPenalite())
				continue;

			$entity->setPenalite($class->getPenalite());
		}

		// Recalcul du classement des championnats
		if ($championnat != null && $championnat->getType() != ChampionnatType::COUPE)
			MatchFunctions::calculeClassement($championnat, $entityManager);

		$entityManager->flush();

		return $this->getClassement($championnat);
	}

	/**
	 * @Route("/classement/export", methods={"GET"})
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function export(Request $request, EntityManagerInterface $entityManager)
	{
		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT s, c, class
			 FROM App\Entity\Sport s
			 JOIN s.championnats c
			 JOIN c.classements class
			 WHERE c.saison = :saison
			 ORDER BY s.nom, c.nom "
		);

		$query->setParameter("saison", $saison);

		$ftmp = Classements::genere($query->getResult());

		return $this->file($ftmp, "Classements ".str_replace("/","-",$saison).".".date('Y-m-d').".xlsx");
	}
}
