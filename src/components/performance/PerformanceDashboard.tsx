import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { usePerformanceMonitoring, usePerformanceAlerts } from '../../hooks/usePerformanceMonitoring';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  rating, 
  threshold, 
  description 
}) => {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'needs-improvement': return <Clock className="h-4 w-4" />;
      case 'poor': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatValue = (val: number, unit: string) => {
    if (unit === 'ms') {
      return val >= 1000 ? `${(val / 1000).toFixed(2)}s` : `${Math.round(val)}ms`;
    }
    return `${val.toFixed(3)}`;
  };

  return (
    <Card className={`${getRatingColor(rating)} border-2`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {getRatingIcon(rating)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {formatValue(value, unit)}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={rating === 'good' ? 'default' : rating === 'needs-improvement' ? 'secondary' : 'destructive'}>
            {rating.replace('-', ' ')}
          </Badge>
        </div>
        <p className="text-xs text-gray-600 mb-2">{description}</p>
        <div className="text-xs text-gray-500">
          Good: &lt; {formatValue(threshold.good, unit)} | 
          Poor: &gt; {formatValue(threshold.poor, unit)}
        </div>
      </CardContent>
    </Card>
  );
};

interface PerformanceStatsResponse {
  stats: Record<string, any>;
  timeRange: string;
  totalSessions: number;
  totalMetrics: number;
}

const PerformanceDashboard: React.FC = () => {
  const { stats, isInitialized } = usePerformanceMonitoring();
  const { alerts, loading: alertsLoading, fetchAlerts } = usePerformanceAlerts();
  const [serverStats, setServerStats] = useState<PerformanceStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');

  const fetchServerStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/performance-metrics/stats?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setServerStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch server stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStats();
  }, [timeRange]);

  const refresh = () => {
    fetchServerStats();
    fetchAlerts(timeRange);
  };

  const metricThresholds = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 },
    ttfb: { good: 800, poor: 1800 }
  };

  const metricDescriptions = {
    lcp: 'Largest Contentful Paint - Time to render the largest content element',
    fid: 'First Input Delay - Time from first user interaction to browser response',
    cls: 'Cumulative Layout Shift - Visual stability of the page',
    fcp: 'First Contentful Paint - Time to render the first content element',
    ttfb: 'Time to First Byte - Time from navigation to first byte received'
  };

  const getOverallScore = () => {
    if (!serverStats?.stats) return null;
    
    const metrics = Object.keys(serverStats.stats);
    if (metrics.length === 0) return null;
    
    let goodCount = 0;
    let totalCount = 0;
    
    metrics.forEach(metric => {
      const data = serverStats.stats[metric];
      if (data?.ratings) {
        const total = data.ratings.good + data.ratings['needs-improvement'] + data.ratings.poor;
        if (total > 0) {
          goodCount += data.ratings.good;
          totalCount += total;
        }
      }
    });
    
    return totalCount > 0 ? Math.round((goodCount / totalCount) * 100) : null;
  };

  const overallScore = getOverallScore();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring of Core Web Vitals and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button onClick={refresh} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      {overallScore !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Overall Performance Score
            </CardTitle>
            <CardDescription>
              Percentage of good Core Web Vitals measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{overallScore}%</div>
              <div className="flex items-center gap-2">
                {overallScore >= 75 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <Badge variant={overallScore >= 75 ? 'default' : 'destructive'}>
                  {overallScore >= 75 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Monitoring Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isInitialized ? 'Active' : 'Inactive'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serverStats?.totalSessions || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Core Web Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Object.entries(metricThresholds).map(([metric, threshold]) => {
            const clientData = stats[metric as keyof typeof stats];
            const serverData = serverStats?.stats[metric];
            
            // Use server data if available, fallback to client data
            const value = serverData?.p75 || clientData?.value || 0;
            const rating = clientData?.rating || 'good';
            
            return (
              <MetricCard
                key={metric}
                title={metric.toUpperCase()}
                value={value}
                unit={metric === 'cls' ? '' : 'ms'}
                rating={rating as 'good' | 'needs-improvement' | 'poor'}
                threshold={threshold}
                description={metricDescriptions[metric as keyof typeof metricDescriptions]}
              />
            );
          })}
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Performance Alerts</h2>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>
                  Poor {alert.metric} Performance Detected
                </AlertTitle>
                <AlertDescription>
                  Value: {alert.value}{alert.metric === 'CLS' ? '' : 'ms'} on {alert.url}
                  <br />
                  <span className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && !serverStats && (
        <Card>
          <CardContent className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Performance Data Available
            </h3>
            <p className="text-gray-600 mb-4">
              Performance monitoring is active, but no metrics have been collected yet.
              Visit some pages to start collecting data.
            </p>
            <Button onClick={refresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceDashboard;