<?php

namespace App\Entity;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\EquipeRepository")
 * @ORM\Table(
 * 		uniqueConstraints={
 * 			@ORM\UniqueConstraint(name="login_unique",columns={"login"}),
 * 			@ORM\UniqueConstraint(name="nom_unique",columns={"sport", "nom"})
 * 		}
 * )
 */
class Equipe implements UserInterface, \Serializable
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
    private $login;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Sport", inversedBy="equipes")
     * @ORM\JoinColumn(nullable=false, name="sport", referencedColumnName="nom")
     */
    private $sport;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Classement", mappedBy="equipe")
     */
    private $classements;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\Responsable", mappedBy="equipe", orphanRemoval=true)
	 */
    private $responsables;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $terrain;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\Creneau", mappedBy="equipe", orphanRemoval=true)
	 */
    private $creneaux;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\FPFeuille", mappedBy="equipeRedactrice")
     */
	private $fpRedigees;
	
	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\FPFeuille", mappedBy="equipeEvaluee")
	 */
	private $fpEvaluees;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	*/
	private $position;

    public function __construct()
    {
        $this->classements = new ArrayCollection();
        $this->responsables = new ArrayCollection();
        $this->creneaux = new ArrayCollection();
        $this->fpRedigees = new ArrayCollection();
        $this->fpEvaluees = new ArrayCollection();
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

    public function getLogin(): ?string
    {
        return $this->login;
    }

    public function setLogin(string $login): self
    {
        $this->login = $login;

        return $this;
    }

	/**
	 * @Groups({"sport"})
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

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * @return Collection|Classement[]
     */
    public function getClassements(): Collection
    {
        return $this->classements;
    }

    public function addClassement(Classement $classement): self
    {
        if (!$this->classements->contains($classement)) {
            $this->classements[] = $classement;
            $classement->setEquipe($this);
        }

        return $this;
    }

    public function removeClassement(Classement $classement): self
    {
        if ($this->classements->contains($classement)) {
            $this->classements->removeElement($classement);
            // set the owning side to null (unless already changed)
            if ($classement->getEquipe() === $this) {
                $classement->setEquipe(null);
            }
        }

        return $this;
    }

	/**
	 * @Groups({"coordonnees"})
	 * @return Collection|Responsable[]
	 */
    public function getResponsables(): Collection
    {
        return $this->responsables;
    }

    public function addResponsable(Responsable $responsable): self
    {
        if (!$this->responsables->contains($responsable)) {
            $this->responsables[] = $responsable;
            $responsable->setEquipe($this);
        }

        return $this;
    }

    public function removeResponsable(Responsable $responsable): self
    {
        if ($this->responsables->contains($responsable)) {
            $this->responsables->removeElement($responsable);
            // set the owning side to null (unless already changed)
            if ($responsable->getEquipe() === $this) {
                $responsable->setEquipe(null);
            }
        }

        return $this;
    }

	/**
	 * @Groups({"coordonnees"})
	 */
    public function getTerrain(): ?string
    {
        return $this->terrain;
    }

    public function setTerrain(?string $terrain): self
    {
        $this->terrain = $terrain;

        return $this;
    }

	/**
	 * @Groups({"coordonnees"})
	 * @return Collection|Creneau[]
	 */
    public function getCreneaux(): Collection
    {
        return $this->creneaux;
    }

    public function addCreneau(Creneau $creneaux): self
    {
        if (!$this->creneaux->contains($creneaux)) {
            $this->creneaux[] = $creneaux;
            $creneaux->setEquipe($this);
        }

        return $this;
    }

    public function removeCreneau(Creneau $creneaux): self
    {
        if ($this->creneaux->contains($creneaux)) {
            $this->creneaux->removeElement($creneaux);
            // set the owning side to null (unless already changed)
            if ($creneaux->getEquipe() === $this) {
                $creneaux->setEquipe(null);
            }
        }

        return $this;
    }

	
	// ------------------------------------------------------
	//    Authentification
	// ------------------------------------------------------

	public function getUsername()
	{
		return $this->login;
	}

	public function getSalt()
	{
		return null;
	}

	public function getRoles()
	{
		return array('ROLE_USER');
	}

	public function eraseCredentials()
	{
	}

	/** @see \Serializable::serialize() */
	public function serialize()
	{
		return serialize(array(
			$this->id,
			$this->login,
			$this->password,
		));
	}

	/** @see \Serializable::unserialize() */
	public function unserialize($serialized)
	{
		list(
			$this->id,
			$this->login,
			$this->password,
		) = unserialize($serialized, ['allowed_classes' => false]);
	}
 
	/**
	 * @return Collection|FPFeuille[]
	 */
	public function getFpRedigees(): Collection
	{
		return $this->fpRedigees;
	}

	public function addFpRedigee(FPFeuille $fpRedigee): self
	{
		if (!$this->fpRedigees->contains($fpRedigee)) {
			$this->fpRedigees[] = $fpRedigee;
			$fpRedigee->setEquipeRedactrice($this);
		}
		
		return $this;
	}

	public function removeFpRedigee(FPFeuille $fpRedigee): self
	{
		if ($this->fpRedigees->contains($fpRedigee)) {
			$this->fpRedigees->removeElement($fpRedigee);
			// set the owning side to null (unless already changed)
			if ($fpRedigee->getEquipeRedactrice() === $this) {
				$fpRedigee->setEquipeRedactrice(null);
			}
		}
		
		return $this;
	}

	/**
	 * @return Collection|FPFeuille[]
	 */
	public function getFpEvaluees(): Collection
	{
		return $this->fpEvaluees;
	}

	public function addFpEvaluee(FPFeuille $fpEvaluee): self
	{
		if (!$this->fpEvaluees->contains($fpEvaluee)) {
			$this->fpEvaluees[] = $fpEvaluee;
			$fpEvaluee->setEquipeEvaluee($this);
		}
		
		return $this;
	}

	public function removeFpEvaluee(FPFeuille $fpEvaluee): self
	{
		if ($this->fpEvaluees->contains($fpEvaluee)) {
			$this->fpEvaluees->removeElement($fpEvaluee);
			// set the owning side to null (unless already changed)
			if ($fpEvaluee->getEquipeEvaluee() === $this) {
				$fpEvaluee->setEquipeEvaluee(null);
			}
		}
		
		return $this;
	}

	/**
	 * @Groups({"coordonnees"})
	 */
	public function getPosition(): ?string
	{
		return $this->position;
	}

	public function setPosition(?string $position): self
	{
		$this->position = $position;

		return $this;
	}
}
