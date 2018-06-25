<?php

namespace App\Outils;

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;


class Annuaire
{
	public static function genereAnnuaire(array $equipes): string
	{
		$phpWord = new PhpWord();
		$phpWord->setDefaultParagraphStyle(array("spaceAfter" => 0));

		$section = $phpWord->addSection();

		$header = $section->addHeader();
		$header->addText("Généré le ".date("d/m/Y"));

		foreach ($equipes as $equipe)
		{
			$table = $section->addTable(array(
				'borderColor' => '000000',
				'borderSize' => 10,
				'cellMargin' => 100,
				'unit' => \PhpOffice\PhpWord\Style\Table::WIDTH_PERCENT,
				'width' => 100 * 50
			));

			// Nom de l'équipe
			$table->addRow();
			$cell = $table->addCell();
			$cell->getStyle()->setGridSpan(3);
			$cell->addText(
				$equipe->getNom(),
				array("size" => 18, "bold" => true)
			);

			// Responsables
			foreach ($equipe->getResponsables() as $resp)
			{
				$table->addRow();
				$cell = $table->addCell();
				$cell->addText($resp->getNom());
				$cell = $table->addCell();
				$cell->addText($resp->getTel1());
				$cell = $table->addCell();
				$cell->addText($resp->getMail());
			}

			// Terrain
			$table->addRow();
			$cell = $table->addCell();
			$cell->getStyle()->setGridSpan(3);
			if ($equipe->getTerrain() == null)
				$cell->addText("Pas de terrain", array("italic" => true));
			else
				$cell->addText($equipe->getTerrain());

			// Créneaux
			if ($equipe->getCreneaux()->count() > 0)
			{
				$table->addRow();
				$cell = $table->addCell();
				$cell->getStyle()->setGridSpan(3);
				foreach ($equipe->getCreneaux() as $creneau)
				{
					$cell->addText(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][$creneau->getJour()]." à ".date("H:i", $creneau->getHeure()->getTimestamp()));
				}
			}
			
			$section->addText("");
		}

		$objWriter = IOFactory::createWriter($phpWord, 'Word2007');
		$ftmp = "../var/Annuaire.docx";
		$objWriter->save($ftmp);
		return $ftmp;
	}
}
