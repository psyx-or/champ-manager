<?php

namespace App\Outils;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\AdvancedValueBinder;


class Annuaire
{
	public static function genere(array $equipes, string $nomfic): string
	{
		Cell::setValueBinder(new AdvancedValueBinder());

		$spreadsheet = new Spreadsheet();
		$sheet = $spreadsheet->getActiveSheet();

		$spreadsheet->getDefaultStyle()->getFont()->setSize(12);
		$spreadsheet->getDefaultStyle()->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet->getDefaultStyle()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

		// Ligne d'entête
		$ligne = 1;
		$sheet->setCellValueByColumnAndRow(1, $ligne, "Equipe");
		$sheet->setCellValueByColumnAndRow(2, $ligne, "Coordonnées");
		$sheet->mergeCells('B1:D1');
		$sheet->setCellValueByColumnAndRow(5, $ligne, "Maillot");
		$sheet->getStyle('A1:E1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFC0C0C0');
		$sheet->getStyle('A1:E1')->getFont()->setBold(true);

		$ligne++;
		foreach ($equipes as $equipe)
		{
			$debut = $ligne;

			// Nom de l'équipe
			$sheet->setCellValueByColumnAndRow(1, $ligne, $equipe->getNom());

			// Responsables
			foreach ($equipe->getResponsables() as $resp)
			{
				$sheet->setCellValueByColumnAndRow(2, $ligne, $resp->getNom());
				$sheet->setCellValueByColumnAndRow(3, $ligne, $resp->getTel1());
				$sheet->setCellValueByColumnAndRow(4, $ligne, $resp->getMail());
				$ligne++;
			}

			// Terrain
			$sheet->mergeCells("B$ligne:D$ligne");
			if ($equipe->getTerrain() == null)
			{
				$sheet->setCellValueByColumnAndRow(2, $ligne, "Pas de terrain");
				$sheet->getStyle("B$ligne")->getFont()->setItalic(true);
				$sheet->getStyle("B$ligne")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE0E0E0');
			}
			else
			{
				$sheet->setCellValueByColumnAndRow(2, $ligne, $equipe->getTerrain());
				$sheet->getRowDimension("$ligne")->setRowHeight(15.75 * (substr_count($equipe->getTerrain(), "\n") + 1));
			}

			// Créneaux
			if ($equipe->getCreneaux()->count() > 0)
			{
				$ligne++;
				$sheet->mergeCells("B$ligne:D$ligne");
				$vals = array();
				foreach ($equipe->getCreneaux() as $creneau)
					array_push($vals, ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][$creneau->getJour()]." à ".date("H:i", $creneau->getHeure()->getTimestamp()));
				$sheet->setCellValueByColumnAndRow(2, $ligne, implode("\n", $vals));
				$sheet->getRowDimension("$ligne")->setRowHeight(15.75 * count($vals));
			}

			// Maillot
			if ($equipe->getMaillot() != null)
			{
				$sheet->setCellValueByColumnAndRow(5, $debut, $equipe->getMaillot());
			}

			$sheet->mergeCells("A$debut:A$ligne");
			$sheet->mergeCells("E$debut:E$ligne");
			$sheet->getStyle("A$debut:E$ligne")->getBorders()->getOutline()->setBorderStyle(Border::BORDER_MEDIUM);
			
			$ligne++;
		}

		// Un peu de style supplémentaire
		$ligne--;
		$sheet->getColumnDimension('A')->setAutoSize(true);
		$sheet->getColumnDimension('B')->setAutoSize(true);
		$sheet->getColumnDimension('C')->setAutoSize(true);
		$sheet->getColumnDimension('D')->setAutoSize(true);
		$sheet->getColumnDimension('E')->setAutoSize(true);
		$sheet->setAutoFilter("A1:A$ligne");
		$sheet->getStyle("A1:A$ligne")->getBorders()->getOutline()->setBorderStyle(Border::BORDER_MEDIUM);
		$sheet->getStyle("B1:D$ligne")->getBorders()->getOutline()->setBorderStyle(Border::BORDER_MEDIUM);
		$sheet->getStyle("E1:E$ligne")->getBorders()->getOutline()->setBorderStyle(Border::BORDER_MEDIUM);

		// Il ne reste plus qu'à enregistrer
		$writer = new Xlsx($spreadsheet);
		$ftmp = "../var/$nomfic";
		$writer->save($ftmp);
		return $ftmp;
	}
}
