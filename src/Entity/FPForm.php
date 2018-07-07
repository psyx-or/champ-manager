<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\FPFormRepository")
 */
class FPForm
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $libelle;

    /**
     * @ORM\Column(type="boolean")
     */
    private $obsolete;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\FPCategorie", mappedBy="form", orphanRemoval=true, cascade={"all"})
	 * @ORM\OrderBy({"ordre" = "ASC"})
	 */
    private $categories;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Championnat", mappedBy="fpForm")
     */
    private $championnats;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ChampModele", mappedBy="fpForm")
     */
    private $champModeles;

    public function __construct()
    {
        $this->categories = new ArrayCollection();
        $this->championnats = new ArrayCollection();
        $this->champModeles = new ArrayCollection();
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getId()
    {
        return $this->id;
    }

	public function setId($id) : self
	{
		$this->id = $id;

		return $this;
	}

	/**
	 * @Groups({"simple"})
	 */
    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): self
    {
        $this->libelle = $libelle;

        return $this;
    }

    public function getObsolete(): ?bool
    {
        return $this->obsolete;
    }

    public function setObsolete(bool $obsolete): self
    {
        $this->obsolete = $obsolete;

        return $this;
    }

	/**
	 * @Groups({"complet"})
	 * @return Collection|FPCategorie[]
	 */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(FPCategorie $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories[] = $category;
            $category->setForm($this);
        }

        return $this;
    }

    public function removeCategory(FPCategorie $category): self
    {
        if ($this->categories->contains($category)) {
            $this->categories->removeElement($category);
            // set the owning side to null (unless already changed)
            if ($category->getForm() === $this) {
                $category->setForm(null);
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
            $championnat->setFpForm($this);
        }

        return $this;
    }

    public function removeChampionnat(Championnat $championnat): self
    {
        if ($this->championnats->contains($championnat)) {
            $this->championnats->removeElement($championnat);
            // set the owning side to null (unless already changed)
            if ($championnat->getFpForm() === $this) {
                $championnat->setFpForm(null);
            }
        }

        return $this;
    }

	/**
	 * @Groups({"utilisation"})
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
            $champModele->setFpForm($this);
        }

        return $this;
    }

    public function removeChampModele(ChampModele $champModele): self
    {
        if ($this->champModeles->contains($champModele)) {
            $this->champModeles->removeElement($champModele);
            // set the owning side to null (unless already changed)
            if ($champModele->getFpForm() === $this) {
                $champModele->setFpForm(null);
            }
        }

        return $this;
    }
}
