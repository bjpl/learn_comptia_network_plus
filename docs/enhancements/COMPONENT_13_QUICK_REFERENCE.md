# Component 13: Decision Tree - Quick Reference

## At a Glance

**Component:** Network Device Decision Tree
**Location:** `src/components/appliances/DecisionTree.tsx`
**Lines:** 491 (under 600 limit)
**Status:** Production-ready

## What It Does

Interactive decision tree that guides users through questions to recommend appropriate network devices, then allows device comparison and exam scenario practice.

## Key Features Checklist

- [x] Question-based device selection (binary yes/no)
- [x] Visual tree navigation (progress bar + breadcrumb)
- [x] Device recommendations with detailed reasoning
- [x] Compare similar devices (cost, performance, specs)
- [x] Exam scenarios for practice (3 real-world situations)
- [x] All under 600 lines
- [x] Fully documented

## Component Structure

```
DecisionTree (main)
├── QuestionView         (display yes/no question)
├── RecommendationView   (show results)
│   └── DeviceCard       (individual device cards)
├── ComparisonView       (side-by-side table)
└── ExamScenarioView     (practice scenarios)
```

## How to Use

### Import

```typescript
import DecisionTree from '@/components/appliances/DecisionTree';
```

### Basic Usage

```tsx
<DecisionTree />
```

### With Callbacks

```tsx
<DecisionTree
  onRecommendation={(deviceIds) => {
    console.log('Selected:', deviceIds);
  }}
/>
```

## User Journey

```
Start
  ↓
Question 1: Virtualization available?
  ├─ Yes → Budget constraints?
  │   ├─ Yes → Performance critical?
  │   │   ├─ Yes → Hybrid Approach
  │   │   └─ No → Virtual Appliances
  │   └─ No → High-end Physical
  └─ No → Cloud deployment planned?
      ├─ Yes → Cloud-Native
      └─ No → PoE needed?
          ├─ Yes → Physical with PoE
          └─ No → Budget Option
```

## Data Integration

### Decision Tree Map

- **File:** `appliances-data.ts`
- **Type:** `Map<string, DecisionNode>`
- **Key:** Node ID (e.g., 'start', 'budget-check')
- **Value:** Question or recommendation data

### Device Database

- **File:** `appliances-data.ts`
- **Array:** `networkDevices[]`
- **Count:** 8 devices
- **Fields:** Specs, pricing, features, use cases

## State Management

```typescript
// Current position in tree
currentNodeId: string

// Breadcrumb for navigation
history: string[]

// Comparison view
showComparison: boolean
comparisonData: { devices, comparison }

// Exam scenarios
showExamScenario: boolean
examIndex: number
```

## Available Actions

| Action          | Method                   | Effect                           |
| --------------- | ------------------------ | -------------------------------- |
| Answer Question | `handleAnswer(yes/no)`   | Progress tree, show next node    |
| Go Back         | `handleGoBack()`         | Previous question, change answer |
| Start Over      | `handleReset()`          | Return to initial state          |
| Compare         | `handleCompareDevices()` | Show comparison view             |
| View Exams      | N/A                      | Toggle exam scenario view        |

## Styling

### Color Scheme

- **Questions:** Blue gradient
- **Recommendations:** Green gradient
- **Comparison:** Yellow gradient
- **Exams:** Purple gradient

### Responsive

- Max width: 4xl (56rem)
- 2-column grid on md+ screens
- Mobile-friendly layout

## Example Scenarios

### Scenario 1: Branch Connectivity

- Question: Small branch office needs HQ connection
- Answer: Cisco ISR 4331
- Why: Purpose-built for branch connectivity

### Scenario 2: Budget Firewall

- Question: Tight budget, need security, have virtualization
- Answer: pfSense Virtual
- Why: Zero hardware cost, enterprise features

### Scenario 3: Campus Network

- Question: High-density PoE for campus deployment
- Answer: Cisco Catalyst 9300
- Why: 48+ PoE ports, enterprise reliability

## Performance Features

- **useMemo:** Optimized device list calculation
- **useCallback:** Memoized event handlers
- **React.Fragment:** Efficient list rendering
- **Conditional rendering:** Only show active views

## Type Safety

All components have full TypeScript interfaces:

- `DecisionTreeProps`
- `ComparisonData`
- `QuestionViewProps`
- `RecommendationViewProps`
- `DeviceCardProps`
- `ComparisonViewProps`
- `ExamScenarioViewProps`

## Accessibility

- Semantic HTML structure
- WCAG color contrast compliance
- Clear button states
- Descriptive text labels
- Keyboard navigation ready

## Testing Paths

### Path 1: Virtual Route

1. Start → Yes (virtualization)
2. → No (budget < $10K)
3. → No (< 5 Gbps needed)
4. → Result: Virtual Appliances

### Path 2: Physical PoE Route

1. Start → No (no virtualization)
2. → No (no cloud)
3. → Yes (PoE needed)
4. → Result: Physical with PoE

### Path 3: Cloud Route

1. Start → No (no virtualization)
2. → Yes (cloud planned)
3. → Result: Cloud-Native

## Devices Included

1. **Cisco ISR 4331** - Physical router for branches
2. **pfSense Virtual** - Open-source firewall VM
3. **FortiGate 100F** - SMB firewall appliance
4. **Cisco Catalyst 9300** - Enterprise switch
5. **F5 BIG-IP VE** - Virtual load balancer
6. **Palo Alto VM-Series** - Advanced threat firewall
7. **UniFi Dream Machine Pro** - All-in-one SMB
8. **AWS Transit Gateway** - Cloud router service

## Key Metrics

| Metric           | Value            |
| ---------------- | ---------------- |
| File Size        | 491 lines        |
| Components       | 5 (main + 4 sub) |
| Decision Nodes   | 10+              |
| Recommendations  | 4 paths          |
| Devices          | 8 models         |
| Exam Scenarios   | 3                |
| Color Variations | 4                |

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- ES2020 JavaScript
- React 18.0+
- Tailwind CSS 3.0+

## Integration Points

- **Parent Components:** Can receive `onRecommendation` callback
- **Child Components:** Uses `appliances-data.ts` and `appliances-types.ts`
- **State Management:** Self-contained, no external store needed
- **API Calls:** None (all data is static)

## Common Customizations

### Add New Device

1. Add to `networkDevices[]` in `appliances-data.ts`
2. Reference in decision tree nodes by ID
3. Device auto-appears in recommendations

### Add New Scenario

1. Add to `examScenarios` array in component
2. Provide title, description, answer ID, reasoning
3. Automatically included in scenario rotation

### Change Colors

1. Modify gradient classes in view components
2. Example: `from-blue-50 to-indigo-50`
3. Options: blue, green, yellow, purple, etc.

### Adjust Decision Path

1. Edit nodes in `decisionTreeData` Map
2. Update `yesPath` and `noPath` references
3. Ensure all nodes are valid IDs

## Maintenance Checklist

- [ ] Update device specs annually
- [ ] Review and add new exam scenarios
- [ ] Test all decision paths
- [ ] Verify links and references
- [ ] Check for broken device IDs
- [ ] Review pricing information
- [ ] Ensure color contrast compliance
- [ ] Test on mobile devices

## Documentation

- **Main Docs:** `docs/enhancements/COMPONENT_13_DECISION_TREE.md`
- **Code Comments:** Inline in component
- **Type Definitions:** `appliances-types.ts`

## Troubleshooting

**Issue:** Recommendation not showing

- Check: Device ID exists in `networkDevices`
- Check: Decision node has `devices` array

**Issue:** Comparison shows empty

- Check: At least 2 devices in recommendation
- Check: Device IDs are valid

**Issue:** Styling looks wrong

- Check: Tailwind CSS is loaded
- Check: No CSS conflicts
- Check: Browser supports CSS Grid

**Issue:** Exam scenario missing device

- Check: Device ID in scenario matches actual device
- Check: Device exists in `networkDevices`

## Future Ideas

- Export recommendation as PDF
- Save/share decision paths
- Advanced filtering by features
- Real-time cost calculator
- Network design tool integration
- Learning analytics tracking
- Multi-language support
- Dark mode styling

## Support & Questions

Refer to main documentation:

- `docs/enhancements/COMPONENT_13_DECISION_TREE.md`

Check related components:

- `ComparisonMatrix.tsx`
- `ExamQuestions.tsx`
- `OSILayerFilter.tsx`

---

**Last Updated:** 2025-11-01
**Version:** 1.0
**Status:** Production Ready
