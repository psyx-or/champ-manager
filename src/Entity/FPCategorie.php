<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\FPCategorieRepository")
 */
class FPCategorie
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

	/**
	 * @ORM\ManyToOne(targetEntity="App\Entity\FPForm", inversedBy="categories")
	 * @ORM\JoinColumn(nullable=false)
	 */
    private $form;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $libelle;

    /**
     * @ORM\Column(type="smallint")
     */
    private $ordre;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\FPQuestion", mappedBy="categorie", orphanRemoval=true, cascade={"all"})
	 * @ORM\OrderBy({"ordre" = "ASC"})
	 */
    private $questions;

    public function __construct()
    {
        $this->questions = new ArrayCollection();
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

    public function getForm(): ? FPForm
    {
        return $this->form;
    }

    public function setForm(? FPForm $form): self
    {
        $this->form = $form;

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

	/**
	 * @Groups({"simple"})
	 */
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
	 * @Groups({"simple"})
	 * @return Collection|FPQuestion[]
	 */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(FPQuestion $question): self
    {
        if (!$this->questions->contains($question)) {
            $this->questions[] = $question;
            $question->setCategorie($this);
        }

        return $this;
    }

    public function removeQuestion(FPQuestion $question): self
    {
        if ($this->questions->contains($question)) {
            $this->questions->removeElement($question);
            // set the owning side to null (unless already changed)
            if ($question->getCategorie() === $this) {
                $question->setCategorie(null);
            }
        }

        return $this;
    }
}
