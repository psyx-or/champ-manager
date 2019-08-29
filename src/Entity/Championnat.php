<?php

namespace App\Entity;

use App\Outils\PasswordEntityInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ChampionnatRepository")
 * @ORM\Table(
 * 		indexes={
 * 			@ORM\Index(name="saison", columns={"saison"})
 * 		}
 * )
 */
class Championnat implements \Serializable, PasswordEntityInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Sport", inversedBy="championnats")
     * @ORM\JoinColumn(nullable=false, name="sport", referencedColumnName="nom")
     */
    private $sport;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $saison;

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
	 * @ORM\OneToMany(targetEntity="App\Entity\Classement", mappedBy="championnat", orphanRemoval=true)
	 * @ORM\OrderBy({"position" = "ASC"})
	 */
    private $classements;

	/**
	 * @ORM\OneToMany(targetEntity="App\Entity\Journee", mappedBy="championnat", orphanRemoval=true)
	 * @ORM\OrderBy({"numero" = "ASC"})
	 */
    private $journees;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\FPForm", inversedBy="championnats")
     */
    private $fpForm;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $password;

    public function __construct()
    {
        $this->classements = new ArrayCollection();
        $this->journees = new ArrayCollection();
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
	 * @Groups({"simple"})
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

	/**
	 * @Groups({"simple"})
	 */
    public function getSaison(): ?string
    {
        return $this->saison;
    }

    public function setSaison(string $saison): self
    {
        $this->saison = $saison;

        return $this;
    }

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
	 * @Groups({"classement"})
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
	 * @Groups({"simple"})
	 */
    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
	 * @Groups({"classement"})
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
            $classement->setChampionnat($this);
        }

        return $this;
    }

    public function removeClassement(Classement $classement): self
    {
        if ($this->classements->contains($classement)) {
            $this->classements->removeElement($classement);
            // set the owning side to null (unless already changed)
            if ($classement->getChampionnat() === $this) {
                $classement->setChampionnat(null);
            }
        }

        return $this;
    }

    /**
	 * @Groups({"journees","matches"})
     * @return Collection|Journee[]
     */
    public function getJournees(): Collection
    {
        return $this->journees;
    }

    public function addJournee(Journee $journee): self
    {
        if (!$this->journees->contains($journee)) {
            $this->journees[] = $journee;
            $journee->setChampionnat($this);
        }

        return $this;
    }

    public function removeJournee(Journee $journee): self
    {
        if ($this->journees->contains($journee)) {
            $this->journees->removeElement($journee);
            // set the owning side to null (unless already changed)
            if ($journee->getChampionnat() === $this) {
                $journee->setChampionnat(null);
            }
        }

        return $this;
    }

	/**
	 * @Groups({"simple"})
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
	 * @Groups({"feuilles"})
	 */
	public function getFpFeuilles(): array
         	{
         		$res = array();
         
         		foreach ($this->getJournees() as $journee)
         			foreach ($journee->getMatches() as $match)
         				foreach ($match->getFpFeuilles() as $feuille)
         					array_push($res, $feuille);
         
         		return $res;
         	}

	
	// ------------------------------------------------------
	//    Authentification
	// ------------------------------------------------------

	public function getUsername()
                        	{
                        		return $this->id;
                        	}

	public function getSalt()
                        	{
                        		return null;
                        	}

	public function getRoles()
                        	{
                        		return array('ROLE_CHAMP');
                        	}

	public function eraseCredentials()
                        	{
                        	}

	/** @see \Serializable::serialize() */
	public function serialize()
                        	{
                        		return serialize(array(
                        			$this->id,
                        			$this->password,
                        			$this->nom,
                        		));
                        	}

	/** @see \Serializable::unserialize() */
	public function unserialize($serialized)
                        	{
                        		list(
                        			$this->id,
                        			$this->password,
                        			$this->nom,
                        		) = unserialize($serialized, ['allowed_classes' => false]);
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
}
