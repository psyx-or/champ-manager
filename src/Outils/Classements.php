<?php

namespace App\Outils;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\AdvancedValueBinder;
use App\Entity\Sport;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use App\Entity\Championnat;
use App\Entity\Classement;
use PhpOffice\PhpSpreadsheet\Style\Border;

class Classements
{
	public static function genere(array $sports): string
	{
		Cell::setValueBinder(new AdvancedValueBinder());

		// Initialisation
		$spreadsheet = new Spreadsheet();
		$spreadsheet->getDefaultStyle()->getFont()->setSize(12);
		$spreadsheet->getDefaultStyle()->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet->getDefaultStyle()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

		// Génération des sports
		foreach ($sports as $sport)
			Classements::genereSport($spreadsheet, $sport);

		$spreadsheet->removeSheetByIndex(0);

		// Il ne reste plus qu'à enregistrer
		$writer = new Xlsx($spreadsheet);
		$ftmp = "../var/Classements.xlsx";
		$writer->save($ftmp);
		return $ftmp;
	}

	private static function genereSport(Spreadsheet $spreadsheet, Sport $sport)
	{
		// Création de l'onglet
		$sheet = new Worksheet($spreadsheet, $sport->getNom());
		$spreadsheet->addSheet($sheet);
		$ligne = 1;

		foreach ($sport->getChampionnats() as $championnat)
			Classements::genereChampionnat($sheet, $championnat, $ligne);

		$sheet->getColumnDimension('B')->setAutoSize(true);
	}

	private static function genereChampionnat(Worksheet $sheet, Championnat $championnat, &$ligne)
	{
		$firstLigne = $ligne;

		// Ligne d'entête
		$col = 1;
		$ligne += 2;
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "#");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "Equipe");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "Pts");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "J");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "G");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "N");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "P");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "FO");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "Pour");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "Contre");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "Diff");
		$sheet->setCellValueByColumnAndRow($col++, $ligne, "Pén");
		$lastCol = chr(65 + $col - 2);
		$sheet->getStyle("A$ligne:$lastCol$ligne")->getFont()->setBold(true);

		// Ligne du championnat
		$range = "A$firstLigne:$lastCol$firstLigne";
		$sheet->setCellValueByColumnAndRow(1, $firstLigne, $championnat->getNom());
		$sheet->mergeCells($range);

		$sheet->getStyle($range)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFC0C0C0');
		$sheet->getStyle($range)->getFont()->setBold(true);
		$sheet->getStyle($range)->getBorders()->getOutline()->setBorderStyle(Border::BORDER_MEDIUM);

		// Classement
		$ligne++;
		foreach ($championnat->getClassements() as $classement)
			Classements::genereClassement($sheet, $classement, $ligne);

		$ligne += 2;
	}

	private static function genereClassement(Worksheet $sheet, Classement $classement, &$ligne)
	{
		$col = 1;
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getPosition());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getEquipe()->getNom());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getPts());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getMTotal());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getMVict());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getMNul());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getMDef());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getMFo());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getPour());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getContre());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getPour() - $classement->getContre());
		$sheet->setCellValueByColumnAndRow($col++, $ligne, $classement->getPenalite());

		$ligne++;
	}
}
