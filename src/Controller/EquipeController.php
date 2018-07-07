<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Equipe;
use App\Entity\Sport;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Common\Collections\ArrayCollection;
use App\Outils\Annuaire;
use App\Entity\Parametre;


/**
 * @Route("/api")
 */
class EquipeController extends CMController
{
    /**
     * @Route("/equipe/{nom}")
     * @Method("GET")
     */
    public function listeSport(Sport $sport)
    {
        $repository = $this->getDoctrine()->getRepository(Equipe::class);
        return $this->groupJson($repository->findBy(['sport' => $sport], ['nom' => 'ASC']), 'simple');
	}

	/**
	 * @Route("/equipe/{nom}/annuaire")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function annuaire(Sport $sport)
	{
		$repository = $this->getDoctrine()->getRepository(Equipe::class);
		$ftmp = Annuaire::genere($repository->findBy(['sport' => $sport], ['nom' => 'ASC']));
		return $this->file($ftmp, "Annuaire ".$sport->getNom()." - ".date('Y-m-d').".xlsx");
	}


	/**
	 * @Route("/equipe/{nom}/detail")
	 * @Method("GET")
	 * @IsGranted("ROLE_ADMIN")
	 */
    public function listeSportSaisonDetail(Sport $sport, Request $request, EntityManagerInterface $entityManager)
    {
		$saison = $request->query->get('saison');

		$query = $entityManager->createQuery(
			"SELECT e
			 FROM App\Entity\Equipe e
			 JOIN e.classements classe
			 JOIN classe.championnat champ
			 WHERE champ.saison = :saison
			   AND champ.sport = :sport
			 ORDER BY e.nom");

		$query->setParameter("sport", $sport);
		$query->setParameter("saison", $saison);

        return $this->groupJson($query->getResult(), 'simple', 'coordonnees');
	}

	/**
	 * @Route("/equipe/")
	 * @Method("POST")
	 * @IsGranted("ROLE_ADMIN")
	 * @ParamConverter("equipes", converter="cm_converter", options={"classe":"App\Entity\Equipe[]"})
	 */
	public function majEquipe(array $equipes, EntityManagerInterface $entityManager)
	{
		// TODO: envoi des mots de passe
		$repository = $this->getDoctrine()->getRepository(Equipe::class);

		foreach ($equipes as $equipe)
		{
			$entite = $repository->find($equipe->getId());

			foreach ($entite->getResponsables() as $entiteResp)
			{
				$resp = $this->getItem($equipe->getResponsables(), $entiteResp->getId());
				if ($resp == null || $this->estVide($resp->getNom()))
				{
					$entite->removeResponsable($entiteResp);
				}
				else
				{
					$entiteResp->setNom(trim($resp->getNom()));
					$entiteResp->setTel1($resp->getTel1());
					$entiteResp->setTel2($resp->getTel2());
					$entiteResp->setMail(trim($resp->getMail()));
				}
			}
			foreach ($equipe->getResponsables() as $resp)
			{
				if ($resp->getId() == null && !$this->estVide($resp->getNom()))
				{
					$entityManager->persist($resp);
					$entite->addResponsable($resp);
				}
			}
			
			$entite->setTerrain($equipe->getTerrain());

			foreach ($entite->getCreneaux() as $entiteCreneau)
			{
				$creneau = $this->getItem($equipe->getCreneaux(), $entiteCreneau->getId());
				if ($creneau == null)
				{
					$entite->removeCreneau($entiteCreneau);
				}
				else
				{
					$entiteCreneau->setJour($creneau->getJour());
					$entiteCreneau->setHeure($creneau->getHeure());
				}
			}
			foreach ($equipe->getCreneaux() as $creneau)
			{
				if ($creneau->getId() == null)
				{
					$entityManager->persist($creneau);
					$entite->addCreneau($creneau);
				}
			}

			if ($equipe->getTerrain() != null && $equipe->getTerrain() != " ")
				$entite->setPosition($equipe->getPosition());
			else
				$entite->setPosition(null);
		}

		$entityManager->flush();

		return $this->json(count($equipes));
	}

	/**
	 * @Route("/equipe/{id}")
	 * @Method("PATCH")
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function changeMdp(Equipe $equipe, EntityManagerInterface $entityManager, UserPasswordEncoderInterface $encoder)
	{
		$plainPassword = $this->makePassword();
		$encoded = $encoder->encodePassword($equipe, $plainPassword);

		$equipe->setPassword($encoded);
		$entityManager->flush();

		$destinataires = array();
		foreach ($equipe->getResponsables() as $resp)
			if ($resp->getMail() != null)
				array_push($destinataires, $resp->getMail());

		$repository = $this->getDoctrine()->getRepository(Parametre::class);

		return $this->json(array(
			"destinataires" => implode(",", $destinataires),
			"objet" => $repository->find(Parametre::MAIL_MDP_OBJET)->getValeur(),
			"corps" => str_replace('$password', $plainPassword, str_replace('$equipe', $equipe->getLogin(), $repository->find(Parametre::MAIL_MDP_VALEUR)->getValeur()))));
	}

	/**
	 * Récupère un élément dans une liste à partir de son identifiant
	 */
	private function getItem(ArrayCollection $items, $id)
	{
		foreach ($items as $item)
			if ($item->getId() == $id)
				return $item;

		return null;
	}

	/**
	 * Indique si une chaîne est vide
	 */
	private function estVide($str)
	{
		return $str == null || trim($str) == "";
	}

	/**
	 * Création de mot de passe
	 */
	private function makePassword()
	{
		$caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$password = "";
		for ($i = 0; $i < 8; $i++)
			$password .= $caracteres[rand(0, strlen($caracteres) - 1)];

		return $password;
	}
}
