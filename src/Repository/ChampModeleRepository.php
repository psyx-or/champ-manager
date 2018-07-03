<?php

namespace App\Repository;

use App\Entity\ChampModele;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method ChampModele|null find($id, $lockMode = null, $lockVersion = null)
 * @method ChampModele|null findOneBy(array $criteria, array $orderBy = null)
 * @method ChampModele[]    findAll()
 * @method ChampModele[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ChampModeleRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, ChampModele::class);
    }

//    /**
//     * @return ChampModele[] Returns an array of ChampModele objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ChampModele
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
