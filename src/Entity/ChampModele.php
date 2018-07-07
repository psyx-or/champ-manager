<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ChampModeleRepository")
 */
class ChampModele
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
    private $nomModele;

	/**
	 * @ORM\ManyToOne(targetEntity="App\Entity\Sport", inversedBy="champModeles")
	 * @ORM\JoinColumn(nullable=false, name="sport", referencedColumnName="nom")
	 */
	private $sport;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom;

    /**
     * @ORM\Column(type="smallint", nullable=true)
     */
    private $ptvict;

    /**
     * @ORM\Column(type="smallint", nullable=true)
     */
    private $ptnul;

    /**
     * @ORM\Column(type="smallint", nullable=true)
     */
    private $ptdef;

    /**
     * @ORM\Column(type="championnatType")
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\FPForm", inversedBy="champModeles")
     */
    private $fpForm;

	/**
	 * @Groups({"simple_modele"})
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
	 * @Groups({"simple_modele", "simple"})
	 */
    public function getNomModele(): ?string
    {
        return $this->nomModele;
    }

    public function setNomModele(string $nomModele): self
    {
        $this->nomModele = $nomModele;

        return $this;
    }

	/**
	 * @Groups({"simple_modele"})
	 */
    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(?string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

	/**
	 * @Groups({"simple_modele"})
	 */
    public function getPtvict(): ?int
    {
        return $this->ptvict;
    }

    public function setPtvict(?int $ptvict): self
    {
        $this->ptvict = $ptvict;

        return $this;
    }

	/**
	 * @Groups({"simple_modele"})
	 */
    public function getPtnul(): ?int
    {
        return $this->ptnul;
    }

    public function setPtnul(?int $ptnul): self
    {
        $this->ptnul = $ptnul;

        return $this;
    }

	/**
	 * @Groups({"simple_modele"})
	 */
    public function getPtdef(): ?int
    {
        return $this->ptdef;
    }

    public function setPtdef(?int $ptdef): self
    {
        $this->ptdef = $ptdef;

        return $this;
    }

	/**
	 * @Groups({"simple_modele"})
	 */
    public function getType()
    {
        return $this->type;
    }

    public function setType($type): self
    {
        $this->type = $type;

        return $this;
    }

	/**
	 * @Groups({"simple_modele"})
	 */
    public function getFpForm(): ?FPForm
    {
        return $this->fpForm;
    }

    public function setFpForm(?FPForm $fpForm): self
    {
        $this->fpForm = $fpForm;

        return $this;
    }

	/**
	 * @Groups({"simple_modele"})
	 */
    public function getSport(): ?Sport
    {
        return $this->sport;
    }

    public function setSport(?Sport $sport): self
    {
        $this->sport = $sport;

        return $this;
    }
}
