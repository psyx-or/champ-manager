<?php

namespace App\Repository;

use App\Entity\SanctionBareme;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SanctionBareme|null find($id, $lockMode = null, $lockVersion = null)
 * @method SanctionBareme|null findOneBy(array $criteria, array $orderBy = null)
 * @method SanctionBareme[]    findAll()
 * @method SanctionBareme[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SanctionBaremeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SanctionBareme::class);
    }

    // /**
    //  * @return SanctionBareme[] Returns an array of SanctionBareme objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('b.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?SanctionBareme
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
