<?php

namespace App\Repository;

use App\Entity\Match;
use App\Entity\Championnat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Match|null find($id, $lockMode = null, $lockVersion = null)
 * @method Match|null findOneBy(array $criteria, array $orderBy = null)
 * @method Match[]    findAll()
 * @method Match[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MatchRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Match::class);
    }

    /**
	 * Récupère tous les matches d'un championnat
     * @return Match[] Returns an array of Match objects
     */
    public function findByChampionnat(Championnat $champ)
    {
		return $this->createQueryBuilder('m')
			->join("m.journee", "j")
            ->andWhere('j.championnat = :champ')
            ->setParameter("champ", $champ)
            ->getQuery()
            ->getResult()
        ;
    }

    /*
    public function findOneBySomeField($value): ?Match
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
