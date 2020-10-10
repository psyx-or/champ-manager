<?php

namespace App\Repository;

use App\Entity\FPFeuille;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FPFeuille|null find($id, $lockMode = null, $lockVersion = null)
 * @method FPFeuille|null findOneBy(array $criteria, array $orderBy = null)
 * @method FPFeuille[]    findAll()
 * @method FPFeuille[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FPFeuilleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FPFeuille::class);
    }

//    /**
//     * @return FPFeuille[] Returns an array of FPFeuille objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?FPFeuille
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
