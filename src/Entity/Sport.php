<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SportRepository")
 */
class Sport
{
    /**
     * @ORM\Id()
     * @ORM\Column(type="string", length=255)
     */
    private $nom;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Equipe", mappedBy="sport")
     */
    private $equipes;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Championnat", mappedBy="sport")
     */
    private $championnats;

    public function __construct()
    {
        $this->equipes = new ArrayCollection();
        $this->championnats = new ArrayCollection();
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

    /**
     * @return Collection|Equipe[]
     */
    public function listeEquipes(): Collection
    {
        return $this->equipes;
    }

    public function addEquipe(Equipe $equipe): self
    {
        if (!$this->equipes->contains($equipe)) {
            $this->equipes[] = $equipe;
            $equipe->setSport($this);
        }

        return $this;
    }

    public function removeEquipe(Equipe $equipe): self
    {
        if ($this->equipes->contains($equipe)) {
            $this->equipes->removeElement($equipe);
            // set the owning side to null (unless already changed)
            if ($equipe->getSport() === $this) {
                $equipe->setSport(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Championnat[]
     */
    public function listeChampionnats(): Collection
    {
        return $this->championnats;
    }

    public function addChampionnat(Championnat $championnat): self
    {
        if (!$this->championnats->contains($championnat)) {
            $this->championnats[] = $championnat;
            $championnat->setSport($this);
        }

        return $this;
    }

    public function removeChampionnat(Championnat $championnat): self
    {
        if ($this->championnats->contains($championnat)) {
            $this->championnats->removeElement($championnat);
            // set the owning side to null (unless already changed)
            if ($championnat->getSport() === $this) {
                $championnat->setSport(null);
            }
        }

        return $this;
    }
}
