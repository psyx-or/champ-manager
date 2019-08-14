<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SanctionCategorieRepository")
 */
class SanctionCategorie
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
	 * @ORM\OneToMany(targetEntity="App\Entity\SanctionBareme", mappedBy="categorie")
	 * @ORM\OrderBy({"libelle" = "ASC"})
	 */
    private $baremes;

    public function __construct()
    {
        $this->baremes = new ArrayCollection();
    }

	/**
	 * @Groups({"bareme"})
	 */
    public function getId(): ?int
    {
        return $this->id;
    }

	public function setId($id): self
	{
		$this->id = $id;

		return $this;
	}

	/**
	 * @Groups({"bareme"})
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

	/**
	 * @Groups({"bareme"})
	 * @return Collection|SanctionBareme[]
	 */
    public function getBaremes(): Collection
    {
        return $this->baremes;
    }

    public function addBareme(SanctionBareme $bareme): self
    {
        if (!$this->baremes->contains($bareme)) {
            $this->baremes[] = $bareme;
            $bareme->setCategorie($this);
        }

        return $this;
    }

    public function removeBareme(SanctionBareme $bareme): self
    {
        if ($this->baremes->contains($bareme)) {
            $this->baremes->removeElement($bareme);
            // set the owning side to null (unless already changed)
            if ($bareme->getCategorie() === $this) {
                $bareme->setCategorie(null);
            }
        }

        return $this;
    }
}
