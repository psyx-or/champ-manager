<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\ArrayCollection;

use App\Entity\Championnat;
use App\Entity\Equipe;
use App\Entity\Sport;
use App\Outils\Annuaire;
use App\Entity\Parametre;
use App\Outils\Mail;
use App\Outils\Outils;
use Exception;

/**
 * @Route("/api")
 */
class EquipeController extends CMController
{
	/**
	 * @Route("/equipe/recherche", methods={"GET"})
	 */
    public function recherche(Request $request, EntityManagerInterface $entityManager)
    {
		$q = $request->query->get('q');

		$query = $entityManager->createQuery(
			"SELECT e
			 FROM App\Entity\Equipe e
			 JOIN e.sport s
			 WHERE e.nom LIKE :q
			 ORDER BY e.nom, s.nom");

		$query->setParameter("q", '%'.$q.'%');
		$query->setMaxResults(10);

        return $this->groupJson($query->getResult(), 'simple', 'sport');
	}

	/**
	 * @Route("/equipe/{id}", requirements={"id"="\d+"}, methods={"GET"})
	 */
    public function getEquipe(Equipe $equipe, Request $request, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
    {
		$saison = $request->query->get('saison');

		$groupes = array('simple', 'coordonnees');
		
		if (true === $authChecker->isGranted('ROLE_USER') || true === $authChecker->isGranted('ROLE_CHAMP')) {
			array_push($groupes, 'responsables');
		}
		if (true === $authChecker->isGranted('ROLE_ADMIN')) {
			array_push($groupes, 'championnats');
		}

		$query = $entityManager->createQuery(
			"SELECT e, classe, champ
			 FROM App\Entity\Equipe e
			 JOIN e.classements classe
			 JOIN classe.championnat champ
			 WHERE champ.saison = :saison
			   AND e = :equipe"
		);

		$query->setParameter("equipe", $equipe);
		$query->setParameter("saison", $saison);

		$res = $query->getResult();

		// Si l'équipe n'est pas engagée pour cette saison, on ne la trouvera pas
		if (count($res) === 0)
		{
			$query = $entityManager->createQuery(
				"SELECT e
				 FROM App\Entity\Equipe e
				 WHERE e = :equipe"
			);
	
			$query->setParameter("equipe", $equipe);
	
			$res = $query->getResult();
		}

        return $this->groupJson($res[0], ...$groupes);
	}

	/**
	 * @Route("/equipe/{nom}", methods={"GET"})
	 */
    public function listeSport(Sport $sport)
    {
        $repository = $this->getDoctrine()->getRepository(Equipe::class);
        return $this->groupJson($repository->findBy(['sport' => $sport], ['nom' => 'ASC']), 'simple');
	}

	/**
	 * @Route("/equipe/{nom}/annuaire", methods={"GET"})
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function annuaire(Sport $sport, Request $request, EntityManagerInterface $entityManager)
	{
		$saison = $request->query->get('saison');

		// On crée l'archive
		$zip = new \ZipArchive();
		$fic = "../var/annuaire.zip";
		if ($zip->open($fic, \ZipArchive::OVERWRITE | \ZipArchive::CREATE) !== true) {
			throw new Exception("Impossible de créer le fichier $fic");
		}

		// On itère sur les championnats
		$query = array('sport' => $sport, 'saison' => $saison);
        $repository = $this->getDoctrine()->getRepository(Championnat::class);

		foreach ($repository->findBy($query) as $champ)
		{
			$nomFic = $champ->getNom().".xlsx";
			$query = $entityManager->createQuery(
				"SELECT e
				 FROM App\Entity\Equipe e
				 JOIN e.classements classe
				 WHERE classe.championnat = :champ
				 ORDER BY e.nom"
			);

			$query->setParameter("champ", $champ);
			
			$ftmp = Annuaire::genere($query->getResult(), "annu_$nomFic");
			$zip->addFile($ftmp, $nomFic);
		}

		$zip->close();

		array_map('unlink', glob("../var/annu_*.*"));

		return $this->file($fic, "Annuaire ".$sport->getNom()." - ".date('Y-m-d').".zip");
	}

	/**
	 * @Route("/equipe/{nom}/detail", methods={"GET"})
	 */
    public function listeSportSaisonDetail(Sport $sport, Request $request, EntityManagerInterface $entityManager, AuthorizationCheckerInterface $authChecker)
    {
		$saison = $request->query->get('saison');
		$groupes = array('simple', 'coordonnees', 'championnats');

		if (true === $authChecker->isGranted('ROLE_ADMIN')) {
			array_push($groupes, 'responsables');
		}

        return $this->groupJson($this->getEquipes($sport, $saison, $entityManager), ...$groupes);
	}

	/**
	 * Renvoie toutes les équipes d'un sport pour une saison donnée
	 */
	private function getEquipes(Sport $sport, $saison, EntityManagerInterface $entityManager)
	{
		$query = $entityManager->createQuery(
			"SELECT e, classe, champ
			 FROM App\Entity\Equipe e
			 JOIN e.classements classe
			 JOIN classe.championnat champ
			 WHERE champ.saison = :saison
			   AND champ.sport = :sport
			 ORDER BY e.nom"
		);

		$query->setParameter("sport", $sport);
		$query->setParameter("saison", $saison);

		return $query->getResult();
	}

	/**
	 * @Route("/equipe/", methods={"POST"})
	 * @IsGranted("ROLE_USER")
	 * @ParamConverter("equipes", converter="cm_converter", options={"classe":"App\Entity\Equipe[]"})
	 */
	public function majEquipe(array $equipes, EntityManagerInterface $entityManager, UserPasswordEncoderInterface $encoder, AuthorizationCheckerInterface $authChecker)
	{
		$repository = $this->getDoctrine()->getRepository(Equipe::class);

		foreach ($equipes as $equipe)
		{
			if (false === $authChecker->isGranted('ROLE_ADMIN') && $equipe->getId() != $this->getUser()->getId())
				throw $this->createAccessDeniedException();

			$entite = $repository->find($equipe->getId());

			$entite->setNom($equipe->getNom());

			$changeMdp = $entite->getPassword() == null;

			foreach ($entite->getResponsables() as $entiteResp)
			{
				$resp = $this->getItem($equipe->getResponsables(), $entiteResp->getId());
				if ($resp == null || $this->estVide($resp->getNom()))
				{
					$changeMdp = true;
					$entite->removeResponsable($entiteResp);
				}
				else
				{
					$changeMdp = $changeMdp || ($entiteResp->getMail() != trim($resp->getMail()));
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
					$changeMdp = true;
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

			if ($equipe->getMaillot() != null && trim($equipe->getMaillot()) != "")
				$entite->setMaillot(trim($equipe->getMaillot()));
			else
				$entite->setMaillot(null);

			if ($changeMdp && true === $authChecker->isGranted('ROLE_ADMIN'))
				Mail::envoie($this->changeMdp($entite, $entityManager, $encoder), $this->getDoctrine());
		}

		$entityManager->flush();

		return $this->json(count($equipes));
	}

	/**
	 * @Route("/equipe/{id}/mdp", methods={"POST"})
	 * @IsGranted("ROLE_USER")
	 * @ParamConverter("equipe", converter="doctrine.orm")
	 */
	public function setMdp(Equipe $equipe, Request $request, EntityManagerInterface $entityManager, UserPasswordEncoderInterface $encoder, AuthorizationCheckerInterface $authChecker)
	{
		if (false === $authChecker->isGranted('ROLE_ADMIN') && $equipe->getId() != $this->getUser()->getId())
			throw $this->createAccessDeniedException();

		$encoded = $encoder->encodePassword($equipe, $request->getContent());

		$equipe->setPassword($encoded);
		$entityManager->flush();

		return $this->json("ok");
	}

	/**
	 * @Route("/equipe/{id}", methods={"PATCH"})
	 * @IsGranted("ROLE_ADMIN")
	 */
	public function envoiMdpManuel(Equipe $equipe, EntityManagerInterface $entityManager, UserPasswordEncoderInterface $encoder)
	{
		return $this->json($this->changeMdp($equipe, $entityManager, $encoder));
	}

	/**
	 * Change le mot de passe d'une équipe et renvoie les infos du mail
	 */
	private function changeMdp(Equipe $equipe, EntityManagerInterface $entityManager, UserPasswordEncoderInterface $encoder)
	{
		$plainPassword = Outils::changeMdp($equipe, $entityManager, $encoder);

		$repository = $this->getDoctrine()->getRepository(Parametre::class);

		return array(
			"destinataires" => Mail::getDestinataires($equipe),
			"objet" => $repository->find(Parametre::MAIL_MDP_OBJET)->getValeur(),
			"corps" => str_replace('$password', $plainPassword, str_replace('$equipe', $equipe->getLogin(), $repository->find(Parametre::MAIL_MDP_VALEUR)->getValeur())));
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
}
