<?php

namespace App\Repository;

use App\Entity\SanctionCategorie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SanctionCategorie|null find($id, $lockMode = null, $lockVersion = null)
 * @method SanctionCategorie|null findOneBy(array $criteria, array $orderBy = null)
 * @method SanctionCategorie[]    findAll()
 * @method SanctionCategorie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SanctionCategorieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SanctionCategorie::class);
    }

    /**
     * @return SanctionCategorie Returns an array of SanctionCategorie objects
     */
    public function findByLibelle($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.libelle = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
