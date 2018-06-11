<?php

namespace App\Repository;

use App\Entity\Journee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Journee|null find($id, $lockMode = null, $lockVersion = null)
 * @method Journee|null findOneBy(array $criteria, array $orderBy = null)
 * @method Journee[]    findAll()
 * @method Journee[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class JourneeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Journee::class);
    }

//    /**
//     * @return Journee[] Returns an array of Journee objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('j')
            ->andWhere('j.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('j.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Journee
    {
        return $this->createQueryBuilder('j')
            ->andWhere('j.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
