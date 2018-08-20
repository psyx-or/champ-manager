<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
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
     * @ORM\Column(type="boolean", nullable=true)
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

	/**
	 * @ORM\OneToOne(targetEntity="App\Entity\Match")
	 * @ORM\JoinColumn(onDelete="SET NULL")
	 */
    private $match1;

	/**
	 * @ORM\OneToOne(targetEntity="App\Entity\Match")
	 * @ORM\JoinColumn(onDelete="SET NULL")
	 */
    private $match2;

	/**
	 * @ORM\OneToOne(targetEntity="App\Entity\Match", mappedBy="match1")
	 */
	private $parent1;

	/**
	 * @ORM\OneToOne(targetEntity="App\Entity\Match", mappedBy="match2")
	 */
	private $parent2;

	/**
	 * @ORM\OneToOne(targetEntity="App\Entity\FPFeuille", inversedBy="matchEquipe1", cascade={"persist", "remove"})
	 */
	private $fpFeuille1;

	/**
	 * @ORM\OneToOne(targetEntity="App\Entity\FPFeuille", inversedBy="matchEquipe2", cascade={"persist", "remove"})
	 */
	private $fpFeuille2;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\FPFeuille", mappedBy="fpMatch")
	 */
	private $fpFeuilles;

	
	public function __construct()
	{
		$this->fpFeuilles = new ArrayCollection();
	}

	public function setId($id) : self
	{
		$this->id = $id;

		return $this;
	}

	/**
	 * @Groups({"simple"})
	 */
    public function getId()
    {
        return $this->id;
    }

	/**
	 * @Groups({"doublon"})
	 */
    public function getJournee(): ?Journee
    {
        return $this->journee;
    }

    public function setJournee(?Journee $journee): self
    {
        $this->journee = $journee;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getEquipe1(): ?Equipe
    {
        return $this->equipe1;
    }

    public function setEquipe1(?Equipe $equipe1): self
    {
        $this->equipe1 = $equipe1;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getEquipe2(): ?Equipe
    {
        return $this->equipe2;
    }

    public function setEquipe2(?Equipe $equipe2): self
    {
        $this->equipe2 = $equipe2;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getScore1(): ?int
    {
        return $this->score1;
    }

    public function setScore1(?int $score1): self
    {
        $this->score1 = $score1;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getScore2(): ?int
    {
        return $this->score2;
    }

    public function setScore2(?int $score2): self
    {
        $this->score2 = $score2;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getDateSaisie(): ?\DateTimeInterface
    {
        return $this->date_saisie;
    }

    public function setDateSaisie(?\DateTimeInterface $date_saisie): self
    {
        $this->date_saisie = $date_saisie;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getFeuille(): ?string
    {
        return $this->feuille;
    }

    public function setFeuille(?string $feuille): self
    {
        $this->feuille = $feuille;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getValide(): ?bool
    {
        return $this->valide;
    }

    public function setValide(?bool $valide): self
    {
        $this->valide = $valide;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getForfait1(): ?bool
    {
        return $this->forfait1;
    }

    public function setForfait1(bool $forfait1): self
    {
        $this->forfait1 = $forfait1;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getForfait2(): ?bool
    {
        return $this->forfait2;
    }

    public function setForfait2(bool $forfait2): self
    {
        $this->forfait2 = $forfait2;

        return $this;
    }

	/**
	 * @Groups({"hierarchie"})
	 */
    public function getMatch1(): ?self
    {
        return $this->match1;
    }

    public function setMatch1(?self $match1): self
    {
        $this->match1 = $match1;

        return $this;
	}

	/**
	 * @Groups({"hierarchie"})
	 */
    public function getMatch2(): ?self
    {
        return $this->match2;
    }

    public function setMatch2(?self $match2): self
    {
        $this->match2 = $match2;

        return $this;
	}

	public function getParent1() : ? self
	{
		return $this->parent1;
	}

	public function getParent2() : ? self
	{
		return $this->parent2;
	}

	/**
	 * @Groups({"simple"})
	 */
 	public function getExempt(): ?Equipe
	{
		if ($this->match1 != null || $this->match2 != null)
			return null;
		
		if ($this->equipe1 == null)
			return $this->equipe2;
		if ($this->equipe2 == null)
			return $this->equipe1;
		
		return null;
	}

	/**
	 * @Groups({"fp"})
	 */
	public function getFpFeuille1(): ?FPFeuille
	{
		return $this->fpFeuille1;
	}

	/**
	 * @Groups({"hasfp"})
	 */
	public function getHasFpFeuille1(): ?bool
	{
		return $this->fpFeuille1 != null;
	}

	public function setFpFeuille1(?FPFeuille $fpFeuille1): self
	{
		$this->fpFeuille1 = $fpFeuille1;
		
		return $this;
	}

	/**
	 * @Groups({"fp"})
	 */
	public function getFpFeuille2(): ?FPFeuille
	{
		return $this->fpFeuille2;
	}

	/**
	 * @Groups({"hasfp"})
	 */
	public function getHasFpFeuille2(): ? bool
	{
		return $this->fpFeuille2 != null;
	}

	public function setFpFeuille2(?FPFeuille $fpFeuille2): self
	{
		$this->fpFeuille2 = $fpFeuille2;

		return $this;
	}

	/**
	 * @return Collection|FPFeuille[]
	 */
	public function getFpFeuilles(): Collection
	{
		return $this->fpFeuilles;
	}

	public function addFpFeuille(FPFeuille $fpFeuille): self
	{
		if (!$this->fpFeuilles->contains($fpFeuille)) {
			$this->fpFeuilles[] = $fpFeuille;
			$fpFeuille->setFpMatch($this);
		}

		return $this;
	}

	public function removeFpFeuille(FPFeuille $fpFeuille): self
	{
		if ($this->fpFeuilles->contains($fpFeuille)) {
			$this->fpFeuilles->removeElement($fpFeuille);
			// set the owning side to null (unless already changed)
			if ($fpFeuille->getFpMatch() === $this) {
				$fpFeuille->setFpMatch(null);
			}
		}

		return $this;
	}
}
