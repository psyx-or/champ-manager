<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SanctionBaremeRepository")
 */
class SanctionBareme
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

	/**
	 * @ORM\ManyToOne(targetEntity="App\Entity\SanctionCategorie", inversedBy="baremes")
	 * @ORM\JoinColumn(nullable=false)
	 */
    private $categorie;

    /**
     * @ORM\Column(type="text")
     */
    private $libelle;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $sanctionJoueur;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $sanctionEquipe;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $sanctionDirigeant;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\Sanction", mappedBy="bareme")
	 */
    private $sanctions;

    /**
     * @ORM\Column(type="boolean")
     */
    private $actif;

    public function __construct()
    {
        $this->sanctions = new ArrayCollection();
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
	 * @Groups({"categorie"})
	 */
    public function getCategorie(): ?SanctionCategorie
    {
        return $this->categorie;
    }

    public function setCategorie(?SanctionCategorie $categorie): self
    {
        $this->categorie = $categorie;

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
	 */
    public function getSanctionJoueur(): ?string
    {
        return $this->sanctionJoueur;
    }

    public function setSanctionJoueur(?string $sanctionJoueur): self
    {
        $this->sanctionJoueur = $sanctionJoueur;

        return $this;
    }

	/**
	 * @Groups({"bareme"})
	 */
    public function getSanctionEquipe(): ?string
    {
        return $this->sanctionEquipe;
    }

    public function setSanctionEquipe(?string $sanctionEquipe): self
    {
        $this->sanctionEquipe = $sanctionEquipe;

        return $this;
    }

	/**
	 * @Groups({"bareme"})
	 */
    public function getSanctionDirigeant(): ?string
    {
        return $this->sanctionDirigeant;
    }

    public function setSanctionDirigeant(?string $sanctionDirigeant): self
    {
        $this->sanctionDirigeant = $sanctionDirigeant;

        return $this;
    }

    /**
     * @return Collection|Sanction[]
     */
    public function getSanctions(): Collection
    {
        return $this->sanctions;
    }

    public function addSanction(Sanction $sanction): self
    {
        if (!$this->sanctions->contains($sanction)) {
            $this->sanctions[] = $sanction;
            $sanction->setBareme($this);
        }

        return $this;
    }

    public function removeSanction(Sanction $sanction): self
    {
        if ($this->sanctions->contains($sanction)) {
            $this->sanctions->removeElement($sanction);
            // set the owning side to null (unless already changed)
            if ($sanction->getBareme() === $this) {
                $sanction->setBareme(null);
            }
        }

        return $this;
    }

	/**
	 * @Groups({"bareme"})
	 */
    public function getActif(): ?bool
    {
        return $this->actif;
    }

    public function setActif(bool $actif): self
    {
        $this->actif = $actif;

        return $this;
    }
}
