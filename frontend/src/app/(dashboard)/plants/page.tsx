"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { format } from "date-fns";
import { Search, Filter, Leaf, ImageIcon } from "lucide-react";

// Mock data for when backend is unavailable
const mockReports = [
  {
    id: 1,
    timestamp: new Date().toISOString(),
    field_row: "R1C1",
    health_status: "HEALTHY",
    risk_level: "LOW",
    health_score: 92,
    confidence_score: 0.95,
    image_url: null,
  },
  {
    id: 2,
    timestamp: new Date().toISOString(),
    field_row: "R1C3",
    health_status: "MILD_INFECTION",
    risk_level: "MODERATE",
    health_score: 58,
    confidence_score: 0.88,
    image_url: null,
  },
  {
    id: 3,
    timestamp: new Date().toISOString(),
    field_row: "R2C2",
    health_status: "SEVERE_INFECTION",
    risk_level: "CRITICAL",
    health_score: 21,
    confidence_score: 0.91,
    image_url: null,
  },
];

export default function PlantsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get("/plant-report");
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports, using mock data", error);
        setReports(mockReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Plant Reports</h1>
          <p className="text-gray-400">Crop diagnostics from UGV field scans.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by position..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 text-gray-300 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-950/50 border-b border-gray-800 text-gray-400 text-sm font-medium">
                <th className="p-4 pl-6">Plant ID</th>
                <th className="p-4">Time</th>
                <th className="p-4">Position</th>
                <th className="p-4">Crop Image</th>
                <th className="p-4">Health Status</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Health Score</th>
                <th className="p-4 text-right pr-6">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {reports.map((report: any) => (
                <tr key={report.id} className="hover:bg-gray-800/50 transition-colors group">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="font-medium text-white">#{report.id}</span>
                  </td>
                  <td className="p-4 text-gray-400">{format(new Date(report.timestamp), 'MMM d, HH:mm')}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-800 text-emerald-400 border border-gray-700">
                      {report.field_row || "—"}
                    </span>
                  </td>
                  <td className="p-4">
                    {report.image_url ? (
                      <button 
                        onClick={() => setSelectedImage(report.image_url)}
                        className="w-14 h-14 rounded-lg overflow-hidden border border-gray-700 hover:border-emerald-500 transition-colors cursor-pointer"
                      >
                        <img 
                          src={report.image_url} 
                          alt={`Crop ${report.field_row}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      report.health_status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      report.health_status === 'MILD_INFECTION' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {report.health_status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold ${
                      report.risk_level === 'CRITICAL' ? 'text-rose-500' :
                      report.risk_level === 'HIGH' ? 'text-rose-400' :
                      report.risk_level === 'MODERATE' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {report.risk_level}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${report.health_score > 70 ? 'bg-emerald-500' : report.health_score > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${report.health_score}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{report.health_score}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right pr-6 text-gray-400">
                    {(report.confidence_score * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              
              {reports.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No plant reports available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {reports.length > 0 && (
          <div className="p-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-400">
            <span>Showing {reports.length} reports</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-900 border border-gray-800 rounded hover:bg-gray-800 transition-colors">Prev</button>
              <button className="px-3 py-1 bg-gray-900 border border-gray-800 rounded hover:bg-gray-800 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
            <img src={selectedImage} alt="Crop scan" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
