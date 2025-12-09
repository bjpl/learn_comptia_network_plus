import React, { useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TRANSCEIVERS } from '../media-data';
import { generateUseCases } from './constants/data';
import { useTransceiverMatch } from './hooks/useTransceiverMatch';
import { EncyclopediaTab } from './components/EncyclopediaTab';
import { BiDiWDMTab } from './components/BiDiWDMTab';
import { MatchingGameTab } from './components/MatchingGameTab';
import { TroubleshootingTab } from './components/TroubleshootingTab';
import { ExamPrepTab } from './components/ExamPrepTab';

export default function TransceiverMatch() {
  const useCases = useMemo(() => generateUseCases(), []);

  const {
    matches,
    submitted,
    score,
    correctMatches,
    completedMatches,
    progressPercentage,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleRemoveMatch,
    handleSubmit,
    handleReset,
  } = useTransceiverMatch(useCases, TRANSCEIVERS);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="encyclopedia" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="encyclopedia">Encyclopedia</TabsTrigger>
          <TabsTrigger value="bidi-wdm">BiDi & WDM</TabsTrigger>
          <TabsTrigger value="matching">Matching Game</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="exam-prep">Exam Prep</TabsTrigger>
        </TabsList>

        <EncyclopediaTab />
        <BiDiWDMTab />
        <MatchingGameTab
          useCases={useCases}
          transceivers={TRANSCEIVERS}
          matches={matches}
          correctMatches={correctMatches}
          submitted={submitted}
          score={score}
          completedMatches={completedMatches}
          progressPercentage={progressPercentage}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onRemoveMatch={handleRemoveMatch}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
        <TroubleshootingTab />
        <ExamPrepTab />
      </Tabs>
    </div>
  );
}
