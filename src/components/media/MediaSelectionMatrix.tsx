import { useState, useMemo, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  TrendingUp,
  Wifi,
  Cable,
  Radio,
  DollarSign,
  Gauge,
  Eye,
  Box,
} from 'lucide-react';
import { MEDIA_OPTIONS, SCENARIOS, calculateMediaScore } from './media-data';
import type { ConnectorType } from './media-types';

// Lazy load 3D viewer for performance
const Connector3DViewer = lazy(() => import('./Connector3DViewer'));

export default function MediaSelectionMatrix() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const [show3DPreview, setShow3DPreview] = useState(false);
  const [previewConnector, setPreviewConnector] = useState<string | null>(null);

  const currentScenario = SCENARIOS[currentScenarioIndex];

  // Calculate scores for all media options
  const mediaScores = useMemo(() => {
    return MEDIA_OPTIONS.map((media) => calculateMediaScore(media, currentScenario));
  }, [currentScenario]);

  const handleMediaSelect = (mediaId: string) => {
    setSelectedMedia(mediaId);
    setShowResults(false);
  };

  const handleSubmit = () => {
    if (selectedMedia) {
      setShowResults(true);
      setCompletedScenarios((prev) => new Set([...prev, currentScenario.id]));
    }
  };

  const handleNextScenario = () => {
    setCurrentScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
    setSelectedMedia(null);
    setShowResults(false);
  };

  const handlePreviousScenario = () => {
    setCurrentScenarioIndex((prev) => (prev - 1 + SCENARIOS.length) % SCENARIOS.length);
    setSelectedMedia(null);
    setShowResults(false);
  };

  const selectedScore = selectedMedia ? mediaScores.find((s) => s.mediaId === selectedMedia) : null;

  const selectedMediaOption = selectedMedia
    ? MEDIA_OPTIONS.find((m) => m.id === selectedMedia)
    : null;

  const getScoreColor = (score: number) => {
    if (score === 100) {
      return 'text-green-600';
    }
    if (score === 70) {
      return 'text-yellow-600';
    }
    if (score === 40) {
      return 'text-orange-600';
    }
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score === 100) {
      return <Badge className="bg-green-600">Optimal</Badge>;
    }
    if (score === 70) {
      return <Badge className="bg-yellow-600">Acceptable</Badge>;
    }
    if (score === 40) {
      return <Badge className="bg-orange-600">Works</Badge>;
    }
    return <Badge className="bg-red-600">Won&apos;t Work</Badge>;
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'wireless':
        return <Wifi className="h-4 w-4" />;
      case 'fiber':
        return <Radio className="h-4 w-4" />;
      case 'copper':
      case 'coaxial':
        return <Cable className="h-4 w-4" />;
      default:
        return <Cable className="h-4 w-4" />;
    }
  };

  const completionPercentage = (completedScenarios.size / SCENARIOS.length) * 100;

  const getConnectorTypeForMedia = (mediaId: string): ConnectorType | null => {
    const media = MEDIA_OPTIONS.find((m) => m.id === mediaId);
    if (!media) {
      return null;
    }

    switch (media.type) {
      case 'fiber':
        return 'LC'; // Default fiber connector
      case 'copper':
        return 'RJ45';
      case 'coaxial':
        return 'F-type';
      default:
        return null;
    }
  };

  const handleToggle3DPreview = () => {
    setShow3DPreview(!show3DPreview);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Media Selection Matrix</CardTitle>
              <CardDescription>
                Select the optimal transmission media for each scenario
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-2xl font-bold">
                {completedScenarios.size} / {SCENARIOS.length}
              </div>
              <Progress value={completionPercentage} className="mt-2 w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Scenario Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl">
                Scenario {currentScenarioIndex + 1}: {currentScenario.title}
              </CardTitle>
              <CardDescription className="mt-2">{currentScenario.description}</CardDescription>
            </div>
            {completedScenarios.has(currentScenario.id) && (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                Required Distance
              </div>
              <div className="text-2xl font-bold">{currentScenario.requiredDistance}m</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Gauge className="h-4 w-4" />
                Bandwidth Needs
              </div>
              <div className="text-2xl font-bold">{currentScenario.requiredBandwidth} Mbps</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Environment</div>
              <Badge variant="outline" className="text-sm">
                {currentScenario.environment}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                Budget
              </div>
              <div className="text-2xl font-bold">${currentScenario.budgetPerMeter}/m</div>
            </div>
          </div>

          {currentScenario.specialConditions && (
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Info className="h-4 w-4" />
                Special Conditions
              </div>
              <ul className="list-inside list-disc space-y-1">
                {currentScenario.specialConditions.map((condition, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Selection Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Transmission Media</CardTitle>
              <CardDescription>
                Choose the most appropriate media type for this scenario
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleToggle3DPreview}>
              <Box className="mr-2 h-4 w-4" />
              {show3DPreview ? 'Hide' : 'Show'} 3D Preview
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHead>Media Type</TableHead>
                  <TableHead>Max Distance</TableHead>
                  <TableHead>Bandwidth</TableHead>
                  <TableHead>Cost/m</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Select</TableHead>
                </TableRow>
              </TableHead>
              <TableBody>
                {MEDIA_OPTIONS.map((media) => {
                  const isSelected = selectedMedia === media.id;

                  return (
                    <TableRow
                      key={media.id}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleMediaSelect(media.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMediaIcon(media.type)}
                          <div>
                            <div className="font-medium">{media.name}</div>
                            {media.standard && (
                              <div className="text-xs text-gray-500">{media.standard}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{media.maxDistance}m</TableCell>
                      <TableCell>{media.bandwidth} Mbps</TableCell>
                      <TableCell>
                        {media.costPerMeter === 0 ? 'N/A' : `$${media.costPerMeter.toFixed(2)}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {media.environmentalResistance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => handleMediaSelect(media.id)}
                            className="h-4 w-4"
                            aria-label={`Select ${media.name}`}
                          />
                          {(media.type === 'fiber' ||
                            media.type === 'copper' ||
                            media.type === 'coaxial') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewConnector(media.id);
                                setShow3DPreview(true);
                              }}
                              aria-label={`Preview ${media.name} connector in 3D`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* 3D Preview Panel */}
          {show3DPreview && previewConnector && (
            <div className="mt-6 rounded-lg border bg-gray-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">3D Connector Preview</h3>
                <Button variant="ghost" size="sm" onClick={() => setShow3DPreview(false)}>
                  Close
                </Button>
              </div>
              <Suspense
                fallback={
                  <div className="flex h-64 items-center justify-center rounded bg-gray-100">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
                      <p className="text-gray-600">Loading 3D model...</p>
                    </div>
                  </div>
                }
              >
                {(() => {
                  const connectorType = getConnectorTypeForMedia(previewConnector);
                  return connectorType ? (
                    <Connector3DViewer
                      connectorType={connectorType}
                      autoRotate
                      showLabels={true}
                      height="400px"
                    />
                  ) : null;
                })()}
              </Suspense>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" onClick={handlePreviousScenario}>
              Previous Scenario
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedMedia}>
              Submit Answer
            </Button>
            <Button variant="outline" onClick={handleNextScenario}>
              Next Scenario
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {showResults && selectedScore && selectedMediaOption && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>Assessment Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Score Display */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div>
                  <div className="text-sm text-gray-500">Your Selection</div>
                  <div className="text-xl font-bold">{selectedMediaOption.name}</div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(selectedScore.score)}`}>
                    {selectedScore.score}
                  </div>
                  {getScoreBadge(selectedScore.score)}
                </div>
              </div>

              {/* Detailed Assessment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {selectedScore.distanceMatch ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm">Distance Requirement</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedScore.bandwidthMatch ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm">Bandwidth Requirement</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedScore.environmentMatch ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className="text-sm">Environmental Suitability</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedScore.budgetMatch ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className="text-sm">Budget Constraint</span>
                </div>
              </div>

              {/* Reasoning */}
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="mb-2 font-medium">Assessment Reasoning:</div>
                <p className="text-sm text-gray-700">{selectedScore.reasoning}</p>
              </div>

              {/* Optimal Solution */}
              {selectedScore.score < 100 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-2 font-medium text-green-800">Optimal Solutions:</div>
                  <div className="space-y-2">
                    {mediaScores
                      .filter((s) => s.score === 100)
                      .map((s) => {
                        const media = MEDIA_OPTIONS.find((m) => m.id === s.mediaId);
                        return media ? (
                          <div key={s.mediaId} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">{media.name}</span>
                          </div>
                        ) : null;
                      })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
