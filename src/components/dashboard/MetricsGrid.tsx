"use client";

import { FiTrendingUp, FiShield, FiAlertTriangle, FiClock } from "react-icons/fi";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  percentage: number;
  color: "green" | "yellow" | "red" | "blue";
  icon: React.ReactNode;
}

function MetricCard({
  title,
  value,
  subtitle,
  percentage,
  color,
  icon,
}: MetricCardProps) {
  const colorClasses = {
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      progress: "bg-green-500",
      text: "text-green-600",
    },
    yellow: {
      bg: "bg-yellow-50",
      icon: "text-yellow-600",
      progress: "bg-yellow-500",
      text: "text-yellow-600",
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      progress: "bg-red-500",
      text: "text-red-600",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      progress: "bg-blue-500",
      text: "text-blue-600",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#2c3e50]">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`rounded-lg ${colors.bg} p-3`}>
          <div className={colors.icon}>{icon}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${colors.progress} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">Progress</span>
          <span className={`text-xs font-semibold ${colors.text}`}>
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface MetricsGridProps {
  releaseConfidence: number;
  testCoverage: number;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  timeToShip: string;
  passRate: number;
}

export function MetricsGrid({
  releaseConfidence,
  testCoverage,
  riskLevel,
  timeToShip,
  passRate,
}: MetricsGridProps) {
  // Determine risk color and percentage
  const getRiskColor = (risk: string): "green" | "yellow" | "red" => {
    if (risk === "Low") return "green";
    if (risk === "Medium") return "yellow";
    return "red";
  };

  const getRiskPercentage = (risk: string): number => {
    if (risk === "Critical") return 25;
    if (risk === "High") return 50;
    if (risk === "Medium") return 65;
    return 90;
  };

  const metrics = [
    {
      title: "Release Confidence",
      value: `${Math.round(releaseConfidence)}%`,
      subtitle: releaseConfidence >= 85 ? "Above target threshold" : "Below recommended level",
      percentage: Math.round(releaseConfidence),
      color: releaseConfidence >= 85 ? ("green" as const) : releaseConfidence >= 70 ? ("yellow" as const) : ("red" as const),
      icon: <FiTrendingUp className="h-6 w-6" />,
    },
    {
      title: "Test Coverage",
      value: `${Math.round(testCoverage)}%`,
      subtitle: "Overall coverage score",
      percentage: Math.round(testCoverage),
      color: testCoverage >= 85 ? ("green" as const) : testCoverage >= 70 ? ("yellow" as const) : ("red" as const),
      icon: <FiShield className="h-6 w-6" />,
    },
    {
      title: "Risk Level",
      value: riskLevel,
      subtitle: `Pass rate: ${Math.round(passRate)}%`,
      percentage: getRiskPercentage(riskLevel),
      color: getRiskColor(riskLevel),
      icon: <FiAlertTriangle className="h-6 w-6" />,
    },
    {
      title: "Time to Ship",
      value: timeToShip,
      subtitle: "Estimated deployment time",
      percentage: 75, // Static for now
      color: "blue" as const,
      icon: <FiClock className="h-6 w-6" />,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
