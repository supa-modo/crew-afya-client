import { useState, useEffect } from "react";
import { getSystemHealth, getSystemLogs } from "../../services/adminService";
import {
  RefreshIcon,
  ServerIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  FilterIcon,
} from "../../utils/Icons";

const SystemHealth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data for UI development - will be replaced with actual API data
  const mockHealthData = {
    status: "healthy", // healthy, warning, critical
    uptime: "15d 7h 23m",
    lastRestart: "2023-06-01T08:00:00Z",
    cpu: {
      usage: 32,
      cores: 4,
    },
    memory: {
      total: 8192, // MB
      used: 3584, // MB
      free: 4608, // MB
    },
    disk: {
      total: 100, // GB
      used: 45, // GB
      free: 55, // GB
    },
    database: {
      status: "connected",
      responseTime: 42, // ms
      connections: 12,
      queries: {
        total: 15782,
        failed: 23,
      },
    },
    services: [
      {
        name: "API Server",
        status: "healthy",
        responseTime: 120, // ms
      },
      {
        name: "Payment Gateway",
        status: "healthy",
        responseTime: 350, // ms
      },
      {
        name: "SMS Service",
        status: "warning",
        responseTime: 850, // ms
      },
      {
        name: "Email Service",
        status: "healthy",
        responseTime: 280, // ms
      },
    ],
  };

  // Mock logs data
  const mockLogs = [
    {
      id: "log1",
      timestamp: "2023-06-15T10:30:45Z",
      level: "info",
      service: "API Server",
      message: "User login successful",
      details: { userId: "user123", ip: "192.168.1.1" },
    },
    {
      id: "log2",
      timestamp: "2023-06-15T10:28:12Z",
      level: "error",
      service: "Payment Gateway",
      message: "Payment processing failed",
      details: { transactionId: "tx123456", reason: "Insufficient funds" },
    },
    {
      id: "log3",
      timestamp: "2023-06-15T10:25:30Z",
      level: "warn",
      service: "SMS Service",
      message: "SMS delivery delayed",
      details: { phoneNumber: "+254712345678", retries: 2 },
    },
    {
      id: "log4",
      timestamp: "2023-06-15T10:20:15Z",
      level: "info",
      service: "API Server",
      message: "New user registered",
      details: { userId: "user124", method: "email" },
    },
    {
      id: "log5",
      timestamp: "2023-06-15T10:15:22Z",
      level: "error",
      service: "Database",
      message: "Query timeout",
      details: { queryId: "q789012", duration: "5000ms" },
    },
  ];

  useEffect(() => {
    fetchHealthData();
    fetchLogs();
  }, [logFilter, currentPage]);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call the API
      // const response = await getSystemHealth();

      // Mock API response
      setTimeout(() => {
        setHealthData(mockHealthData);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error fetching health data:", err);
      setError(err.message || "Failed to load system health data");
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      // In a real implementation, this would call the API
      // const response = await getSystemLogs({
      //   page: currentPage,
      //   limit: 10,
      //   level: logFilter !== "all" ? logFilter : undefined,
      // });

      // Mock API response
      setTimeout(() => {
        let filteredLogs = [...mockLogs];

        if (logFilter !== "all") {
          filteredLogs = filteredLogs.filter((log) => log.level === logFilter);
        }

        setLogs(filteredLogs);
        setTotalPages(Math.ceil(filteredLogs.length / 10));
      }, 300);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError(err.message || "Failed to load system logs");
    }
  };

  const handleRefresh = () => {
    fetchHealthData();
    fetchLogs();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "warning":
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-600" />;
      case "critical":
      case "error":
        return <ExclamationCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getLogLevelBadge = (level) => {
    switch (level) {
      case "info":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            INFO
          </span>
        );
      case "warn":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            WARN
          </span>
        );
      case "error":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            ERROR
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {level.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">System Health</h2>
        <button
          onClick={handleRefresh}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <RefreshIcon className="h-5 w-5 mr-1 text-gray-500" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {/* System Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          System Overview
        </h3>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-4">
              <div className="mr-2">{getStatusIcon(healthData?.status)}</div>
              <div>
                <span
                  className={`font-medium ${getStatusColor(
                    healthData?.status
                  )}`}
                >
                  System Status:{" "}
                  {healthData?.status.charAt(0).toUpperCase() +
                    healthData?.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500 ml-4">
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  Uptime: {healthData?.uptime}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CPU Usage */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  CPU Usage
                </h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">
                    {healthData?.cpu.usage}%
                  </span>
                  <span className="text-sm text-gray-500">
                    {healthData?.cpu.cores} Cores
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      healthData?.cpu.usage > 80
                        ? "bg-red-600"
                        : healthData?.cpu.usage > 60
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }`}
                    style={{ width: `${healthData?.cpu.usage}%` }}
                  ></div>
                </div>
              </div>

              {/* Memory Usage */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Memory Usage
                </h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">
                    {Math.round(
                      (healthData?.memory.used / healthData?.memory.total) * 100
                    )}
                    %
                  </span>
                  <span className="text-sm text-gray-500">
                    {(healthData?.memory.used / 1024).toFixed(1)} GB /{" "}
                    {(healthData?.memory.total / 1024).toFixed(1)} GB
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      healthData?.memory.used / healthData?.memory.total > 0.8
                        ? "bg-red-600"
                        : healthData?.memory.used / healthData?.memory.total >
                          0.6
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }`}
                    style={{
                      width: `${
                        (healthData?.memory.used / healthData?.memory.total) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Disk Usage */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Disk Usage
                </h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">
                    {healthData?.disk.used}%
                  </span>
                  <span className="text-sm text-gray-500">
                    {healthData?.disk.used} GB / {healthData?.disk.total} GB
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      healthData?.disk.used > 80
                        ? "bg-red-600"
                        : healthData?.disk.used > 60
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }`}
                    style={{ width: `${healthData?.disk.used}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Services Status
        </h3>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Service
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Response Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthData?.services.map((service, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ServerIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {service.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(service.status)}
                        <span
                          className={`ml-1.5 text-sm ${getStatusColor(
                            service.status
                          )}`}
                        >
                          {service.status.charAt(0).toUpperCase() +
                            service.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.responseTime} ms
                      {service.responseTime > 500 && (
                        <span className="ml-2 text-yellow-600 text-xs">
                          (Slow)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Database Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Database Status
        </h3>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-4">
              <div className="mr-2">
                {getStatusIcon(healthData?.database.status)}
              </div>
              <div>
                <span
                  className={`font-medium ${getStatusColor(
                    healthData?.database.status
                  )}`}
                >
                  Database Status:{" "}
                  {healthData?.database.status.charAt(0).toUpperCase() +
                    healthData?.database.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Response Time
                </h4>
                <p className="text-2xl font-bold">
                  {healthData?.database.responseTime} ms
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Active Connections
                </h4>
                <p className="text-2xl font-bold">
                  {healthData?.database.connections}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Query Success Rate
                </h4>
                <p className="text-2xl font-bold">
                  {(
                    ((healthData?.database.queries.total -
                      healthData?.database.queries.failed) /
                      healthData?.database.queries.total) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className="text-xs text-gray-500">
                  {healthData?.database.queries.failed} failed out of{" "}
                  {healthData?.database.queries.total} queries
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* System Logs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">System Logs</h3>
          <div className="flex items-center">
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timestamp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Level
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Message
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLogLevelBadge(log.level)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <pre className="text-xs bg-gray-50 p-1 rounded overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {logs.length} of {logs.length} logs
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
