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

    public function __construct()
    {
        $this->categories = new ArrayCollection();
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getId()
    {
        return $this->id;
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
	 * @Groups({"simple"})
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
}
