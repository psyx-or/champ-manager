<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\FPReponseRepository")
 */
class FPReponse
{
	/**
	 * @ORM\Id()
	 * @ORM\ManyToOne(targetEntity="App\Entity\FPFeuille", inversedBy="reponses")
	 * @ORM\JoinColumn(nullable=false)
	 */
    private $feuille;

	/**
	 * @ORM\Id()
	 * @ORM\ManyToOne(targetEntity="App\Entity\FPQuestion", inversedBy="reponses")
	 * @ORM\JoinColumn(nullable=false)
	 */
    private $question;

    /**
     * @ORM\Column(type="smallint")
     */
    private $reponse;

    public function getFeuille(): ?FPFeuille
    {
        return $this->feuille;
    }

    public function setFeuille(?FPFeuille $feuille): self
    {
        $this->feuille = $feuille;

        return $this;
    }

    public function getQuestion(): ?FPQuestion
    {
        return $this->question;
    }

    public function setQuestion(?FPQuestion $question): self
    {
        $this->question = $question;

        return $this;
    }

    public function getReponse(): ?int
    {
        return $this->reponse;
    }

    public function setReponse(int $reponse): self
    {
        $this->reponse = $reponse;

        return $this;
    }
}
