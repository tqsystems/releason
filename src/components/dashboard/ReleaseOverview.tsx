"use client";

import { FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";

export function ReleaseOverview() {
  const confidenceScore = 87;
  const riskLevel = "Medium";
  const releaseNumber = "v2.4.0";
  const releaseDate = "Dec 15, 2024";

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        };
      case "Medium":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        };
      case "High":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        };
    }
  };

  const riskColors = getRiskColor(riskLevel);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8 text-white shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Left Side - Score */}
          <div className="mb-6 lg:mb-0">
            <div className="mb-2 flex items-center space-x-2">
              <span className="text-sm font-medium opacity-90">
                Release {releaseNumber}
              </span>
              <span className="text-sm opacity-75">•</span>
              <span className="text-sm opacity-75">{releaseDate}</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              {confidenceScore}%
            </h2>
            <p className="text-lg font-medium opacity-90">
              Release Confidence Score
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <span
                className={`inline-flex items-center rounded-full border ${riskColors.border} ${riskColors.bg} px-3 py-1 text-sm font-medium ${riskColors.text}`}
              >
                <FiAlertCircle className="mr-1.5 h-4 w-4" />
                {riskLevel} Risk
              </span>
            </div>
          </div>

          {/* Right Side - Progress Circle */}
          <div className="flex items-center space-x-8">
            <div className="relative">
              {/* Circular Progress */}
              <svg className="h-40 w-40 lg:h-48 lg:w-48" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${confidenceScore * 2.51} ${
                    (100 - confidenceScore) * 2.51
                  }`}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiCheckCircle className="h-12 w-12 lg:h-16 lg:w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Section */}
        <div className="mt-8 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <FiClock className="mt-1 h-5 w-5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Recommendation</h3>
              <p className="mt-1 text-sm opacity-90">
                Release confidence is good, but consider improving test coverage
                for Compliance features before deploying to production.
                Estimated time to ship: <span className="font-semibold">2h 30m</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
