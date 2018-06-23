<?php

namespace App\Repository;

use App\Entity\Equipe;
use App\Entity\Sport;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Equipe|null find($id, $lockMode = null, $lockVersion = null)
 * @method Equipe|null findOneBy(array $criteria, array $orderBy = null)
 * @method Equipe[]    findAll()
 * @method Equipe[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EquipeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Equipe::class);
    }

	/**
	 * Crée une équipe avec un login unique
	 * @param $nom Nom de l'équipe
	 * @param $sport Sport de l'équipe
	 */
	public function creeEquipe(string $nom, Sport $sport): Equipe {

		// Attributs de base
		$equipe = new Equipe();
		$equipe->setNom($nom);
		$equipe->setSport($sport);

		$baselogin = strtolower(preg_replace('/\s+/', '', $nom));
		
		// Creation du login
		$login = $baselogin;
		$i = 1;
		while ($this->findOneBy(array('login' => $login)) != null)
			$login = $baselogin.($i++);

		$equipe->setLogin($login);

		return $equipe;
	}

    /*
    public function findOneBySomeField($value): ?Equipe
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
