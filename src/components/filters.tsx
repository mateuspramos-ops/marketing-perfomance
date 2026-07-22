"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";

interface FiltersProps {
  months: string[];
  years: number[];
  clients: string[];
  selectedMonth?: string;
  selectedYear?: number;
  selectedClient?: string;
  onMonthChange?: (value: string) => void;
  onYearChange?: (value: number) => void;
  onClientChange?: (value: string) => void;
}

export function Filters({
  months,
  years,
  clients,
  selectedMonth,
  selectedYear,
  selectedClient,
  onMonthChange,
  onYearChange,
  onClientChange,
}: FiltersProps) {
  return (
    <Card className="mb-6 glass-panel border-0">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-sm">
              <Filter className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              value={selectedMonth || "all"}
              onValueChange={(value) =>
                onMonthChange?.(value === "all" || value === null ? "" : value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Meses</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedYear?.toString() || "all"}
              onValueChange={(value) =>
                onYearChange?.(value === "all" || value === null ? 0 : parseInt(value))
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Anos</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedClient || "all"}
              onValueChange={(value) =>
                onClientChange?.(value === "all" || value === null ? "" : value)
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clientes</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
