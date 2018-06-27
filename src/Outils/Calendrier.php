<?php

namespace App\Outils;

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use App\Entity\Sport;
use App\Entity\ChampionnatType;
use PhpOffice\PhpWord\Style\Font;


class Calendrier
{
	public static function genere(Sport $sport, array $championnats) : string
	{
		$phpWord = new PhpWord();
		$phpWord->setDefaultParagraphStyle(array("spaceAfter" => 0));

		$section = $phpWord->addSection();

		foreach ($championnats as $champ) {
			$table = $section->addTable(array(
				'borderColor' => '000000',
				'borderSize' => 10,
				'unit' => \PhpOffice\PhpWord\Style\Table::WIDTH_PERCENT,
				'width' => 100 * 50
			));

			// Nom du championnat
			$table->addRow();
			$cell = $table->addCell();
			$cell->getStyle()->setBgColor("D9D9D9");
			$cell->addText(
				"CHAMPIONNAT ".$sport->getNom()." FSGT ".$champ->getSaison(),
				array("bold" => true),
				array('alignment' => 'center')
			);
			$cell->addText(
				$champ->getNom(),
				array("bold" => true),
				array('alignment' => 'center')
			);

			$section->addText("");

			// Liste des journees
			$i = 0;
			$matches = array();
			foreach ($champ->getJournees() as $journee)
			{
				$table = $section->addTable(array(
					'unit' => \PhpOffice\PhpWord\Style\Table::WIDTH_PERCENT,
					'width' => 100 * 50
				));

				$first = true;
				foreach ($journee->getMatches() as $match)
				{
					$i++;
					$table->addRow();
					$matches[$match->getId()] = $i;

					// Description de la journée
					$cell = $table->addCell();

					if ($first)
					{
						$cell->getStyle()->setVMerge('restart');
						$cell->addText($journee->getLibelle());
						$cell->addText("Du " . $journee->getDebut()->format('d/m/Y') . " au " . $journee->getFin()->format('d/m/Y'));
					}
					else
					{
						$cell->getStyle()->setVMerge('continue');
					}

					// Nom du match
					if ($champ->getType() == ChampionnatType::COUPE)
						$table->addCell()->addText("Match $i ", array("italic" => true));

					// Description du match
					$exempt = null;
					if ($match->getEquipe1() == null && $match->getMatch1() == null && $match->getEquipe2() != null)
						$exempt = $match->getEquipe2()->getNom();
					else if ($match->getEquipe1() != null && $match->getEquipe2() == null && $match->getMatch2() == null)
						$exempt = $match->getEquipe1()->getNom();
					else
					{
						$texte1 = $match->getEquipe1() != null ? $match->getEquipe1()->getNom() : "Vainqueur match " . $matches[$match->getMatch1()->getId()];
						$texte2 = $match->getEquipe2() != null ? $match->getEquipe2()->getNom() : "Vainqueur match " . $matches[$match->getMatch2()->getId()];
						$table->addCell()->addText($texte1, Calendrier::getStyleEquipe($match->getEquipe1()), array('alignment' => 'right'));
						$table->addCell()->addText("-", array("bold" => true), array('alignment' => 'center'));
						$table->addCell()->addText($texte2, Calendrier::getStyleEquipe($match->getEquipe2()), array('alignment' => 'left'));
					}

					if ($exempt != null)
					{
						$cell = $table->addCell();
						$cell->getStyle()->setGridSpan(3);
						$cell->addText("Exempt: $exempt", array(), array('alignment' => 'center'));
					}

					$first = false;
				}

				$section->addText("");
			}

			$section->addPageBreak();
		}

		$objWriter = IOFactory::createWriter($phpWord, 'Word2007');
		$ftmp = "../var/Calendrier.docx";
		$objWriter->save($ftmp);
		return $ftmp;
	}

	/**
	 * Calcule le style d'affichage d'une équipe
	 */
	private static function getStyleEquipe($equipe): array
	{
		if ($equipe != null && $equipe->getTerrain() == null)
			return array("bold" => true, 'fgColor' => Font::FGCOLOR_RED, 'color' => 'FFFFFF');
		else
			return array("bold" => true);
	}
}
