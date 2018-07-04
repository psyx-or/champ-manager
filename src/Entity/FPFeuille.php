<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\FPFeuilleRepository")
 */
class FPFeuille
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Equipe", inversedBy="fpRedigees")
     * @ORM\JoinColumn(nullable=false)
     */
    private $equipeRedactrice;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Equipe", inversedBy="fpEvaluees")
     * @ORM\JoinColumn(nullable=false)
     */
    private $equipeEvaluee;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $commentaire;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\FPReponse", mappedBy="feuille", orphanRemoval=true, cascade={"all"})
	 */
    private $reponses;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Match", mappedBy="fpFeuille1", cascade={"persist", "remove"})
     */
    private $matchEquipe1;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Match", mappedBy="fpFeuille2", cascade={"persist", "remove"})
     */
    private $matchEquipe2;

    /**
     * @ORM\Column(type="smallint")
     */
    private $ratio;

    public function __construct()
    {
        $this->reponses = new ArrayCollection();
    }

	public function setId($id) : self
	{
		$this->id = $id;

		return $this;
	}

	/**
	 * @Groups({"complet"})
	 */
    public function getId()
    {
        return $this->id;
    }

	/**
	 * @Groups({"complet"})
	 */
    public function getEquipeRedactrice(): ?Equipe
    {
        return $this->equipeRedactrice;
    }

    public function setEquipeRedactrice(?Equipe $equipeRedactrice): self
    {
        $this->equipeRedactrice = $equipeRedactrice;

        return $this;
    }

	/**
	 * @Groups({"complet"})
	 */
    public function getEquipeEvaluee(): ?Equipe
    {
        return $this->equipeEvaluee;
    }

    public function setEquipeEvaluee(?Equipe $equipeEvaluee): self
    {
        $this->equipeEvaluee = $equipeEvaluee;

        return $this;
    }

	/**
	 * @Groups({"complet"})
	 */
    public function getCommentaire(): ?string
    {
        return $this->commentaire;
    }

    public function setCommentaire(?string $commentaire): self
    {
        $this->commentaire = $commentaire;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
	public function getRatio() : ? int
	{
		return $this->ratio;
	}

	public function setRatio(? int $ratio) : self
	{
		$this->ratio = $ratio;

		return $this;
	}

    /**
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
            $reponse->setFeuille($this);
        }

        return $this;
    }

    public function removeReponse(FPReponse $reponse): self
    {
        if ($this->reponses->contains($reponse)) {
            $this->reponses->removeElement($reponse);
            // set the owning side to null (unless already changed)
            if ($reponse->getFeuille() === $this) {
                $reponse->setFeuille(null);
            }
        }

        return $this;
    }

    public function getMatchEquipe1(): ?Match
    {
        return $this->matchEquipe1;
    }

    public function setMatchEquipe1(?Match $matchEquipe1): self
    {
        $this->matchEquipe1 = $matchEquipe1;

        // set (or unset) the owning side of the relation if necessary
        $newFpFeuille1 = $matchEquipe1 === null ? null : $this;
        if ($newFpFeuille1 !== $matchEquipe1->getFpFeuille1()) {
			$matchEquipe1->setFpFeuille1($newFpFeuille1);
        }

        return $this;
    }

    public function getMatchEquipe2(): ?Match
    {
        return $this->matchEquipe2;
    }

    public function setMatchEquipe2(?Match $matchEquipe2): self
    {
        $this->matchEquipe2 = $matchEquipe2;

        // set (or unset) the owning side of the relation if necessary
        $newFpFeuille2 = $matchEquipe2 === null ? null : $this;
        if ($newFpFeuille2 !== $matchEquipe2->getFpFeuille2()) {
            $matchEquipe2->setFpFeuille2($newFpFeuille2);
        }

        return $this;
    }
}
