import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InsightsGenerator = ({ journalEntries }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock AI analysis function - replace with actual AI integration
  const generateInsights = (entries) => {
    // Sample insights based on common patterns
    const sampleInsights = [
      {
        type: 'pattern',
        content: 'You tend to regret late-night decisions. Consider setting a "decision curfew".',
        actionable: 'Set reminders to avoid making important choices after 10 PM.'
      },
      {
        type: 'improvement',
        content: 'Your regrets about procrastination have decreased this month!',
        actionable: 'Keep using your new morning routine - it\'s working!'
      },
      {
        type: 'suggestion',
        content: 'Many of your regrets involve skipping exercise.',
        actionable: 'Try scheduling workouts with friends to increase accountability.'
      }
    ];

    return sampleInsights;
  };

  useEffect(() => {
    if (journalEntries?.length) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const newInsights = generateInsights(journalEntries);
        setInsights(newInsights);
        setLoading(false);
      }, 1500);
    }
  }, [journalEntries]);

  return (
    <div className="p-6 bg-off-black rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">AI Insights</h2>
      
      {loading ? (
        <motion.div 
          className="flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-4xl">🤔</span>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              className="bg-white/10 p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <h3 className="text-accent-orange font-semibold mb-2">
                {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
              </h3>
              <p className="text-white mb-2">{insight.content}</p>
              <p className="text-white/70 text-sm">
                💡 Try this: {insight.actionable}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsGenerator;
