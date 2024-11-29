// components/ColdEmailGenerator.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, RefreshCw, Copy, CheckCircle } from 'lucide-react';

interface GeneratorProps {}

const ColdEmailGenerator: React.FC<GeneratorProps> = () => {
  const [prompt, setPrompt] = useState('');
  const [industry, setIndustry] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const industries = [
    'Software/SaaS',
    'Healthcare',
    'E-commerce',
    'Financial Services',
    'Manufacturing',
    'Real Estate',
    'Education',
    'Marketing/Advertising',
    'Consulting',
    'Other'
  ];

  const generateEmail = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, industry }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setGeneratedEmail(data.content);
    } catch (err) {
      setError('Failed to generate email. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white p-4">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-medium text-gray-900">
            AI Email Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Describe Your Goal
              </label>
              <textarea
                className="w-full p-3 rounded border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 min-h-[120px]"
                placeholder="Example: I want to reach out to CTOs of software companies about their cloud security challenges. We offer an AI-powered solution that reduces security incidents by 40%."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Industry (Optional)
              </label>
              <select
                className="w-full p-2 rounded border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">Select industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={generateEmail}
              disabled={!prompt || isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? 'Crafting your email...' : 'Generate Email'}
            </Button>
          </div>

          {generatedEmail && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Generated Template:</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap text-gray-600">
                {generatedEmail}
              </div>
              <div className="mt-4">
                <Alert className="bg-purple-50 border-purple-200">
                  <AlertDescription className="text-xs text-gray-600">
                    <p className="font-medium mb-1">This email follows cold email best practices:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>No links (add them after getting a reply)</li>
                      <li>Personalization fields for authentic outreach</li>
                      <li>Spintax variations to improve deliverability</li>
                      <li>Clear and specific call-to-action</li>
                      <li>Professional yet conversational tone</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ColdEmailGenerator;
