<?php

namespace App\Repository;

use App\Entity\FPCategorie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FPCategorie|null find($id, $lockMode = null, $lockVersion = null)
 * @method FPCategorie|null findOneBy(array $criteria, array $orderBy = null)
 * @method FPCategorie[]    findAll()
 * @method FPCategorie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FPCategorieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FPCategorie::class);
    }

//    /**
//     * @return FPCategorie[] Returns an array of FPCategorie objects
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
    public function findOneBySomeField($value): ?FPCategorie
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
