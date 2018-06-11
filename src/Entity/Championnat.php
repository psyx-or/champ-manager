<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ChampionnatRepository")
 */
class Championnat
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Sport", inversedBy="championnats")
     * @ORM\JoinColumn(nullable=false, name="sport", referencedColumnName="nom")
     */
    private $sport;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $saison;

    /**
     * @ORM\Column(type="smallint")
     */
    private $ptvict;

    /**
     * @ORM\Column(type="smallint", nullable=true)
     */
    private $ptnul;

    /**
     * @ORM\Column(type="smallint")
     */
    private $ptdef;

    /**
     * @ORM\Column(type="championnatType")
     */
    private $type;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Classement", mappedBy="championnat", orphanRemoval=true)
     */
    private $classements;

    /**
     * @ORM\Column(type="boolean")
     */
    private $termine;

    public function __construct()
    {
        $this->classements = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getSport(): ?Sport
    {
        return $this->sport;
    }

    public function setSport(?Sport $sport): self
    {
        $this->sport = $sport;

        return $this;
    }

    public function getSaison(): ?string
    {
        return $this->saison;
    }

    public function setSaison(string $saison): self
    {
        $this->saison = $saison;

        return $this;
    }

    public function getPtvict(): ?int
    {
        return $this->ptvict;
    }

    public function setPtvict(int $ptvict): self
    {
        $this->ptvict = $ptvict;

        return $this;
    }

    public function getPtnul(): ?int
    {
        return $this->ptnul;
    }

    public function setPtnul(?int $ptnul): self
    {
        $this->ptnul = $ptnul;

        return $this;
    }

    public function getPtdef(): ?int
    {
        return $this->ptdef;
    }

    public function setPtdef(int $ptdef): self
    {
        $this->ptdef = $ptdef;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return Collection|Classement[]
     */
    public function getClassements(): Collection
    {
        return $this->classements;
    }

    public function addClassement(Classement $classement): self
    {
        if (!$this->classements->contains($classement)) {
            $this->classements[] = $classement;
            $classement->setChampionnat($this);
        }

        return $this;
    }

    public function removeClassement(Classement $classement): self
    {
        if ($this->classements->contains($classement)) {
            $this->classements->removeElement($classement);
            // set the owning side to null (unless already changed)
            if ($classement->getChampionnat() === $this) {
                $classement->setChampionnat(null);
            }
        }

        return $this;
    }

    public function getTermine(): ?bool
    {
        return $this->termine;
    }

    public function setTermine(bool $termine): self
    {
        $this->termine = $termine;

        return $this;
    }
}
