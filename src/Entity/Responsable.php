<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ResponsableRepository")
 */
class Responsable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

	/**
	 * @ORM\ManyToOne(targetEntity="App\Entity\Equipe", inversedBy="responsables")
	 * @ORM\JoinColumn(nullable=false)
	 */
	private $equipe;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=14, nullable=true)
     */
    private $tel1;

	/**
	 * @ORM\Column(type="string", length=14, nullable=true)
	 */
	private $tel2;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $mail;

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

	public function getEquipe() : ? Equipe
	{
		return $this->equipe;
	}

	public function setEquipe(? Equipe $equipe) : self
	{
		$this->equipe = $equipe;

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
    public function getTel1(): ?string
    {
        return $this->tel1;
    }

    public function setTel1(?string $tel1): self
    {
        $this->tel1 = $tel1;

        return $this;
    }

	/**
	 * @Groups({"simple"})
	 */
	public function getTel2() : ? string
	{
		return $this->tel2;
	}

	public function setTel2(? string $tel2) : self
	{
		$this->tel2 = $tel2;

		return $this;
	}

	/**
	 * @Groups({"simple"})
	 */
    public function getMail(): ?string
    {
        return $this->mail;
    }

    public function setMail(?string $mail): self
    {
        $this->mail = $mail;

        return $this;
    }
}
