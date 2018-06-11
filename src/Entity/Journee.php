<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\JourneeRepository")
 */
class Journee
{
    /**
     * @ORM\Id()
     * @ORM\ManyToOne(targetEntity="App\Entity\Championnat", inversedBy="journees")
     * @ORM\JoinColumn(nullable=false)
     */
    private $championnat;

    /**
     * @ORM\Id()
     * @ORM\Column(type="smallint")
     */
    private $numero;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $debut;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $fin;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Match", mappedBy="journee", orphanRemoval=true)
     */
    private $matches;

    public function __construct()
    {
        $this->matches = new ArrayCollection();
    }

    public function getChampionnat(): ?Championnat
    {
        return $this->championnat;
    }

    public function setChampionnat(?Championnat $championnat): self
    {
        $this->championnat = $championnat;

        return $this;
    }

    public function getNumero(): ?int
    {
        return $this->numero;
    }

    public function setNumero(int $numero): self
    {
        $this->numero = $numero;

        return $this;
    }

    public function getDebut(): ?\DateTimeInterface
    {
        return $this->debut;
    }

    public function setDebut(?\DateTimeInterface $debut): self
    {
        $this->debut = $debut;

        return $this;
    }

    public function getFin(): ?\DateTimeInterface
    {
        return $this->fin;
    }

    public function setFin(?\DateTimeInterface $fin): self
    {
        $this->fin = $fin;

        return $this;
    }

    /**
     * @return Collection|Match[]
     */
    public function listeMatches(): Collection
    {
        return $this->matches;
    }

    public function addMatch(Match $match): self
    {
        if (!$this->matches->contains($match)) {
            $this->matches[] = $match;
            $match->setJournee($this);
        }

        return $this;
    }

    public function removeMatch(Match $match): self
    {
        if ($this->matches->contains($match)) {
            $this->matches->removeElement($match);
            // set the owning side to null (unless already changed)
            if ($match->getJournee() === $this) {
                $match->setJournee(null);
            }
        }

        return $this;
    }
}
