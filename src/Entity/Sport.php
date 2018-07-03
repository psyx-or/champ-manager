<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
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

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ChampModele", mappedBy="sport")
     */
    private $champModeles;

    public function __construct()
    {
        $this->equipes = new ArrayCollection();
        $this->championnats = new ArrayCollection();
        $this->champModeles = new ArrayCollection();
    }

	/**
	 * @Groups({"simple"})
	 */
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
    public function getEquipes(): Collection
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
    public function getChampionnats(): Collection
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

    /**
     * @return Collection|ChampModele[]
     */
    public function getChampModeles(): Collection
    {
        return $this->champModeles;
    }

    public function addChampModele(ChampModele $champModele): self
    {
        if (!$this->champModeles->contains($champModele)) {
            $this->champModeles[] = $champModele;
            $champModele->setSport($this);
        }

        return $this;
    }

    public function removeChampModele(ChampModele $champModele): self
    {
        if ($this->champModeles->contains($champModele)) {
            $this->champModeles->removeElement($champModele);
            // set the owning side to null (unless already changed)
            if ($champModele->getSport() === $this) {
                $champModele->setSport(null);
            }
        }

        return $this;
    }
}
