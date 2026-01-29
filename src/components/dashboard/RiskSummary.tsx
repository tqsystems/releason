"use client";

import {
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";

interface RiskItem {
  severity: "high" | "medium" | "low" | "info";
  title: string;
  description: string;
}

export function RiskSummary() {
  const risks: RiskItem[] = [
    {
      severity: "high",
      title: "Low Test Coverage",
      description:
        "Compliance module has only 58% coverage - critical for production",
    },
    {
      severity: "medium",
      title: "Approval Rules Need Testing",
      description:
        "73% coverage on approval rules - recommend additional edge case testing",
    },
    {
      severity: "low",
      title: "Documentation Updates",
      description: "API documentation needs to be updated for new endpoints",
    },
    {
      severity: "info",
      title: "Performance Optimization",
      description:
        "Consider load testing the loan origination flow before peak season",
    },
  ];

  const getRiskConfig = (severity: string) => {
    switch (severity) {
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

  const highRiskCount = risks.filter((r) => r.severity === "high").length;
  const mediumRiskCount = risks.filter((r) => r.severity === "medium").length;

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
          const config = getRiskConfig(risk.severity);
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
                      {risk.title}
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
      <div className="mt-6 rounded-lg border border-[#667eea] bg-gradient-to-r from-[#667eea]/5 to-[#764ba2]/5 p-4">
        <div className="flex items-start space-x-3">
          <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#667eea]" />
          <div>
            <h3 className="text-sm font-semibold text-[#2c3e50]">
              Recommended Action
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Address the high-risk compliance coverage issue before proceeding
              with deployment. Consider running additional integration tests and
              scheduling a security review.
            </p>
            <button className="mt-3 inline-flex items-center rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-md">
              Create Action Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
