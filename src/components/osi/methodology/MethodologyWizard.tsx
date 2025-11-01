/**
 * CompTIA Network+ 7-Step Troubleshooting Methodology Wizard
 * Guides students through the official troubleshooting process
 */

import React, { useState } from 'react';
import type { TroubleshootingScenario } from '../osi-types';

export interface MethodologyStep {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  description: string;
  completed: boolean;
  userInput: string;
  checklist?: string[];
  checklistCompleted?: boolean[];
}

interface MethodologyWizardProps {
  scenario: TroubleshootingScenario;
  onComplete: (steps: MethodologyStep[]) => void;
  onCancel?: () => void;
}

const METHODOLOGY_STEPS: Omit<MethodologyStep, 'completed' | 'userInput'>[] = [
  {
    stepNumber: 1,
    title: 'Identify the Problem',
    description:
      'Gather information, duplicate the problem if possible, question users, identify symptoms, determine if anything has changed',
    checklist: [
      'Gathered information from user/ticket',
      'Identified affected systems/users',
      'Documented symptoms',
      'Checked for recent changes',
      'Attempted to duplicate the problem',
    ],
  },
  {
    stepNumber: 2,
    title: 'Establish a Theory of Probable Cause',
    description:
      'Question the obvious, consider multiple approaches (top-down, bottom-up, divide and conquer)',
    checklist: [
      'Considered obvious causes first',
      'Chose troubleshooting approach (top-down, bottom-up, or divide & conquer)',
      'Formulated theory based on symptoms',
      'Identified which OSI layer is likely affected',
    ],
  },
  {
    stepNumber: 3,
    title: 'Test the Theory to Determine Cause',
    description: 'Run diagnostic tools to confirm or reject your theory',
    checklist: [
      'Selected appropriate diagnostic tools',
      'Executed commands and analyzed output',
      'Gathered evidence supporting or rejecting theory',
      'Confirmed root cause or established new theory',
    ],
  },
  {
    stepNumber: 4,
    title: 'Establish a Plan of Action',
    description: 'Identify potential effects and plan remediation steps',
    checklist: [
      'Identified solution steps',
      'Considered impact on users/systems',
      'Determined if escalation is needed',
      'Obtained approvals if necessary',
    ],
  },
  {
    stepNumber: 5,
    title: 'Implement the Solution or Escalate',
    description: 'Execute the fix or escalate if beyond your scope',
    checklist: [
      'Implemented solution',
      'OR escalated to appropriate team',
      'Documented actions taken',
      'Monitored initial results',
    ],
  },
  {
    stepNumber: 6,
    title: 'Verify Full System Functionality',
    description: 'Confirm resolution and implement preventive measures',
    checklist: [
      'Verified issue is resolved',
      'Tested affected systems',
      'Confirmed users can work normally',
      'Implemented preventive measures',
    ],
  },
  {
    stepNumber: 7,
    title: 'Document Findings, Actions, and Outcomes',
    description: 'Record symptoms, theory, tests, solution for future reference',
    checklist: [
      'Documented symptoms and timeline',
      'Recorded diagnostic steps taken',
      'Documented solution implemented',
      'Created knowledge base entry',
    ],
  },
];

export const MethodologyWizard: React.FC<MethodologyWizardProps> = ({
  scenario,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [steps, setSteps] = useState<MethodologyStep[]>(
    METHODOLOGY_STEPS.map((step) => ({
      ...step,
      completed: false,
      userInput: '',
      checklistCompleted: step.checklist?.map(() => false) ?? [],
    }))
  );

  const handleInputChange = (stepNum: number, value: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.stepNumber === stepNum ? { ...step, userInput: value } : step))
    );
  };

  const handleChecklistToggle = (stepNum: number, checkIndex: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.stepNumber === stepNum && step.checklistCompleted
          ? {
              ...step,
              checklistCompleted: step.checklistCompleted.map((checked, i) =>
                i === checkIndex ? !checked : checked
              ),
            }
          : step
      )
    );
  };

  const canProceed = () => {
    const current = steps[currentStep - 1];
    const hasInput = current.userInput.length >= 20; // Minimum input requirement
    const checklistDone = current.checklistCompleted?.every(Boolean) ?? true;
    return hasInput && checklistDone;
  };

  const handleNext = () => {
    const updatedSteps = steps.map((step) =>
      step.stepNumber === currentStep ? { ...step, completed: true } : step
    );
    setSteps(updatedSteps);

    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(updatedSteps);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepData = steps[currentStep - 1];
  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#2196F3',
          color: 'white',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '20px' }}>
          CompTIA Network+ Troubleshooting Methodology
        </h3>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
          Follow the 7-step process to systematically diagnose network issues
        </p>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Step {currentStep} of 7</span>
          <span style={{ fontSize: '14px', color: '#666' }}>{completedCount} completed</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '4px',
            height: '6px',
            backgroundColor: '#e0e0e0',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div
              key={num}
              style={{
                flex: 1,
                backgroundColor:
                  num < currentStep ? '#4CAF50' : num === currentStep ? '#2196F3' : '#e0e0e0',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </div>

        {/* Step indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '12px',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div
              key={num}
              onClick={() => num < currentStep && setCurrentStep(num)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: num < currentStep ? 'pointer' : 'default',
                opacity: num > currentStep ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor:
                    num < currentStep ? '#4CAF50' : num === currentStep ? '#2196F3' : '#ccc',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}
              >
                {num < currentStep ? '✓' : num}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  textAlign: 'center',
                  maxWidth: '60px',
                  lineHeight: '1.2',
                }}
              >
                {METHODOLOGY_STEPS[num - 1].title.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div
        style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#2196F3' }}>
            Step {currentStep}: {currentStepData.title}
          </h2>

          <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
            {currentStepData.description}
          </p>

          {/* Scenario Context */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              borderRadius: '4px',
              marginTop: '20px',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Scenario: {scenario.title}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>{scenario.description}</div>
          </div>

          {/* Checklist */}
          {currentStepData.checklist && (
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginTop: 0 }}>Checklist:</h4>
              {currentStepData.checklist.map((item, index) => (
                <label
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e8e8e8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <input
                    type="checkbox"
                    checked={currentStepData.checklistCompleted?.[index] ?? false}
                    onChange={() => handleChecklistToggle(currentStep, index)}
                    style={{
                      width: '18px',
                      height: '18px',
                      marginRight: '12px',
                      cursor: 'pointer',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '14px',
                      textDecoration: currentStepData.checklistCompleted?.[index]
                        ? 'line-through'
                        : 'none',
                      color: currentStepData.checklistCompleted?.[index] ? '#888' : '#000',
                    }}
                  >
                    {item}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* User Input */}
          <div style={{ marginTop: '24px' }}>
            <label
              htmlFor={`step-${currentStep}-input`}
              style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '8px',
                fontSize: '15px',
              }}
            >
              Your Response (minimum 20 characters):
            </label>
            <textarea
              id={`step-${currentStep}-input`}
              value={currentStepData.userInput}
              onChange={(e) => handleInputChange(currentStep, e.target.value)}
              placeholder={`Document your findings, thoughts, and actions for ${currentStepData.title}...`}
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div
              style={{
                marginTop: '6px',
                fontSize: '12px',
                color: currentStepData.userInput.length >= 20 ? '#4CAF50' : '#666',
              }}
            >
              {currentStepData.userInput.length} characters
              {currentStepData.userInput.length >= 20 && ' ✓'}
            </div>
          </div>

          {/* Tips for current step */}
          <details style={{ marginTop: '20px' }}>
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#2196F3',
                padding: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
              }}
            >
              💡 Tips for this step
            </summary>
            <div
              style={{
                marginTop: '8px',
                padding: '12px',
                backgroundColor: '#e3f2fd',
                borderRadius: '4px',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            >
              {getTipsForStep(currentStep)}
            </div>
          </details>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          padding: '20px',
          borderTop: '1px solid #ddd',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              padding: '10px 20px',
              backgroundColor: currentStep === 1 ? '#ccc' : '#fff',
              color: currentStep === 1 ? '#888' : '#2196F3',
              border: '2px solid #2196F3',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Previous
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                backgroundColor: '#fff',
                color: '#666',
                border: '2px solid #ccc',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed()}
          style={{
            padding: '10px 24px',
            backgroundColor: !canProceed() ? '#ccc' : currentStep === 7 ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: !canProceed() ? 'not-allowed' : 'pointer',
          }}
        >
          {currentStep === 7 ? 'Complete ✓' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

function getTipsForStep(stepNum: number): React.ReactNode {
  const tips: Record<number, React.ReactNode> = {
    1: (
      <>
        • Start by reading the scenario carefully and identifying all symptoms
        <br />
        • Note what IS working and what ISN'T working
        <br />
        • Ask yourself: When did this start? What changed? Who is affected?
        <br />• Document everything before proceeding
      </>
    ),
    2: (
      <>
        • Top-Down: Start at Layer 7, work down (good when application issues suspected)
        <br />
        • Bottom-Up: Start at Layer 1, work up (good for physical/connection issues)
        <br />
        • Divide & Conquer: Start at Layer 3/4 (good when layer is unclear)
        <br />• Question the obvious: Is it powered on? Plugged in? Simple fixes first!
      </>
    ),
    3: (
      <>
        • Use diagnostic tools to gather evidence (ping, traceroute, nslookup, etc.)
        <br />
        • Analyze command outputs carefully - they tell the story
        <br />
        • If theory is confirmed, proceed to solution
        <br />• If theory is rejected, go back to Step 2 with new theory
      </>
    ),
    4: (
      <>
        • Consider the impact: Will this affect other users? Cause downtime?
        <br />
        • Plan for rollback: What if the solution doesn't work?
        <br />
        • Get approvals: Notify stakeholders before making changes
        <br />• Have a timeline: When will you implement? How long will it take?
      </>
    ),
    5: (
      <>
        • Follow your plan from Step 4
        <br />
        • Document each action as you take it
        <br />
        • If beyond your skill level, escalate to appropriate team
        <br />• Monitor closely during implementation
      </>
    ),
    6: (
      <>
        • Test thoroughly: Does it work for all affected users?
        <br />
        • Verify functionality: Not just "working" but working correctly
        <br />
        • Implement preventive measures: How can we prevent recurrence?
        <br />• Get user confirmation: Have users verify the fix
      </>
    ),
    7: (
      <>
        • Document symptoms, diagnostics, root cause, and solution
        <br />
        • Include timestamps, commands used, and results
        <br />
        • Create knowledge base entry for future reference
        <br />• Help others: Your documentation helps the next person
      </>
    ),
  };

  return tips[stepNum] || 'Follow the methodology systematically.';
}

export default MethodologyWizard;
