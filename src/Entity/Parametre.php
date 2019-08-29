<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ParametreRepository")
 */
class Parametre
{
	public const MAIL_EMETTEUR = 'MAIL_EMETTEUR';
	public const MAIL_MDP_OBJET = 'MAIL_MDP_OBJET';
	public const MAIL_MDP_VALEUR = 'MAIL_MDP_VALEUR';
	public const MAIL_MDPCHAMP_OBJET = 'MAIL_MDPCHAMP_OBJET';
	public const MAIL_MDPCHAMP_VALEUR = 'MAIL_MDPCHAMP_VALEUR';
	public const DUREE_SAISIE = 'DUREE_SAISIE';
	public const MAIL_FP_OBJET = 'MAIL_FP_OBJET';
	public const MAIL_FP_VALEUR = 'MAIL_FP_VALEUR';
	public const SEUIL_FORFAIT_WARN = 'SEUIL_FORFAIT_WARN';
	public const SEUIL_FORFAIT_DANGER = 'SEUIL_FORFAIT_DANGER';

	/**
	 * @ORM\Id()
	 * @ORM\Column(type="string", length=100)
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
