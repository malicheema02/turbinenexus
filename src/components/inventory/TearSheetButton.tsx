"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TearSheetEquipment {
  title: string;
  manufacturer: string;
  model: string;
  equipmentType: string;
  ratedPowerMW: number | null;
  fuelType: string | null;
  frequency?: string | null;
  yearOfManufacture: number | null;
  operatingHours: number | null;
  condition: string;
  location: string | null;
  description: string;
  keySpecs: { key: string; value: string }[];
  price?: number | null;
  showPrice?: boolean;
  priceCurrency?: string;
}

export interface TearSheetButtonProps {
  equipment: TearSheetEquipment;
}

const NAVY: [number, number, number] = [27, 58, 92]; // #1B3A5C
const AMBER: [number, number, number] = [245, 158, 11]; // #F59E0B
const TEXT_DARK: [number, number, number] = [15, 23, 42]; // #0F172A
const TEXT_MUTED: [number, number, number] = [100, 116, 139];
const SEPARATOR: [number, number, number] = [226, 232, 240];

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "equipment"
  );
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function formatCurrency(amount: number, currency?: string): string {
  const code = (currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${code} ${formatNumber(amount)}`;
  }
}

export function TearSheetButton({ equipment }: TearSheetButtonProps) {
  const [generating, setGenerating] = React.useState(false);

  const handleClick = React.useCallback(async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 16;
      const contentWidth = pageWidth - marginX * 2;

      // ----- Header band -----
      const headerHeight = 30;
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.rect(0, 0, pageWidth, headerHeight, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("TURBINE NEXUS", marginX, 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      doc.text("Confidential Asset Specification Sheet", marginX, 22);

      // Thin amber rule under the header band
      doc.setFillColor(AMBER[0], AMBER[1], AMBER[2]);
      doc.rect(0, headerHeight, pageWidth, 1.2, "F");

      let cursorY = headerHeight + 14;

      // ----- Asset title -----
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(equipment.title, contentWidth) as string[];
      doc.text(titleLines, marginX, cursorY);
      cursorY += titleLines.length * 7.5;

      // manufacturer · model · type
      const metaParts = [
        equipment.manufacturer,
        equipment.model,
        equipment.equipmentType,
      ].filter((p) => p && p.trim().length > 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text(metaParts.join("  ·  "), marginX, cursorY);
      cursorY += 10;

      // ----- Footer drawing helper -----
      const drawFooter = () => {
        const footerY = pageHeight - 14;
        doc.setDrawColor(SEPARATOR[0], SEPARATOR[1], SEPARATOR[2]);
        doc.setLineWidth(0.3);
        doc.line(marginX, footerY - 4, pageWidth - marginX, footerY - 4);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
        doc.text(
          "Turbine Nexus — Surplus Power Generation Equipment Specialists",
          marginX,
          footerY
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
        doc.text(
          "This document contains public specification data only.",
          marginX,
          footerY + 4
        );

        const pageNum = doc.getNumberOfPages();
        doc.text(`Page ${pageNum}`, pageWidth - marginX, footerY + 4, {
          align: "right",
        });
      };

      const bottomLimit = pageHeight - 24;
      const ensureSpace = (needed: number) => {
        if (cursorY + needed > bottomLimit) {
          drawFooter();
          doc.addPage();
          cursorY = 20;
        }
      };

      // ----- Section heading helper -----
      const sectionHeading = (label: string) => {
        ensureSpace(14);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
        doc.text(label.toUpperCase(), marginX, cursorY);
        cursorY += 2.5;
        doc.setDrawColor(AMBER[0], AMBER[1], AMBER[2]);
        doc.setLineWidth(0.6);
        doc.line(marginX, cursorY, marginX + 28, cursorY);
        cursorY += 6;
      };

      // ----- Key Specifications table -----
      const specRows: { label: string; value: string }[] = [];

      if (equipment.ratedPowerMW !== null && equipment.ratedPowerMW !== undefined) {
        specRows.push({
          label: "Rated Power",
          value: `${formatNumber(equipment.ratedPowerMW)} MW`,
        });
      }
      if (equipment.fuelType) {
        specRows.push({ label: "Fuel Type", value: equipment.fuelType });
      }
      if (equipment.frequency) {
        specRows.push({ label: "Frequency", value: equipment.frequency });
      }
      if (
        equipment.yearOfManufacture !== null &&
        equipment.yearOfManufacture !== undefined
      ) {
        specRows.push({
          label: "Year of Manufacture",
          value: String(equipment.yearOfManufacture),
        });
      }
      if (
        equipment.operatingHours !== null &&
        equipment.operatingHours !== undefined
      ) {
        specRows.push({
          label: "Operating Hours",
          value: `${formatNumber(equipment.operatingHours)} hrs`,
        });
      }
      if (equipment.condition) {
        specRows.push({ label: "Condition", value: equipment.condition });
      }
      if (equipment.location) {
        specRows.push({ label: "Location", value: equipment.location });
      }

      for (const spec of equipment.keySpecs) {
        if (spec && spec.key) {
          specRows.push({ label: spec.key, value: spec.value ?? "" });
        }
      }

      sectionHeading("Key Specifications");

      const labelX = marginX;
      const valueX = marginX + contentWidth * 0.42;
      const valueWidth = pageWidth - marginX - valueX;
      const rowPadding = 3;

      for (const row of specRows) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        const labelLines = doc.splitTextToSize(
          row.label,
          valueX - labelX - 4
        ) as string[];

        doc.setFont("helvetica", "normal");
        const valueLines = doc.splitTextToSize(
          row.value,
          valueWidth
        ) as string[];

        const lineCount = Math.max(labelLines.length, valueLines.length);
        const rowHeight = lineCount * 5 + rowPadding;

        ensureSpace(rowHeight + 2);

        const rowTop = cursorY;

        doc.setFont("helvetica", "bold");
        doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
        doc.text(labelLines, labelX, rowTop);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
        doc.text(valueLines, valueX, rowTop);

        cursorY = rowTop + lineCount * 5 + rowPadding;

        // light separator line
        doc.setDrawColor(SEPARATOR[0], SEPARATOR[1], SEPARATOR[2]);
        doc.setLineWidth(0.2);
        doc.line(marginX, cursorY - 2, pageWidth - marginX, cursorY - 2);
      }

      cursorY += 6;

      // ----- Pricing -----
      sectionHeading("Commercial");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      if (
        equipment.showPrice &&
        equipment.price !== null &&
        equipment.price !== undefined
      ) {
        doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
        doc.text("List Price:", marginX, cursorY);
        doc.setTextColor(AMBER[0], AMBER[1], AMBER[2]);
        doc.text(
          formatCurrency(equipment.price, equipment.priceCurrency),
          marginX + 28,
          cursorY
        );
      } else {
        doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
        doc.text("Price:", marginX, cursorY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
        doc.text("Available on Request", marginX + 20, cursorY);
      }
      cursorY += 12;

      // ----- Description -----
      if (equipment.description && equipment.description.trim().length > 0) {
        sectionHeading("Description");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
        const descLines = doc.splitTextToSize(
          equipment.description,
          contentWidth
        ) as string[];
        for (const line of descLines) {
          ensureSpace(6);
          doc.text(line, marginX, cursorY);
          cursorY += 5;
        }
      }

      // Footer on the final page
      drawFooter();

      doc.save(`${slugify(equipment.title)}-spec-sheet.pdf`);
    } finally {
      setGenerating(false);
    }
  }, [equipment]);

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={generating}
      type="button"
    >
      <Download className="h-4 w-4" />
      Download Specs (PDF)
    </Button>
  );
}

export default TearSheetButton;
