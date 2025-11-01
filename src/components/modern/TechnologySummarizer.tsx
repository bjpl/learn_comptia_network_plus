import React, { useState } from 'react';
import type {
  TechnologyArticle,
  TechnologyCategory,
  SummarySection,
  TechnologySummary,
} from './modern-types';
import { technologyArticles } from './modern-data';

const TechnologySummarizer: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<TechnologyArticle | null>(null);
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});
  const [evaluationResult, setEvaluationResult] = useState<TechnologySummary | null>(null);
  const [showArticle, setShowArticle] = useState(false);

  const categoryInfo: Record<TechnologyCategory, { name: string; features: string[] }> = {
    'sdn-sdwan': {
      name: 'SDN/SD-WAN Features',
      features: [
        'Application-aware routing',
        'Zero-touch provisioning',
        'Transport agnostic',
        'Central policy management',
      ],
    },
    vxlan: {
      name: 'VXLAN Concepts',
      features: ['Data Center Interconnect (DCI)', 'Layer 2 over Layer 3 encapsulation'],
    },
    'zero-trust': {
      name: 'Zero Trust Architecture',
      features: [
        'Policy-based authentication',
        'Authorization requirements',
        'Least privilege access',
      ],
    },
    'sase-sse': {
      name: 'SASE/SSE Components',
      features: ['Secure Access Service Edge', 'Security Service Edge functions'],
    },
    iac: {
      name: 'Infrastructure as Code',
      features: [
        'Automation with playbooks/templates',
        'Configuration drift checking',
        'Version control and branching',
        'Central repository management',
      ],
    },
    ipv6: {
      name: 'IPv6 Implementation',
      features: [
        'Address exhaustion mitigation',
        'Tunneling methods (6to4, Teredo)',
        'Dual stack configuration',
        'NAT64 translation',
      ],
    },
  };

  const modernTechInfo: Record<string, { name: string; features: string[] }> = {
    'nfv-overview': {
      name: 'Network Functions Virtualization',
      features: [
        'Service Function Chaining (SFC)',
        'Virtualized Network Functions (VNFs)',
        'Resource efficiency and consolidation',
        'NFV MANO orchestration',
      ],
    },
    'iot-networking': {
      name: 'IoT Networking Basics',
      features: [
        'LPWAN and cellular protocols',
        'CoAP and MQTT protocols',
        'Edge computing and fog networking',
        'Device management and updates',
      ],
    },
    '5g-fundamentals': {
      name: '5G Network Fundamentals',
      features: [
        'Network slicing and virtual networks',
        'Ultra-low latency (1ms)',
        'Massive MIMO and beamforming',
        'Mobile edge computing (MEC)',
      ],
    },
  };

  const handleArticleSelect = (article: TechnologyArticle) => {
    setSelectedArticle(article);
    setSummaries({});
    setEvaluationResult(null);
    setShowArticle(false);
  };

  const handleSummaryChange = (category: string, text: string) => {
    setSummaries((prev) => ({ ...prev, [category]: text }));
  };

  const evaluateSummary = () => {
    if (!selectedArticle) {
      return;
    }

    const category = selectedArticle.category;
    const summaryText = summaries[selectedArticle.id] || '';
    const wordCount = summaryText.trim().split(/\s+/).length;

    // Get features from appropriate info object
    let features: string[] = [];
    let categoryName = '';

    if (categoryInfo[category]) {
      features = categoryInfo[category].features;
      categoryName = categoryInfo[category].name;
    } else if (modernTechInfo[selectedArticle.id]) {
      features = modernTechInfo[selectedArticle.id].features;
      categoryName = modernTechInfo[selectedArticle.id].name;
    }

    // Check for feature mentions
    const featuresFound = features.filter((feature) =>
      summaryText.toLowerCase().includes(feature.toLowerCase().split(' (')[0])
    );

    // Calculate scores
    const completenessScore = Math.min(100, (featuresFound.length / features.length) * 100);
    const wordCountScore = wordCount <= 200 ? 100 : Math.max(0, 100 - (wordCount - 200) * 0.5);
    const accuracyScore = calculateAccuracy(summaryText, selectedArticle.content);
    const overallScore = (completenessScore + wordCountScore + accuracyScore) / 3;

    // Generate feedback
    const feedback: string[] = [];
    if (completenessScore < 100) {
      const missing = features.filter((f) => !featuresFound.includes(f));
      feedback.push(`Missing coverage of: ${missing.join(', ')}`);
    }
    if (wordCount > 200) {
      feedback.push(`Summary exceeds 200-word limit (${wordCount} words)`);
    }
    if (accuracyScore < 70) {
      feedback.push('Summary contains inaccurate or misleading information');
    }
    if (overallScore >= 90) {
      feedback.push('Excellent summary! Comprehensive and concise.');
    } else if (overallScore >= 70) {
      feedback.push('Good summary, but could be improved.');
    }

    const section: SummarySection = {
      category: categoryName,
      features: featuresFound,
      completed: true,
      wordCount,
      accuracy: accuracyScore,
    };

    const result: TechnologySummary = {
      articleId: selectedArticle.id,
      sections: [section],
      totalWordCount: wordCount,
      completenessScore,
      accuracyScore,
      overallScore,
      feedback,
    };

    setEvaluationResult(result);
  };

  const calculateAccuracy = (summary: string, article: string): number => {
    const summaryLower = summary.toLowerCase();
    const articleLower = article.toLowerCase();

    // Check for key technical terms (removed unused keyTerms array)

    let accuracyScore = 80; // Base score

    // Penalize for common mistakes
    const mistakes = [
      { pattern: /ipv4.*ipv6/i, penalty: 10, description: 'IPv4/IPv6 confusion' },
      { pattern: /layer\s*3.*layer\s*2/i, penalty: 5, description: 'OSI layer confusion' },
      { pattern: /encryption.*authentication/i, penalty: 5, description: 'Security term misuse' },
    ];

    mistakes.forEach((mistake) => {
      if (mistake.pattern.test(summaryLower)) {
        accuracyScore -= mistake.penalty;
      }
    });

    // Bonus for including specific technical details from article
    if (summaryLower.includes('overlay') && articleLower.includes('overlay')) {
      accuracyScore += 5;
    }
    if (summaryLower.includes('encapsulation') && articleLower.includes('encapsulation')) {
      accuracyScore += 5;
    }

    return Math.max(0, Math.min(100, accuracyScore));
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) {
      return 'text-green-600';
    }
    if (score >= 70) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  return (
    <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
          Component 18: Modern Network Technology Summarizer
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Master modern networking technologies including SDN, NFV, SD-WAN, IoT, and 5G through
          comprehensive article summaries. Covers CompTIA Network+ LO 1.8 and beyond. Read technical
          articles (1000-2000 words) and create structured summaries covering key technology
          features. Summaries are auto-scored based on completeness and accuracy.
        </p>
      </div>

      {/* Article Selection */}
      <div className="mb-6">
        <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Select an Article to Summarize
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {technologyArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => handleArticleSelect(article)}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                selectedArticle?.id === article.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="mb-1 font-semibold text-gray-800 dark:text-gray-100">
                {article.title}
              </div>
              <div className="mb-2 text-sm text-gray-700 dark:text-gray-400">
                {article.wordCount} words • {article.difficulty}
              </div>
              <div className="flex flex-wrap gap-1">
                {article.keyTopics.map((topic, idx) => (
                  <span key={idx} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    {topic}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Article Reading and Summarization */}
      {selectedArticle && (
        <div className="space-y-6">
          {/* Article Content */}
          <div className="rounded-lg border-2 border-gray-300">
            <button
              onClick={() => setShowArticle(!showArticle)}
              className="flex w-full items-center justify-between rounded-t-lg bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedArticle.title}
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  ({selectedArticle.wordCount} words)
                </span>
              </h3>
              <span className="text-2xl">{showArticle ? '−' : '+'}</span>
            </button>
            {showArticle && (
              <div className="max-h-96 overflow-y-auto border-t-2 border-gray-200 p-6 text-gray-900 dark:border-gray-700 dark:text-gray-100">
                <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                  {selectedArticle.content}
                </div>
              </div>
            )}
          </div>

          {/* Summary Input */}
          <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-6">
            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Write Your Summary:{' '}
              {categoryInfo[selectedArticle.category]?.name ||
                modernTechInfo[selectedArticle.id]?.name ||
                'Technology Summary'}
            </h3>
            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-800 dark:text-gray-300">
                Required features to cover:
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-400">
                {(
                  categoryInfo[selectedArticle.category]?.features ||
                  modernTechInfo[selectedArticle.id]?.features ||
                  []
                ).map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <textarea
              value={summaries[selectedArticle.id] || ''}
              onChange={(e) => handleSummaryChange(selectedArticle.id, e.target.value)}
              placeholder="Write your summary here (max 200 words)..."
              className="h-48 w-full resize-none rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-400">
                Word count: {summaries[selectedArticle.id]?.trim().split(/\s+/).length || 0} / 200
              </span>
              <button
                onClick={evaluateSummary}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Evaluate Summary
              </button>
            </div>
          </div>

          {/* Evaluation Results */}
          {evaluationResult && (
            <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Evaluation Results
              </h3>
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-white p-4 dark:bg-gray-700">
                  <div className="mb-1 text-sm text-gray-700 dark:text-gray-400">Completeness</div>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(evaluationResult.completenessScore)}`}
                  >
                    {evaluationResult.completenessScore.toFixed(0)}%
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-700">
                  <div className="mb-1 text-sm text-gray-700 dark:text-gray-400">Accuracy</div>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(evaluationResult.accuracyScore)}`}
                  >
                    {evaluationResult.accuracyScore.toFixed(0)}%
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-700">
                  <div className="mb-1 text-sm text-gray-700 dark:text-gray-400">Word Count</div>
                  <div
                    className={`text-2xl font-bold ${evaluationResult.totalWordCount <= 200 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {evaluationResult.totalWordCount}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 dark:bg-gray-700">
                  <div className="mb-1 text-sm text-gray-700 dark:text-gray-400">Overall Score</div>
                  <div
                    className={`text-2xl font-bold ${getScoreColor(evaluationResult.overallScore)}`}
                  >
                    {evaluationResult.overallScore.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Features Coverage */}
              <div className="mb-4">
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  Features Covered:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(
                    categoryInfo[selectedArticle.category]?.features ||
                    modernTechInfo[selectedArticle.id]?.features ||
                    []
                  ).map((feature) => {
                    const covered = evaluationResult.sections[0].features.includes(feature);
                    return (
                      <span
                        key={feature}
                        className={`rounded-full px-3 py-1 text-sm ${
                          covered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {covered ? '✓' : '✗'} {feature}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Feedback:</h4>
                <ul className="space-y-1">
                  {evaluationResult.feedback.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!selectedArticle && (
        <div className="mt-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            How to Use This Tool:
          </h3>
          <ol className="list-inside list-decimal space-y-2 text-gray-800 dark:text-gray-300">
            <li>Select an article from the available options above</li>
            <li>Read the article carefully (expand to view full content)</li>
            <li>Write a summary covering all required features for that technology</li>
            <li>Keep your summary under 200 words for maximum effectiveness</li>
            <li>Click &quot;Evaluate Summary&quot; to see your scores and feedback</li>
            <li>Review feedback and revise your summary to improve your score</li>
          </ol>
          <div className="mt-4 border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Scoring:</strong> Your summary is evaluated on completeness (coverage of
              required features), accuracy (technical correctness), and conciseness (word count
              within limit). Aim for 90%+ overall score!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologySummarizer;
