<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\FPQuestionRepository")
 */
class FPQuestion
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\FPCategorie", inversedBy="questions")
     * @ORM\JoinColumn(nullable=false)
     */
    private $categorie;

	/**
	 * @ORM\Column(type="string", length=255)
	 */
	private $titre;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
    private $libelle;

    /**
     * @ORM\Column(type="questionType")
     */
    private $type;

    /**
     * @ORM\Column(type="smallint")
     */
    private $ordre;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\FPReponse", mappedBy="question")
     */
    private $reponses;

    public function __construct()
    {
        $this->reponses = new ArrayCollection();
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

    public function getCategorie(): ?FPCategorie
    {
        return $this->categorie;
    }

    public function setCategorie(?FPCategorie $categorie): self
    {
        $this->categorie = $categorie;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
	public function getTitre() : ? string
	{
		return $this->titre;
	}

	public function setTitre(string $titre) : self
	{
		$this->titre = $titre;

		return $this;
	}

	/**
	 * @Groups({"simple"})
	 */
    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(?string $libelle): self
    {
        $this->libelle = $libelle;

        return $this;
    }

	/**
	 * @Groups({"simple"})
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

    public function getOrdre(): ?int
    {
        return $this->ordre;
    }

    public function setOrdre(int $ordre): self
    {
        $this->ordre = $ordre;

        return $this;
    }

	/**
	 * @Groups({"reponse"})
	 * @return Collection|FPReponse[]
	 */
    public function getReponses(): Collection
    {
        return $this->reponses;
    }

    public function addReponse(FPReponse $reponse): self
    {
        if (!$this->reponses->contains($reponse)) {
            $this->reponses[] = $reponse;
            $reponse->setQuestion($this);
        }

        return $this;
    }

    public function removeReponse(FPReponse $reponse): self
    {
        if ($this->reponses->contains($reponse)) {
            $this->reponses->removeElement($reponse);
            // set the owning side to null (unless already changed)
            if ($reponse->getQuestion() === $this) {
                $reponse->setQuestion(null);
            }
        }

        return $this;
    }
}
