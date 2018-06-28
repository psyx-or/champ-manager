<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Championnat;
use App\Entity\ChampionnatType;
use App\Entity\Classement;
use App\Outils\MatchFunctions;

/**
 * @Route("/api")
 */
class ClassementController extends CMController
{
    /**
     * @Route("/classement/{id}")
     * @Method("GET")
     */
    public function getClassement(Championnat $championnat)
    {
        return $this->groupJson($championnat, 'simple', 'classement');
    }

	/**
	 * @Route("/classement/{id}")
	 * @Method("PATCH")
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("championnat", converter="doctrine.orm")
	 * @ParamConverter("classements", converter="cm_converter", options={"classe":"App\Entity\Classement[]"})
	 */
	public function majPenalites(Championnat $championnat, array $classements, EntityManagerInterface $entityManager)
	{
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
}
