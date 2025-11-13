"use client";

import React, { useState, useMemo, useEffect, JSX } from "react";
import {
  Search,
  Calendar,
  Tag,
  Clock,
  Droplet,
  Filter,
  X,
  ArrowUp,
  ArrowDown,
  LucideIcon,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar
} from "recharts";


// --- TYPE DEFINITIONS ---
type SortKey = "date" | "time" | "context" | "level" | "label";
type SortDirection = "ascending" | "descending";

interface Reading {
  id: string;
  date: string;
  time: string;
  context: string;
  level: number;
  unit: string;
  label: string;
}

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface FilterOptionProps {
  icon: LucideIcon;
  title: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface SortIconProps {
  columnKey: SortKey;
}

// --- HELPER COMPONENTS ---
const getLabelColor = (label: string): string => {
  switch (label) {
    case "Optimal":
      return "bg-green-100 text-green-700 ring-green-500/10";
    case "Controlled":
      return "bg-blue-100 text-blue-700 ring-blue-500/10";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 ring-yellow-500/10";
    case "High":
      return "bg-red-100 text-red-700 ring-red-500/10";
    case "Low":
      return "bg-indigo-100 text-indigo-700 ring-indigo-500/10";
    default:
      return "bg-gray-100 text-gray-700 ring-gray-500/10";
  }
};

const FilterOption: React.FC<FilterOptionProps> = ({
  icon: Icon,
  title,
  options,
  selected,
  onToggle,
}) => (
  <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center space-x-2 mb-3">
      <Icon className="w-5 h-5 text-indigo-500" />
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
      {options.map((option) => (
        <label key={option} className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => (
  <div className="flex flex-col">
    <label
      htmlFor={label}
      className="text-sm font-bold text-[#11224e] mb-1 flex items-center"
    >
      <Calendar className="w-4 h-4 mr-1 text-[#11224e]" />
      {label}
    </label>
    <input
      id={label}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border bg-[#f87b1b] text-[#11224e] font-bold text-sm py-3 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
    />
  </div>
);


import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import html2canvas from "html2canvas";

async function generatePDFReport({startDate, endDate, filteredAndSortedData}: {startDate: string, endDate: string, filteredAndSortedData: Reading[]}) {
  try {

    
    const pdf = await PDFDocument.create();
    let page = pdf.addPage([595, 842]); // A4 size
    const { height } = page.getSize();

    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    let y = height - 60;

    // ===== HOSPITAL HEADER =====
    page.drawText("Health Diary Report", {
      x: 50,
      y,
      size: 24,
      font: bold,
      color: rgb(0.1, 0.2, 0.4),
    });

    y -= 30;

    page.drawLine({
      start: { x: 50, y },
      end: { x: 545, y },
      thickness: 1,
      color: rgb(0.1, 0.2, 0.4),
    });

    y -= 40;

    // // ===== Patient Info =====
    // page.drawText(`Patient Mail: ${user?.email ?? "Unknown User"}`, {
    //   x: 50,
    //   y,
    //   size: 12,
    //   font,
    // });

    // y -= 20;

    page.drawText(`Report Period: ${startDate} to ${endDate}`, {
      x: 50,
      y,
      size: 12,
      font,
    });

    y -= 30;

    // ===== Summary Cards =====
    const levels = filteredAndSortedData.map(r => r.level);
    const avg = Math.round(levels.reduce((a,b)=>a+b,0) / levels.length);
    const min = Math.min(...levels);
    const max = Math.max(...levels);

    page.drawText(`Average Level: ${avg} mg/dL`, {
      x: 50, y, size: 12, font: bold
    });
    y -= 20;

    page.drawText(`Highest Level: ${max} mg/dL`, {
      x: 50, y, size: 12, font
    });
    y -= 20;

    page.drawText(`Lowest Level: ${min} mg/dL`, {
      x: 50, y, size: 12, font
    });

    y -= 40;

    // ===== CHART CAPTURE FUNCTION =====
    const captureChart = async (id: string) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const canvas = await html2canvas(el, { scale: 0.85});
      const img = canvas.toDataURL("image/png");
      return await pdf.embedPng(img);
    };

    // ===== Insert Line Chart =====
    const lineChart = await captureChart("chart-line");
    if (lineChart) {
      const dims = lineChart.scale(0.45);
      page.drawImage(lineChart, {
        x: 50,
        y: y - dims.height,
        width: dims.width,
        height: dims.height
      });
      y -= dims.height + 40;
    }

    // ===== Insert Bar Chart =====
    const barChart = await captureChart("chart-bar");
    if (barChart) {
      const dims = barChart.scale(0.45);
      page.drawImage(barChart, {
        x: 50,
        y: y - dims.height,
        width: dims.width,
        height: dims.height
      });
      y -= dims.height + 40;
    }

    // ===== Table Heading =====
    page.drawText("Blood Sugar Readings", {
      x: 50,
      y,
      size: 14,
      font: bold,
      color: rgb(0.1, 0.2, 0.4),
    });

    y -= 20;

    // Column titles
    page.drawText("Date", { x: 50, y, size: 10, font: bold });
    page.drawText("Time", { x: 140, y, size: 10, font: bold });
    page.drawText("Context", { x: 230, y, size: 10, font: bold });
    page.drawText("Level", { x: 380, y, size: 10, font: bold });
    y -= 12;

    // Divider
    page.drawLine({
      start: { x: 50, y },
      end: { x: 545, y },
      thickness: 0.5,
    });

    y -= 20;

    // ===== Table Content =====
    for (const r of filteredAndSortedData) {
      if (y <= 100) {
        page = pdf.addPage([595, 842]);
        y = height - 50;
      }

      page.drawText(r.date, { x: 50, y, size: 10, font });
      page.drawText(r.time, { x: 140, y, size: 10, font });
      page.drawText(r.context, { x: 230, y, size: 10, font });
      page.drawText(`${r.level} mg/dL`, { x: 380, y, size: 10, font });

      y -= 16;
    }


    y -= 30;

    // ===== Footer =====
    page.drawLine({
      start: { x: 50, y },
      end: { x: 545, y },
      thickness: 1,
      color: rgb(0.1, 0.2, 0.4),
    });

    y -= 20;

    page.drawText("Generated by Health Diary – Secure Digital Health Tracker", {
      x: 50,
      y,
      size: 10,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    const pdfBytes = await pdf.save();

// Convert Uint8Array → REAL ArrayBuffer safely
const arrayBuffer = new ArrayBuffer(pdfBytes.length);
const view = new Uint8Array(arrayBuffer);
view.set(pdfBytes);

const blob = new Blob([arrayBuffer], { type: "application/pdf" });

const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "health-diary-report.pdf";
link.click();

  } catch (error) {
    console.error("PDF generation failed:", error);
  }
}


export default function Dashboard(): JSX.Element {
  // --- DATA FETCHING ---
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReadings() {
      try {
        setLoading(true);
        const res = await fetch("/api/readings");
        if (!res.ok) throw new Error("Failed to fetch readings");
        const data = await res.json();
        setReadings(data);
      } catch (err: any) {
        console.error("Error fetching readings:", err);
        setError("Unable to load readings. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchReadings();
  }, []);

  // --- FILTER SETUP ---
  const ALL_CONTEXTS = Array.from(new Set(readings.map((r) => r.context))).sort();
  const ALL_LABELS = Array.from(new Set(readings.map((r) => r.label))).sort();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "descending",
  });

  useEffect(() => {
    if (readings.length > 0) {
      const dates = readings.map((r) => new Date(r.date));
      const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      setStartDate(minDate.toISOString().split("T")[0]);
      setEndDate(maxDate.toISOString().split("T")[0]);
      setSelectedContexts(ALL_CONTEXTS);
      setSelectedLabels(ALL_LABELS);
    }
  }, [readings]);

  const toggleContext = (context: string): void => {
    setSelectedContexts((prev) =>
      prev.includes(context)
        ? prev.filter((c) => c !== context)
        : [...prev, context]
    );
  };

  const toggleLabel = (label: string): void => {
    setSelectedLabels((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const clearAllFilters = (): void => {
    if (readings.length > 0) {
      const dates = readings.map((r) => new Date(r.date));
      const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      setStartDate(minDate.toISOString().split("T")[0]);
      setEndDate(maxDate.toISOString().split("T")[0]);
    }
    setSelectedContexts(ALL_CONTEXTS);
    setSelectedLabels(ALL_LABELS);
    setSearchTerm("");
    setSortConfig({ key: "date", direction: "descending" });
  };

  // --- FILTERING & SORTING ---
  const filteredAndSortedData: Reading[] = useMemo(() => {
    let filteredData: Reading[] = readings.filter((reading) => {
      const readingDate = new Date(reading.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      const passesDate = readingDate >= start && readingDate <= end;
      const passesContext = selectedContexts.includes(reading.context);
      const passesLabel = selectedLabels.includes(reading.label);
      const passesSearch =
        searchTerm === "" ||
        reading.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.level.toString().includes(searchTerm) ||
        reading.label.toLowerCase().includes(searchTerm.toLowerCase());

      return passesDate && passesContext && passesLabel && passesSearch;
    });

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const key = sortConfig.key as keyof Reading;
        let aValue = a[key] as any;
        let bValue = b[key] as any;

        if (key === "level") {
          aValue = a.level;
          bValue = b.level;
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [
    readings,
    startDate,
    endDate,
    selectedContexts,
    selectedLabels,
    searchTerm,
    sortConfig,
  ]);

  const requestSort = (key: SortKey): void => {
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (sortConfig.key === key && sortConfig.direction === "descending") {
      setSortConfig({ key: "date", direction: "descending" });
      return;
    }
    setSortConfig({ key, direction });
  };

  const SortIcon: React.FC<SortIconProps> = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <ArrowUp className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 opacity-50 transition" />
      );
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="w-3 h-3 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-600" />
    );
  };

  // --- LOADING / ERROR UI ---
  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-[#11224e]">
        <Droplet className="w-8 h-8 mb-2 animate-pulse text-indigo-600" />
        <p>Loading your readings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen font-medium flex flex-col justify-center items-center text-[#11224e]">
        <p className="font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 cursor-pointer bg-[#f87b1b] text-[#11224e] rounded-lg hover:bg-orange-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- MAIN TABLE RENDER ---
  return (
    <div className="min-h-screen bg-[#CBD99B] p-4 sm:p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="md:text-2xl xs:text-lg sm:text-lg font-bold text-center text-[#11224e] flex flex-wrap items-center justify-center">
          <Droplet className="w-6 h-6 mr-3 text-red-600 xs:hidden sm:hidden" />
          Blood Sugar Reading History
        </h1>
        <button
  onClick={() => generatePDFReport({startDate, endDate, filteredAndSortedData})}
  className="absolute top-5 right-12 mb-6 px-4 py-2 bg-[#11224e] text-white rounded-lg shadow hover:bg-blue-900 transition"
>
  Download Doctor PDF Report
</button>
        <p className="text-gray-800 mt-4 sm:text-sm">
          Review, filter, and analyze your historical glucose data.
        </p>
      </header>

      {/* FILTER CONTROLS */}
      <section className="mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="sm:hidden w-full flex items-center justify-center p-3 mb-4 font-semibold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 transition duration-200"
        >
          <Filter className="w-5 h-5 mr-2" />
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isFilterOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 sm:max-h-full sm:opacity-100"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
            <DateInput label="End Date" value={endDate} onChange={setEndDate} />

            <FilterOption
              icon={Clock}
              title="Time of Day (Context)"
              options={ALL_CONTEXTS}
              selected={selectedContexts}
              onToggle={toggleContext}
            />

            <FilterOption
              icon={Tag}
              title="Label (Category)"
              options={ALL_LABELS}
              selected={selectedLabels}
              onToggle={toggleLabel}
            />
          </div>

          
        </div>
      </section>

      {/* TABLE */}
      <section className="bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-gray-200/50">
        <div className="p-4 text-center text-[#f87b1b] bg-[#11224e] border-b border-gray-200">
          <h2 className="text-xl font-semibold ">
            Showing {filteredAndSortedData.length} Readings
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {["S.No", "date", "time", "context", "level", "label"].map(
                  (key) => {
                    const labelMap: { [key: string]: string } = {
                      "S.No": "S.No",
                      date: "Date",
                      time: "Time",
                      context: "Time of Day",
                      level: "Sugar Level",
                      label: "Label",
                    };
                    const columnKey: SortKey | null =
                      key === "S.No" ? null : (key as SortKey);
                    const isClickable = columnKey !== null;

                    return (
                      <th
                        key={key}
                        scope="col"
                        className={`px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${
                          isClickable
                            ? "cursor-pointer group hover:bg-gray-200 transition duration-150"
                            : ""
                        }`}
                        onClick={
                          isClickable ? () => requestSort(columnKey!) : undefined
                        }
                      >
                        <span className="flex items-center whitespace-nowrap">
                          {labelMap[key]}
                          {isClickable && columnKey && (
                            <span className="ml-1">
                              <SortIcon columnKey={columnKey} />
                            </span>
                          )}
                        </span>
                      </th>
                    );
                  }
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedData.length > 0 ? (
                filteredAndSortedData.map((reading, index) => (
                  <tr
                    key={reading.id}
                    className="hover:bg-indigo-50 transition duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-indigo-400" />
                        {reading.date}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-indigo-400" />
                        {reading.time}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">
                      {reading.context}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-base font-bold text-indigo-700">
                      {reading.level}{" "}
                      <span className="text-sm font-normal text-indigo-500">
                        {reading.unit}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${getLabelColor(
                          reading.label
                        )}`}
                      >
                        {reading.label}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-gray-500 text-lg"
                  >
                    <Filter className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    No readings match the current filters. Try adjusting your
                    date range or removing some options.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* CHARTS SECTION */}
      {/* LINE CHART: READINGS OVER TIME */}
<div id="chart-line" className="bg-white p-6 my-20 rounded-xl shadow-xl mb-8">
  <h2 className="text-lg font-semibold text-[#11224e] mb-4">
    Blood Sugar Trend Over Time
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={filteredAndSortedData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="level"
        stroke="#f87b1b"
        strokeWidth={3}
        dot={true}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

{/* BAR CHART: AVERAGE PER CONTEXT */}
<div id="chart-bar" className="bg-white p-6 rounded-xl shadow-xl mb-8">
  <h2 className="text-lg font-semibold text-[#11224e] mb-4">
    Average Sugar Level by Time of Day
  </h2>

  
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={Object.values(
        filteredAndSortedData.reduce((acc: any, item) => {
          if (!acc[item.context])
            acc[item.context] = { context: item.context, total: 0, count: 0 };

          acc[item.context].total += item.level;
          acc[item.context].count++;
          return acc;
        }, {})
      ).map((x: any) => ({
        context: x.context,
        average: Math.round(x.total / x.count),
      }))}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="context" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="average" fill="#11224e" />
    </BarChart>
  </ResponsiveContainer>
</div>


    
    </div>
  );
}