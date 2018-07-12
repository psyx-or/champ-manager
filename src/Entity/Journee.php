<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
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
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $debut;

	/**
	 * @ORM\Column(type="datetime", nullable=true)
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

	/**
	 * @Groups({"hierarchie", "doublon"})
	 */
    public function getChampionnat(): ?Championnat
    {
        return $this->championnat;
    }

    public function setChampionnat(?Championnat $championnat): self
    {
        $this->championnat = $championnat;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getNumero(): ?int
    {
        return $this->numero;
    }

    public function setNumero(int $numero): self
    {
        $this->numero = $numero;

        return $this;
	}

	/**
	 * Renvoie le libellé de la journée
	 * @Groups({"simple"})
	 */
	public function getLibelle()
	{
		if ($this->numero > 0) return "Journée " . $this->numero;
		if ($this->numero == -1) return "Finale";
		return "1/" . (2 ** (-$this->numero - 1)) . " Finale";
	}

	/**
	 * @Groups({"simple"})
	 */
    public function getDebut(): ?\DateTimeInterface
    {
        return $this->debut;
    }

    public function setDebut(?\DateTimeInterface $debut): self
    {
        $this->debut = $debut;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
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
	 * @Groups({"matches", "hierarchie"})
     * @return Collection|Match[]
     */
    public function getMatches(): Collection
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
