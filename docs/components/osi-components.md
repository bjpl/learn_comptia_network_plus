# OSI Model Components Documentation

## Overview

This document provides comprehensive documentation for all OSI Model interactive learning components. These components are designed to help students master the OSI 7-layer model concepts needed for CompTIA Network+ certification.

---

## Component 1: Layer Explanation Builder

### Purpose
Interactive tool for building comprehensive explanations of each OSI layer, helping students understand layer functions, protocols, PDUs, and interactions.

### Props Interface

```typescript
interface LayerExplanationBuilderProps {
  onProgressUpdate?: (progress: number) => void;
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onProgressUpdate` | `(progress: number) => void` | No | Callback fired when student completes layers |

### Features

- **7-Layer Interface**: Expandable sections for each OSI layer with color coding
- **Primary Function Selection**: Choose from multiple function descriptions (includes decoys)
- **Protocol Selection**: Multi-select checkboxes for protocols (correct + decoy options)
- **PDU Input**: Text input for Protocol Data Unit names
- **Interaction Explanation**: Long-form text area (150-word minimum) explaining layer interactions
- **Scoring System**:
  - Primary Function: 25%
  - Protocols: 25%
  - PDU: 10%
  - Explanation: 40%
- **Hint System**: Up to 3 hints available (10% penalty per hint)
- **Progress Tracking**: Visual indicators for empty/partial/complete status

### Usage Example

```tsx
import { LayerExplanationBuilder } from '@/components/osi';

function OSILearningPage() {
  const handleProgress = (progress: number) => {
    console.log(`Student completed ${progress}% of layers`);
  };

  return (
    <LayerExplanationBuilder
      onProgressUpdate={handleProgress}
    />
  );
}
```

### Learning Objectives

- Identify the primary function of each OSI layer
- Match protocols to their correct layer
- Name the PDU for each layer
- Explain how layers interact with adjacent layers
- Build mental models of data flow through the stack

### Scoring Rubric

**Layer Completion (per layer, maximum 100 points):**

1. **Primary Function (25 points)**
   - Correct function selected: 25 points
   - Incorrect function: 0 points

2. **Protocol Selection (25 points)**
   - Each correct protocol: +10 points
   - Each incorrect protocol: -5 points
   - Capped at 25 points maximum

3. **PDU Name (10 points)**
   - Exact match (case-insensitive): 10 points
   - Incorrect: 0 points

4. **Layer Interaction Explanation (40 points)**
   - Word count < 150: Partial credit (word_count/150 * 20)
   - Word count >= 150: Full consideration
   - Mentions upper layer: +20 points
   - Mentions lower layer: +20 points
   - Maximum: 40 points

**Hint Penalty:**
- Each hint used: -10% of final score
- Maximum 3 hints available

### Common Issues

**Issue**: Students don't understand why their explanation didn't score well
**Solution**: The scoring algorithm looks for mentions of adjacent layers (e.g., "Layer 3" in a Layer 4 explanation). Encourage students to explicitly describe interactions.

**Issue**: Protocol selection is confusing
**Solution**: Protocols are randomized with decoys. Students should focus on learning which protocols truly belong to each layer rather than memorizing positions.

---

## Component 2: Packet Journey Simulator

### Purpose
Visualizes the encapsulation and decapsulation process as a packet travels through the OSI model, showing header addition/removal and protocol details at each layer.

### Props Interface

```typescript
interface PacketJourneySimulatorProps {
  onComplete?: () => void;
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onComplete` | `() => void` | No | Callback fired when animation completes full cycle |

### Features

- **Animated Visualization**: Step-by-step packet transformation
- **Source and Destination Devices**: Visual representation of packet journey
- **Header Inspection**: Click any layer to view detailed header contents
- **Protocol Selection**: Toggle between TCP and UDP to see differences
- **Speed Control**: 0.5x, 1x, 2x animation speeds
- **Playback Controls**: Play, Pause, Reset
- **14-Step Journey**:
  - Steps 1-7: Encapsulation (Layer 7→1)
  - Steps 8-14: Decapsulation (Layer 1→7)
- **Color-Coded Layers**: Each layer has distinct color for easy tracking
- **Real Protocol Data**: Actual header fields for HTTP, TCP/UDP, IP, Ethernet

### Usage Example

```tsx
import { PacketJourneySimulator } from '@/components/osi';

function PacketVisualizationPage() {
  const handleComplete = () => {
    console.log('Student watched full packet journey');
  };

  return (
    <PacketJourneySimulator
      onComplete={handleComplete}
    />
  );
}
```

### Learning Objectives

- Understand the encapsulation process (adding headers)
- Understand the decapsulation process (removing headers)
- Recognize real header fields for common protocols
- Visualize how data transforms at each layer
- Compare TCP vs UDP header structures

### Header Details by Layer

**Layer 7 (HTTP)**
- Protocol, Method, URI, Version

**Layer 6 (Presentation)**
- Encoding, Compression, Encryption, Format

**Layer 5 (Session)**
- Session ID, State, Dialog, Sync Point

**Layer 4 (TCP/UDP)**
- TCP: Source/Dest Port, Sequence, Ack, Window, Flags
- UDP: Source/Dest Port, Length, Checksum

**Layer 3 (IPv4)**
- Source/Dest IP, TTL, Protocol, Checksum

**Layer 2 (Ethernet)**
- Source/Dest MAC, EtherType, FCS, VLAN

**Layer 1 (Physical)**
- Medium, Signal, Encoding, Bit Rate, Voltage

### Common Issues

**Issue**: Animation is too fast/slow
**Solution**: Use the speed controls (0.5x, 1x, 2x) to adjust to student's learning pace

**Issue**: Students don't understand what they're looking at
**Solution**: Encourage them to pause and inspect individual layers. The inspection panel shows all header fields with clear labels.

---

## Component 3: Troubleshooting Scenarios

### Purpose
Comprehensive scenario-based practice for identifying which OSI layer is responsible for various network problems. Includes 50+ real-world scenarios.

### Props Interface

```typescript
interface TroubleshootingScenariosProps {
  onProgressUpdate?: (correct: number, total: number) => void;
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onProgressUpdate` | `(correct: number, total: number) => void` | No | Callback with correct answers and total attempted |

### Features

- **50+ Scenarios**: Real-world network troubleshooting situations
- **Difficulty Levels**: Easy, Medium, Hard
- **Category Filtering**: Filter by problem type (DNS, Routing, Security, etc.)
- **Three-Part Response**:
  1. Layer Identification (20% of score)
  2. Explanation (50% of score, 100-word minimum)
  3. Solution (30% of score, 50-word minimum)
- **Hints System**: 3 hints per scenario (doesn't affect score here)
- **Progress Tracking**: Visual grid showing completed/correct/incorrect scenarios
- **Detailed Feedback**: See correct answer and explanation after submission
- **Statistics Dashboard**: Tracks attempts, correct answers, average score

### Usage Example

```tsx
import { TroubleshootingScenarios } from '@/components/osi';

function TroubleshootingPracticePage() {
  const handleProgress = (correct: number, total: number) => {
    const percentage = (correct / total) * 100;
    console.log(`${percentage.toFixed(0)}% accuracy`);
  };

  return (
    <TroubleshootingScenarios
      onProgressUpdate={handleProgress}
    />
  );
}
```

### Scenario Categories

- **DNS**: Name resolution issues
- **Routing**: Routing loops, unreachable destinations
- **Security**: Attacks, authentication failures
- **Physical Media**: Cable issues, signal problems
- **Switching**: MAC tables, VLANs, STP
- **Transport**: TCP/UDP issues, retransmissions
- **VPN**: Tunnel establishment, encryption
- **Wireless**: RF interference, CSMA/CA
- **Configuration**: Misconfigurations, parameter errors

### Scoring Rubric

**Per Scenario (Maximum 100 points):**

1. **Layer Identification (20 points)**
   - Correct layer selected: 20 points
   - Incorrect layer: 0 points

2. **Explanation Quality (50 points)**
   - Less than 100 words: Proportional credit (word_count/100 * 25)
   - 100+ words: Scored on concept matching
   - Algorithm compares student explanation with correct explanation
   - Matches key technical terms
   - Maximum: 50 points

3. **Solution Appropriateness (30 points)**
   - Less than 50 words: Proportional credit (word_count/50 * 30)
   - 50+ words: 30 points
   - Maximum: 30 points

### Example Scenarios

**Easy - DNS Issues (ts-01)**
Users can't resolve website names but can access by IP. This tests understanding that DNS is Layer 7 (Application).

**Medium - MAC Address Table (ts-04)**
Switch MAC table overflow attack. Tests understanding of Layer 2 (Data Link) switch operations.

**Hard - SSL/TLS Certificates (ts-06)**
Certificate validation errors. Tests understanding of Layer 6 (Presentation) encryption.

### Learning Objectives

- Apply OSI model knowledge to real-world problems
- Develop troubleshooting methodology
- Distinguish between layer-specific issues
- Practice technical writing and explanation
- Build confidence in network diagnostics

### Common Issues

**Issue**: Students select wrong layer consistently
**Solution**: Remind them to think about what protocol or mechanism is actually failing. DNS = Application, IP routing = Network, MAC addresses = Data Link, etc.

**Issue**: Explanations aren't scoring well
**Solution**: The algorithm looks for technical keywords from the correct explanation. Students should use proper terminology (e.g., "Layer 3", "routing table", "IP address").

---

## Component Integration

### Using All Components Together

```tsx
import {
  LayerExplanationBuilder,
  PacketJourneySimulator,
  TroubleshootingScenarios
} from '@/components/osi';

function OSILearningModule() {
  const [currentPhase, setCurrentPhase] = useState<'learn' | 'visualize' | 'practice'>('learn');
  const [progress, setProgress] = useState({ explained: 0, scenarios: { correct: 0, total: 0 } });

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPhase('learn')}>Learn Layers</button>
        <button onClick={() => setCurrentPhase('visualize')}>Visualize Packets</button>
        <button onClick={() => setCurrentPhase('practice')}>Practice Troubleshooting</button>
      </nav>

      {currentPhase === 'learn' && (
        <LayerExplanationBuilder
          onProgressUpdate={(p) => setProgress(prev => ({ ...prev, explained: p }))}
        />
      )}

      {currentPhase === 'visualize' && (
        <PacketJourneySimulator />
      )}

      {currentPhase === 'practice' && (
        <TroubleshootingScenarios
          onProgressUpdate={(correct, total) =>
            setProgress(prev => ({ ...prev, scenarios: { correct, total } }))
          }
        />
      )}

      <ProgressSummary>
        Layers Explained: {progress.explained}% |
        Scenarios: {progress.scenarios.correct}/{progress.scenarios.total}
      </ProgressSummary>
    </div>
  );
}
```

---

## Type Definitions

### Core Types

```typescript
export type OSILayerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type CompletionStatus = 'empty' | 'partial' | 'complete';

export interface OSILayer {
  number: OSILayerNumber;
  name: string;
  status: CompletionStatus;
  primaryFunction: string;
  selectedProtocols: string[];
  pdu: string;
  interactionExplanation: string;
}

export interface Protocol {
  name: string;
  layer: OSILayerNumber;
  description: string;
}

export interface TroubleshootingScenario {
  id: string;
  title: string;
  description: string;
  correctLayer: OSILayerNumber;
  explanation: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}
```

---

## Best Practices

### For Educators

1. **Sequencing**: Start with Layer Explanation Builder, then Packet Journey, finally Troubleshooting
2. **Pacing**: Allow students to complete all 7 layers before moving to scenarios
3. **Intervention**: Monitor hint usage - high hint usage indicates concept gaps
4. **Assessment**: Use scenario scores as formative assessment data

### For Students

1. **Take Notes**: Write down key protocols and functions for each layer
2. **Use Hints Wisely**: Try to answer first, only use hints when truly stuck
3. **Watch Animations**: Don't skip the packet journey visualization
4. **Read Feedback**: When scenarios are wrong, carefully read the explanation
5. **Practice**: Attempt all 50 scenarios for comprehensive coverage

---

## Accessibility Features

- **Keyboard Navigation**: All components fully keyboard accessible
- **Color Coding**: Consistent color scheme with sufficient contrast
- **Text Alternatives**: All visual elements have text descriptions
- **Responsive Design**: Works on desktop and tablet devices

---

## Performance Considerations

- **Lazy Loading**: Components render only visible layers
- **Debounced Input**: Text areas debounce to prevent excessive re-renders
- **Memoization**: Heavy calculations (scoring) only run on submission
- **State Management**: Local state only, no external dependencies

---

## Future Enhancements

1. **Spaced Repetition**: Track which scenarios students struggle with
2. **Multiplayer Mode**: Compete with classmates on scenario speed/accuracy
3. **Custom Scenarios**: Allow educators to create institution-specific problems
4. **Export Progress**: Download progress reports as PDF/CSV
5. **Mobile App**: Native mobile version for on-the-go study

---

## Support Resources

- **CompTIA Network+ Objectives**: Aligns with exam domains 1.1-1.3
- **RFC References**: Links to relevant RFCs for protocol deep-dives
- **Video Tutorials**: Companion video series (links in user guide)
- **Study Groups**: Connect with other learners (see community forum)
