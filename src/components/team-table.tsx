"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TeamMemberData {
  nome: string;
  cargo: string;
  emDia: number;
  atraso: number;
  total: number;
  performance: number;
  meta: number;
  gap: number;
}

interface TeamTableProps {
  data: TeamMemberData[];
  title?: string;
}

function getPerformanceBadge(performance: number, meta: number) {
  const diff = performance - meta;
  if (diff >= 10) {
    return (
      <Badge className="border-0 bg-gradient-success text-white shadow-sm">
        Acima da Meta
      </Badge>
    );
  }
  if (diff >= 0) {
    return (
      <Badge className="border-0 bg-gradient-brand text-white shadow-sm">
        Na Meta
      </Badge>
    );
  }
  return (
    <Badge className="border-0 bg-gradient-danger text-white shadow-sm">
      Abaixo da Meta
    </Badge>
  );
}

function getGapStyle(gap: number) {
  if (gap > 0) return "text-emerald-600 dark:text-emerald-400";
  if (gap < 0) return "text-red-600 dark:text-red-400";
  return "text-muted-foreground";
}

const AVATAR_GRADIENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-purple-500",
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

function hashIndex(name: string, mod: number) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash % mod;
}

export function TeamTable({ data, title = "Performance do Time" }: TeamTableProps) {
  return (
    <Card className="glass-panel border-0">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[220px]">Colaborador</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="text-center">Em Dia</TableHead>
                <TableHead className="text-center">Atraso</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="min-w-[160px]">Performance</TableHead>
                <TableHead className="text-center">Meta</TableHead>
                <TableHead className="text-center">GAP</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((member, i) => {
                const gradient =
                  AVATAR_GRADIENTS[hashIndex(member.nome, AVATAR_GRADIENTS.length)];
                const pct = Math.min(100, Math.max(0, member.performance));
                return (
                  <motion.tr
                    key={member.nome}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="border-b border-foreground/[0.06] transition-colors hover:bg-foreground/[0.03]"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white shadow-sm",
                            gradient
                          )}
                        >
                          {getInitials(member.nome).toUpperCase()}
                        </div>
                        <span>{member.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.cargo}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {member.emDia}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {member.atraso}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {member.total}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-full max-w-[110px] overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: i * 0.04 + 0.1, duration: 0.6, ease: "easeOut" }}
                            className={cn(
                              "h-full rounded-full",
                              pct >= member.meta
                                ? "bg-gradient-success"
                                : "bg-gradient-danger"
                            )}
                          />
                        </div>
                        <span className="text-sm font-medium tabular-nums">
                          {member.performance.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {member.meta}%
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn("font-medium", getGapStyle(member.gap))}>
                        {member.gap > 0 ? "+" : ""}
                        {member.gap.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getPerformanceBadge(member.performance, member.meta)}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
