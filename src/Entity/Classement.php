<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ClassementRepository")
 */
class Classement
{
    /**
     * @ORM\Id()
	 * @ORM\ManyToOne(targetEntity="App\Entity\Championnat", inversedBy="classements")
     * @ORM\JoinColumn(nullable=false)
     */
    private $championnat;

    /**
     * @ORM\Id()
	 * @ORM\ManyToOne(targetEntity="App\Entity\Equipe", inversedBy="classements")
     * @ORM\JoinColumn(nullable=false)
     */
    private $equipe;

    /**
     * @ORM\Column(type="smallint")
     */
    private $position;

    /**
     * @ORM\Column(type="smallint")
     */
    private $pts;

    /**
     * @ORM\Column(type="smallint")
     */
    private $m_total;

    /**
     * @ORM\Column(type="smallint")
     */
    private $m_vict;

    /**
     * @ORM\Column(type="smallint", nullable=true)
     */
    private $m_nul;

    /**
     * @ORM\Column(type="smallint")
     */
    private $m_def;

    /**
     * @ORM\Column(type="smallint")
     */
    private $m_fo;

    /**
     * @ORM\Column(type="smallint")
     */
    private $penalite;

    /**
     * @ORM\Column(type="smallint")
     */
    private $pour;

    /**
     * @ORM\Column(type="smallint")
     */
    private $contre;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $nomJournee;

    public function getChampionnat(): ?Championnat
    {
        return $this->championnat;
    }

    public function setChampionnat(?Championnat $championnat): self
    {
        $this->championnat = $championnat;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getEquipe(): ?Equipe
    {
        return $this->equipe;
    }

    public function setEquipe(?Equipe $equipe): self
    {
        $this->equipe = $equipe;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getPts(): ?int
    {
        return $this->pts;
    }

    public function setPts(int $pts): self
    {
        $this->pts = $pts;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getMTotal(): ?int
    {
        return $this->m_total;
    }

    public function setMTotal(int $m_total): self
    {
        $this->m_total = $m_total;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getMVict(): ?int
    {
        return $this->m_vict;
    }

    public function setMVict(int $m_vict): self
    {
        $this->m_vict = $m_vict;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getMNul(): ?int
    {
        return $this->m_nul;
    }

    public function setMNul(?int $m_nul): self
    {
        $this->m_nul = $m_nul;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getMDef(): ?int
    {
        return $this->m_def;
    }

    public function setMDef(int $m_def): self
    {
        $this->m_def = $m_def;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getMFo(): ?int
    {
        return $this->m_fo;
    }

    public function setMFo(int $m_fo): self
    {
        $this->m_fo = $m_fo;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getPenalite(): ?int
    {
        return $this->penalite;
    }

    public function setPenalite(int $penalite): self
    {
        $this->penalite = $penalite;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getPour(): ?int
    {
        return $this->pour;
    }

    public function setPour(int $pour): self
    {
        $this->pour = $pour;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getContre(): ?int
    {
        return $this->contre;
    }

    public function setContre(int $contre): self
    {
        $this->contre = $contre;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getNomJournee(): ?string
    {
        return $this->nomJournee;
    }

    public function setNomJournee(?string $nomJournee): self
    {
        $this->nomJournee = $nomJournee;

        return $this;
    }
}
