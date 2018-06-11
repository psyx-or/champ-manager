<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MatchRepository")
 */
class Match
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Journee", inversedBy="matches")
	 * @ORM\JoinColumns({
	 * 		@ORM\JoinColumn(nullable=false, name="championnat_id", referencedColumnName="championnat_id"),
	 * 		@ORM\JoinColumn(nullable=false, name="journee", referencedColumnName="numero")
	 * })
     */
    private $journee;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Equipe")
     * @ORM\JoinColumn(nullable=true)
     */
    private $equipe1;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Equipe")
     * @ORM\JoinColumn(nullable=true)
     */
    private $equipe2;

    /**
     * @ORM\Column(type="smallint", nullable=true)
     */
    private $score1;

    /**
     * @ORM\Column(type="smallint", nullable=true)
     */
    private $score2;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $date_saisie;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $feuille;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $valide;

    /**
     * @ORM\Column(type="boolean")
     */
    private $forfait1;

    /**
     * @ORM\Column(type="boolean")
     */
    private $forfait2;

    public function getId()
    {
        return $this->id;
    }

    public function getJournee(): ?Journee
    {
        return $this->journee;
    }

    public function setJournee(?Journee $journee): self
    {
        $this->journee = $journee;

        return $this;
    }

    public function getEquipe1(): ?Equipe
    {
        return $this->equipe1;
    }

    public function setEquipe1(?Equipe $equipe1): self
    {
        $this->equipe1 = $equipe1;

        return $this;
    }

    public function getEquipe2(): ?Equipe
    {
        return $this->equipe2;
    }

    public function setEquipe2(?Equipe $equipe2): self
    {
        $this->equipe2 = $equipe2;

        return $this;
    }

    public function getScore1(): ?int
    {
        return $this->score1;
    }

    public function setScore1(?int $score1): self
    {
        $this->score1 = $score1;

        return $this;
    }

    public function getScore2(): ?int
    {
        return $this->score2;
    }

    public function setScore2(?int $score2): self
    {
        $this->score2 = $score2;

        return $this;
    }

    public function getDateSaisie(): ?\DateTimeInterface
    {
        return $this->date_saisie;
    }

    public function setDateSaisie(?\DateTimeInterface $date_saisie): self
    {
        $this->date_saisie = $date_saisie;

        return $this;
    }

    public function getFeuille(): ?string
    {
        return $this->feuille;
    }

    public function setFeuille(?string $feuille): self
    {
        $this->feuille = $feuille;

        return $this;
    }

    public function getValide(): ?bool
    {
        return $this->valide;
    }

    public function setValide(?bool $valide): self
    {
        $this->valide = $valide;

        return $this;
    }

    public function getForfait1(): ?bool
    {
        return $this->forfait1;
    }

    public function setForfait1(bool $forfait1): self
    {
        $this->forfait1 = $forfait1;

        return $this;
    }

    public function getForfait2(): ?bool
    {
        return $this->forfait2;
    }

    public function setForfait2(bool $forfait2): self
    {
        $this->forfait2 = $forfait2;

        return $this;
    }
}
