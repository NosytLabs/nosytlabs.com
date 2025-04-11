import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import analyticsService from '../utils/analyticsService';
import '../styles/analytics-dashboard.css';

/**
 * AnalyticsDashboard - A React component for visualizing application analytics
 *
 * Features:
 * - Real-time metrics dashboard
 * - Interactive charts for traffic, errors, and performance
 * - Configurable time range selector
 * - Responsive layout
 */

// Register Chart.js components
Chart.register(...registerables);

const AnalyticsDashboard = () => {
  // Track chart instances for cleanup
  const charts = useRef([]);
  
  // Analytics metrics state
  const [metrics, setMetrics] = useState({
    pageViews: 0,
    errors: 0,
    avgLoadTime: 0,
    activeUsers: 0
  });
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);

  // Refs for chart instances
  const trafficChartRef = useRef(null);
  const errorChartRef = useRef(null);
  const performanceChartRef = useRef(null);

  // Sample data - in a real app this would come from an API
  const sampleData = {
    trafficData: {
      labels: ['Home', 'Projects', 'Vault', 'Contact', 'About'],
      datasets: [{
        label: 'Page Views',
        data: [120, 90, 75, 60, 45],
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }]
    },
    errorData: {
      labels: ['404', '500', 'Script', 'API', 'Other'],
      datasets: [{
        label: 'Errors',
        data: [5, 3, 8, 2, 1],
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }]
    },
    performanceData: {
      labels: ['TTFB', 'DOM Load', 'Full Load', 'JS Size', 'CSS Size'],
      datasets: [{
        label: 'ms',
        data: [120, 450, 800, 350, 150],
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }]
    }
  };

  useEffect(() => {
    initializeCharts();
    fetchAnalyticsData();

    // Set up live updates
    const interval = setInterval(fetchAnalyticsData, 30000);
    
    // Cleanup
    return () => {
      clearInterval(interval);
      destroyCharts();
    };
  }, [timeRange]);

  const initializeCharts = () => {
    // Traffic Chart
    if (trafficChartRef.current) {
      const trafficChart = new Chart(trafficChartRef.current, {
        type: 'bar',
        data: sampleData.trafficData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Page Views by Route'
            }
          }
        }
      });
      charts.current.push(trafficChart);
    }

    // Error Chart
    if (errorChartRef.current) {
      const errorChart = new Chart(errorChartRef.current, {
        type: 'doughnut',
        data: sampleData.errorData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: 'Error Distribution'
            }
          }
        }
      });
      charts.current.push(errorChart);
    }

    // Performance Chart
    if (performanceChartRef.current) {
      const performanceChart = new Chart(performanceChartRef.current, {
        type: 'radar',
        data: sampleData.performanceData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Performance Metrics'
            }
          },
          scales: {
            r: {
              angleLines: {
                display: true
              },
              suggestedMin: 0,
              suggestedMax: 1000
            }
          }
        }
      });
      charts.current.push(performanceChart);
    }
  };

  const destroyCharts = () => {
    // Destroy all registered charts safely
    charts.current.forEach(chart => {
      try {
        chart.destroy();
      } catch (error) {
        analyticsService.trackError(error);
      }
    });
    charts.current = [];
  };

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, fetch from your analytics API
      // const response = await fetch(`/api/analytics?range=${timeRange}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData = {
        pageViews: Math.floor(Math.random() * 1000),
        errors: Math.floor(Math.random() * 50),
        avgLoadTime: Math.floor(Math.random() * 2000),
        activeUsers: Math.floor(Math.random() * 100)
      };

      setMetrics(mockData);
      setIsLoading(false);
    } catch (error) {
      analyticsService.trackError(error);
      setIsLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-controls">
        <select 
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          disabled={isLoading}
        >
          <option value="1h">Last hour</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <div className="metrics-summary">
        <div className="metric-card">
          <h3>Page Views</h3>
          <p>{metrics.pageViews.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <h3>Errors</h3>
          <p>{metrics.errors.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <h3>Avg. Load Time</h3>
          <p>{metrics.avgLoadTime}ms</p>
        </div>
        <div className="metric-card">
          <h3>Active Users</h3>
          <p>{metrics.activeUsers.toLocaleString()}</p>
        </div>
      </div>

      <div className="chart-container">
        <canvas ref={trafficChartRef} />
      </div>
      
      <div className="chart-row">
        <div className="chart-container">
          <canvas ref={errorChartRef} />
        </div>
        <div className="chart-container">
          <canvas ref={performanceChartRef} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;