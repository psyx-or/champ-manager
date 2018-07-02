<?php

namespace App\Repository;

use App\Entity\FPReponse;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method FPReponse|null find($id, $lockMode = null, $lockVersion = null)
 * @method FPReponse|null findOneBy(array $criteria, array $orderBy = null)
 * @method FPReponse[]    findAll()
 * @method FPReponse[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FPReponseRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, FPReponse::class);
    }

//    /**
//     * @return FPReponse[] Returns an array of FPReponse objects
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
    public function findOneBySomeField($value): ?FPReponse
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
