<?php

namespace App\Repository;

use App\Entity\FPForm;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method FPForm|null find($id, $lockMode = null, $lockVersion = null)
 * @method FPForm|null findOneBy(array $criteria, array $orderBy = null)
 * @method FPForm[]    findAll()
 * @method FPForm[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FPFormRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, FPForm::class);
    }

//    /**
//     * @return FPForm[] Returns an array of FPForm objects
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
    public function findOneBySomeField($value): ?FPForm
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
