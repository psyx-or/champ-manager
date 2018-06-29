<?php

namespace App\Repository;

use App\Entity\FPQuestion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method FPQuestion|null find($id, $lockMode = null, $lockVersion = null)
 * @method FPQuestion|null findOneBy(array $criteria, array $orderBy = null)
 * @method FPQuestion[]    findAll()
 * @method FPQuestion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FPQuestionRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, FPQuestion::class);
    }

//    /**
//     * @return FPQuestion[] Returns an array of FPQuestion objects
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
    public function findOneBySomeField($value): ?FPQuestion
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
