import React, { useState, useEffect } from "react";

// This component displays financial insights with improved parsing for backend responses
const EnhancedInsights = ({ insights }) => {
  const [parsedInsights, setParsedInsights] = useState({
    summary: "",
    categories: [],
    recommendations: [],
    anomalies: [], // Added for anomalies specifically
    trends: []
  });

  useEffect(() => {
    if (insights) {
      // Process and categorize insights
      const processInsights = (text) => {
        // Remove any HTML tags if present
        const plainText = text.replace(/<[^>]*>?/gm, '');
        
        const result = {
          summary: "",
          categories: [],
          recommendations: [],
          anomalies: [],
          trends: []
        };
        
        // Extract summary (first paragraph)
        const paragraphs = plainText.split(/\n\s*\n/);
        if (paragraphs.length > 0) {
          result.summary = paragraphs[0].trim();
        }
        
        // Split into sentences for better analysis
        const allSentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Look for category insights
        const categoryPattern = /(?:([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+(?:spending|expenses|costs|category|purchases))|(?:In the\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+category)/i;
        
        // Process each sentence to find category-specific insights
        allSentences.forEach(sentence => {
          const trimmed = sentence.trim();
          
          // Analyze categories
          const categoryMatch = trimmed.match(categoryPattern);
          if (categoryMatch) {
            const category = (categoryMatch[1] || categoryMatch[2]);
            if (category) {
              result.categories.push(trimmed + '.');
            }
          }
          
          // Identify recommendations
          const recommendationPhrases = [
            "recommend", "should", "consider", "try to", "focus on", "reduce", 
            "increase", "budget for", "might want to", "suggestion", "could", "advised"
          ];
          
          if (recommendationPhrases.some(phrase => trimmed.toLowerCase().includes(phrase))) {
            result.recommendations.push(trimmed + '.');
          }
          
          // Identify anomalies
          const anomalyPhrases = [
            "anomaly", "unusual", "unexpected", "spike", "significant increase", 
            "outlier", "irregular", "abnormal", "surprising", "higher than usual", 
            "lower than expected"
          ];
          
          if (anomalyPhrases.some(phrase => trimmed.toLowerCase().includes(phrase))) {
            result.anomalies.push(trimmed + '.');
          }
          
          // Identify trends (that aren't already categorized)
          const trendPhrases = [
            "trend", "pattern", "consistently", "over time", "month-over-month", 
            "increasing", "decreasing", "stable", "fluctuating", "gradual", 
            "compared to", "average"
          ];
          
          if (trendPhrases.some(phrase => trimmed.toLowerCase().includes(phrase)) && 
              !result.recommendations.includes(trimmed + '.') && 
              !result.anomalies.includes(trimmed + '.')) {
            result.trends.push(trimmed + '.');
          }
        });
        
        return result;
      };
      
      setParsedInsights(processInsights(insights));
    }
  }, [insights]);

  const { summary, categories, recommendations, anomalies, trends } = parsedInsights;

  // Icons for different sections
  const InsightIcon = () => (
    <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  const CategoryIcon = () => (
    <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
  
  const TrendIcon = () => (
    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
  
  const RecommendationIcon = () => (
    <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
  
  const AnomalyIcon = () => (
    <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  // If no insights available yet
  if (!insights) {
    return (
      <div className="flex justify-center items-center h-32 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-blue-500 font-medium">Click "Get Insights" to view financial analysis</p>
      </div>
    );
  }

  return (
    <div className="border border-blue-100 rounded-lg shadow-sm p-6 bg-gradient-to-br from-blue-50 to-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center">
        <svg className="h-7 w-7 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Financial Insights
      </h2>
      
      {/* Summary Card */}
      {summary && (
        <div className="bg-white rounded-lg border border-blue-200 p-4 mb-6 shadow-sm">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4">
              <InsightIcon />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Summary</h3>
              <p className="text-gray-700">{summary}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Category Insights */}
        {categories.length > 0 && (
          <div className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 rounded-full p-2 mr-2">
                <CategoryIcon />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Category Insights</h3>
            </div>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-2"></span>
                  <span className="text-gray-700">{category}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Trends */}
        {trends.length > 0 && (
          <div className="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 rounded-full p-2 mr-2">
                <TrendIcon />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Spending Trends</h3>
            </div>
            <ul className="space-y-2">
              {trends.map((trend, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                  <span className="text-gray-700">{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Anomalies - Added new section */}
        {anomalies.length > 0 && (
          <div className="bg-white rounded-lg border border-red-200 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 rounded-full p-2 mr-2">
                <AnomalyIcon />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Anomalies</h3>
            </div>
            <ul className="space-y-2">
              {anomalies.map((anomaly, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-2"></span>
                  <span className="text-gray-700">{anomaly}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Recommendations - Full Width */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg border border-amber-200 p-4 mt-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="bg-amber-100 rounded-full p-2 mr-2">
              <RecommendationIcon />
            </div>
            <h3 className="font-bold text-lg text-gray-900">Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-2"></span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Fallback for any other content not categorized */}
      {parsedInsights.summary === "" && parsedInsights.categories.length === 0 && 
       parsedInsights.recommendations.length === 0 && parsedInsights.trends.length === 0 &&
       parsedInsights.anomalies.length === 0 && (
        <div className="bg-white rounded-lg border border-blue-200 p-4 shadow-sm">
          <div className="prose prose-blue max-w-none">
            <div dangerouslySetInnerHTML={{ __html: insights }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedInsights;