<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ParametreRepository")
 */
class Parametre
{
	public const EMETTEUR_MAIL = 'EMETTEUR_MAIL';
	public const OBJET_MAIL_MOTDEPASSE = 'OBJET_MAIL_MOTDEPASSE';
	public const CONTENU_MAIL_MOTDEPASSE = 'CONTENU_MAIL_MOTDEPASSE';

	/**
	 * @ORM\Id()
	 * @ORM\Column(type="string", length=255)
	 */
    private $nom;

    /**
     * @ORM\Column(type="parametreType")
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $description;

    /**
     * @ORM\Column(type="text")
     */
    private $valeur;

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getValeur(): ?string
    {
        return $this->valeur;
    }

    public function setValeur(string $valeur): self
    {
        $this->valeur = $valeur;

        return $this;
    }
}
