"use client";

import {
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";
import type { RiskItem } from "@/types/releases";

interface RiskSummaryProps {
  risks: RiskItem[];
}

export function RiskSummary({ risks }: RiskSummaryProps) {
  // If no risks provided, show empty state
  if (!risks || risks.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#2c3e50]">Risk Summary</h2>
          <p className="mt-1 text-sm text-gray-600">
            Issues requiring attention before release
          </p>
        </div>
        <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
          <FiCheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
          <h3 className="mb-2 text-lg font-semibold text-green-900">
            All Clear!
          </h3>
          <p className="text-sm text-green-700">
            No significant risks detected. Your release looks good to go!
          </p>
        </div>
      </div>
    );
  }

  const getRiskConfig = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return {
          icon: <FiAlertTriangle className="h-5 w-5" />,
          color: "text-red-600",
          bg: "bg-red-50",
          badge: "bg-red-100 text-red-800 border-red-200",
          label: "High Risk",
        };
      case "medium":
        return {
          icon: <FiAlertCircle className="h-5 w-5" />,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
          label: "Medium Risk",
        };
      case "low":
        return {
          icon: <FiInfo className="h-5 w-5" />,
          color: "text-blue-600",
          bg: "bg-blue-50",
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Low Risk",
        };
      case "info":
        return {
          icon: <FiCheckCircle className="h-5 w-5" />,
          color: "text-gray-600",
          bg: "bg-gray-50",
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Info",
        };
      default:
        return {
          icon: <FiInfo className="h-5 w-5" />,
          color: "text-gray-600",
          bg: "bg-gray-50",
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Unknown",
        };
    }
  };

  const highRiskCount = risks.filter((r) => r.risk_level.toLowerCase() === "high").length;
  const mediumRiskCount = risks.filter((r) => r.risk_level.toLowerCase() === "medium").length;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#2c3e50]">Risk Summary</h2>
            <p className="mt-1 text-sm text-gray-600">
              Issues requiring attention before release
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {highRiskCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
                {highRiskCount} High
              </span>
            )}
            {mediumRiskCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                {mediumRiskCount} Medium
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Risk Items */}
      <div className="space-y-4">
        {risks.map((risk, index) => {
          const config = getRiskConfig(risk.risk_level);
          return (
            <div
              key={index}
              className={`rounded-lg border ${config.bg} p-4 transition-all hover:shadow-sm`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 flex-shrink-0 ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {risk.risk_name}
                    </h3>
                    <span
                      className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${config.badge}`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {risk.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation Section */}
      {highRiskCount > 0 && (
        <div className="mt-6 rounded-lg border border-[#667eea] bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 p-4">
          <div className="flex items-start space-x-3">
            <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#667eea]" />
            <div>
              <h3 className="text-sm font-semibold text-[#2c3e50]">
                Recommended Action
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Address the {highRiskCount} high-risk issue{highRiskCount > 1 ? "s" : ""} before proceeding
                with deployment. Review the recommendations above and consider running
                additional tests in affected areas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
