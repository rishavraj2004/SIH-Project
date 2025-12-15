import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { OptimizationResult } from '../../types';

interface OptimizationStatsProps {
  result: OptimizationResult;
  faculties: any[];
}

export const OptimizationStats: React.FC<OptimizationStatsProps> = ({ result, faculties }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'text-green-600 bg-green-100';
    if (utilization >= 60) return 'text-blue-600 bg-blue-100';
    if (utilization >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getFacultyName = (facultyId: string) => {
    const faculty = faculties.find(f => f.id === facultyId);
    return faculty?.name || facultyId;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
        <BarChart3 className="text-purple-600" size={24} />
        Optimization Statistics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 border border-gray-200 rounded-lg">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-semibold ${getScoreColor(result.score)}`}>
            <TrendingUp size={20} className="mr-2" />
            {result.score}%
          </div>
          <p className="text-gray-600 text-sm mt-2">Overall Optimization Score</p>
        </div>
        
        <div className="text-center p-4 border border-gray-200 rounded-lg">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-semibold ${getUtilizationColor(result.utilizationStats.classroomUtilization)}`}>
            <CheckCircle size={20} className="mr-2" />
            {result.utilizationStats.classroomUtilization}%
          </div>
          <p className="text-gray-600 text-sm mt-2">Classroom Utilization</p>
        </div>
        
        <div className="text-center p-4 border border-gray-200 rounded-lg">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-semibold ${result.conflicts.length === 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
            {result.conflicts.length === 0 ? (
              <CheckCircle size={20} className="mr-2" />
            ) : (
              <AlertCircle size={20} className="mr-2" />
            )}
            {result.conflicts.length}
          </div>
          <p className="text-gray-600 text-sm mt-2">Schedule Conflicts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-4 border-b pb-2">Faculty Workload Distribution</h4>
          <div className="space-y-3">
            {Object.entries(result.utilizationStats.facultyWorkload).map(([facultyId, workload]) => (
              <div key={facultyId} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1 mr-3">
                  {getFacultyName(facultyId)}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((workload / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-12 text-right">
                    {workload}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-4 border-b pb-2">Optimization Suggestions</h4>
          <div className="space-y-2">
            {result.utilizationStats.suggestions.length > 0 ? (
              result.utilizationStats.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-blue-800">{suggestion}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-600" size={16} />
                <p className="text-sm text-green-800">
                  Timetable is optimally scheduled with no suggestions for improvement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};