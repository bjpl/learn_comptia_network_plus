/**
 * Exam Questions Data
 * CompTIA Network+ exam questions for topology learning
 */

import type { TopologyDefinition } from '../../topologies-types';
import type { ExamQuestion } from '../types';

/**
 * Generate exam questions based on selected topologies
 */
export const generateExamQuestions = (selectedTopologyData: TopologyDefinition[]): ExamQuestion[] => {
  const questions: ExamQuestion[] = [];

  selectedTopologyData.forEach((topology) => {
    if (topology.id === 'star') {
      questions.push({
        id: 'star-1',
        difficulty: 'easy',
        question: 'In a star topology, what happens when the central hub fails?',
        options: [
          'Only devices connected to that hub are affected',
          'The entire network becomes disconnected',
          'Other hubs in the network are unaffected',
          'Traffic automatically reroutes through backup links',
        ],
        correctAnswer: 1,
        explanation:
          'Star topologies have a single point of failure. When the central device fails, all nodes lose connectivity.',
        topologyType: 'star',
      });
    } else if (topology.id === 'mesh') {
      questions.push({
        id: 'mesh-1',
        difficulty: 'hard',
        question: 'How many cables are required for a full mesh topology with 6 nodes?',
        options: ['5', '6', '15', '30'],
        correctAnswer: 2,
        explanation:
          'Full mesh uses formula n(n-1)/2 = 6(5)/2 = 15 cables for direct connections between all nodes.',
        topologyType: 'mesh',
      });
    }
  });

  return questions;
};
