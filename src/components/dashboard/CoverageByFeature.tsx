"use client";

import { FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";
import type { FeatureCoverage } from "@/types/releases";

interface CoverageByFeatureProps {
  features: FeatureCoverage[];
}

export function CoverageByFeature({ features }: CoverageByFeatureProps) {
  // If no features provided, show empty state
  if (!features || features.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#2c3e50]">
            Coverage by Feature
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Test coverage breakdown by module
          </p>
        </div>
        <div className="py-12 text-center text-gray-500">
          <p>No feature coverage data available yet.</p>
          <p className="mt-2 text-sm">
            Feature coverage will appear here once your tests include module-level metrics.
          </p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string, coverage: number) => {
    switch (status) {
      case "excellent":
        return {
          icon: <FiCheckCircle className="h-5 w-5" />,
          color: "text-green-600",
          bg: "bg-green-50",
          badge: "bg-green-100 text-green-800",
          label: "Excellent",
        };
      case "good":
        return {
          icon: <FiCheckCircle className="h-5 w-5" />,
          color: "text-green-600",
          bg: "bg-green-50",
          badge: "bg-green-100 text-green-800",
          label: "Good",
        };
      case "warning":
        return {
          icon: <FiAlertCircle className="h-5 w-5" />,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          badge: "bg-yellow-100 text-yellow-800",
          label: "Needs Work",
        };
      case "danger":
        return {
          icon: <FiXCircle className="h-5 w-5" />,
          color: "text-red-600",
          bg: "bg-red-50",
          badge: "bg-red-100 text-red-800",
          label: "Critical",
        };
      default:
        return {
          icon: <FiCheckCircle className="h-5 w-5" />,
          color: "text-gray-600",
          bg: "bg-gray-50",
          badge: "bg-gray-100 text-gray-800",
          label: "Unknown",
        };
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2c3e50]">
            Coverage by Feature
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Test coverage breakdown by module
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Feature Name
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Coverage
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {features.map((feature, index) => {
              const statusConfig = getStatusConfig(
                feature.status,
                feature.coverage
              );
              return (
                <tr
                  key={index}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="py-4 text-sm font-medium text-gray-900">
                    {feature.name}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {feature.coverage}%
                          </span>
                        </div>
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              feature.status === "excellent" || feature.status === "good"
                                ? "bg-[#48bb78]"
                                : feature.status === "warning"
                                ? "bg-[#ed8936]"
                                : "bg-[#f56565]"
                            }`}
                            style={{ width: `${feature.coverage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.badge}`}
                    >
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Average Coverage:</span>
          <span className="font-bold text-[#2c3e50]">
            {Math.round(
              features.reduce((acc, f) => acc + f.coverage, 0) /
                features.length
            )}
            %
          </span>
        </div>
      </div>
    </div>
  );
}
