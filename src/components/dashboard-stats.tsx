"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ListTodo, Box, Users } from "lucide-react";

const stats = [
  {
    title: "Ordres de Réparation Actifs",
    value: "12",
    icon: Wrench,
    description: "+2 depuis hier",
  },
  {
    title: "Tasks to do today",
    value: "5",
    icon: ListTodo,
    description: "1 late",
  },
  {
    title: "Low stock pieces",
    value: "3",
    icon: Box,
    description: "Order soon",
  },
  {
    title: "New users this month",
    value: "8",
    icon: Users,
    description: "+15% vs last month",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
