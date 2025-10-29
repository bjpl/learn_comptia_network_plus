# Accessibility Guide - CompTIA Network+ Learning Platform

## Table of Contents
1. [Accessibility Commitment](#accessibility-commitment)
2. [Keyboard Navigation](#keyboard-navigation)
3. [Screen Reader Support](#screen-reader-support)
4. [Visual Accessibility](#visual-accessibility)
5. [Hearing Accessibility](#hearing-accessibility)
6. [Cognitive Accessibility](#cognitive-accessibility)
7. [Motor/Mobility Accessibility](#motormobility-accessibility)
8. [Assistive Technology Compatibility](#assistive-technology-compatibility)
9. [Requesting Accommodations](#requesting-accommodations)
10. [Feedback and Support](#feedback-and-support)

---

## Accessibility Commitment

The CompTIA Network+ Learning Platform is committed to providing an inclusive learning experience for all users, regardless of ability. We strive to meet or exceed:

- **WCAG 2.1 Level AA** standards
- **Section 508** compliance
- **ADA** requirements

Our ongoing commitment includes:
- Regular accessibility audits
- User feedback integration
- Continuous improvement
- Partnership with accessibility experts

---

## Keyboard Navigation

### Essential Keyboard Shortcuts

#### Global Navigation
| Action | Shortcut | Description |
|--------|----------|-------------|
| Skip to main content | `Alt + 1` | Bypass navigation menu |
| Dashboard | `Alt + D` | Go to dashboard |
| Components | `Alt + C` | Access components list |
| Search | `Alt + S` or `/` | Focus search bar |
| Help | `Alt + H` | Open help menu |
| Settings | `Alt + ,` | Open settings |
| Logout | `Alt + L` | Log out of account |

#### Navigation Within Pages
| Action | Shortcut | Description |
|--------|----------|-------------|
| Next section | `Tab` | Move to next interactive element |
| Previous section | `Shift + Tab` | Move to previous element |
| Next heading | `N` | Jump to next heading (with screen reader) |
| Previous heading | `Shift + N` | Jump to previous heading |
| Next link | `L` | Jump to next link (with screen reader) |
| Open link | `Enter` | Activate focused link |

#### Component Interaction
| Action | Shortcut | Description |
|--------|----------|-------------|
| Play/Pause video | `Space` or `K` | Toggle video playback |
| Mute/Unmute | `M` | Toggle audio |
| Fullscreen | `F` | Toggle fullscreen video |
| Volume up | `↑` | Increase volume 10% |
| Volume down | `↓` | Decrease volume 10% |
| Forward 5 sec | `→` | Skip ahead in video |
| Backward 5 sec | `←` | Go back in video |
| Start quiz | `Alt + Q` | Begin quiz section |
| Submit answer | `Enter` | Submit current quiz answer |
| Next question | `Alt + N` | Move to next quiz question |
| Previous question | `Alt + P` | Return to previous question |

#### Interactive Labs
| Action | Shortcut | Description |
|--------|----------|-------------|
| Select tool | `Number keys (1-9)` | Choose lab tool |
| Undo | `Ctrl + Z` | Undo last action |
| Redo | `Ctrl + Y` | Redo action |
| Save progress | `Ctrl + S` | Save lab state |
| Reset lab | `Ctrl + R` | Reset to beginning |
| Help overlay | `?` | Show lab keyboard shortcuts |

### Keyboard-Only Navigation Tips

**Navigation Flow**:
1. Use `Tab` to move through interactive elements in logical order
2. Use `Shift + Tab` to move backward
3. Use `Enter` or `Space` to activate buttons, links, checkboxes
4. Use `Arrow keys` for dropdowns, radio buttons, sliders
5. Use `Esc` to close modals, dropdowns, menus

**Focus Indicators**:
- All focusable elements have **visible focus outlines** (blue border by default)
- Can customize focus indicator color in Settings → Accessibility
- High-contrast focus mode available

**Keyboard Navigation Best Practices**:
- Logical tab order follows visual layout (left-to-right, top-to-bottom)
- No keyboard traps—can always `Tab` or `Esc` out of elements
- Skip links allow bypassing repetitive content
- All functionality accessible without mouse

---

## Screen Reader Support

### Supported Screen Readers

**Fully Tested and Compatible**:
- **JAWS** (Windows) - versions 2020 and newer
- **NVDA** (Windows) - versions 2020 and newer
- **VoiceOver** (macOS/iOS) - built-in, latest versions
- **TalkBack** (Android) - latest versions
- **Narrator** (Windows) - Windows 10/11 built-in

### Screen Reader Modes

**Browse Mode** (Default):
- Navigate page structure (headings, landmarks, links)
- Use screen reader-specific shortcuts
- Read content linearly

**Focus Mode** (Forms/Interactions):
- Interact with form fields, buttons, controls
- Typically activated automatically when entering form
- Can toggle manually (usually `Insert + Space` in JAWS/NVDA)

### Landmark Regions

The platform uses semantic HTML5 landmark regions for easy navigation:

**Main Landmarks**:
- `<banner>` - Site header and logo
- `<navigation>` - Main navigation menu
- `<main>` - Primary content area
- `<complementary>` - Sidebar content
- `<contentinfo>` - Footer information
- `<search>` - Search functionality

**Screen Reader Navigation**:
- JAWS: `R` for regions, `Shift + R` for previous
- NVDA: `D` for landmarks, `Shift + D` for previous
- VoiceOver: `Control + Option + U` → select Landmarks

### Headings Structure

**Proper Heading Hierarchy**:
- `<h1>` - Page title (one per page)
- `<h2>` - Major sections
- `<h3>` - Subsections
- `<h4>` - Sub-subsections
- Never skip heading levels

**Screen Reader Navigation**:
- JAWS/NVDA: `H` for next heading, `Shift + H` for previous
- Number keys (1-6) for heading levels (e.g., `2` for all h2 headings)
- VoiceOver: `Control + Option + Command + H` for next heading

### Alternative Text for Images

**All Meaningful Images Include**:
- Descriptive `alt` text
- Context about purpose/function
- Decorative images marked with `alt=""` (skipped by screen readers)

**Complex Images** (diagrams, charts):
- Detailed text descriptions provided
- `longdesc` attribute links to full description
- Accessible data tables for chart data

**Example Alt Text**:
- **Good**: "OSI Model diagram showing 7 layers from Physical (bottom) to Application (top)"
- **Poor**: "Diagram" or "OSI Model"

### Form Accessibility

**All Form Inputs Have**:
- Properly associated `<label>` elements
- Descriptive labels (not "Click here")
- Required fields marked with `aria-required="true"`
- Error messages announced immediately
- Instructions provided before form, not within

**Form Error Handling**:
- Errors announced by screen reader
- Focus moved to first error
- Clear, specific error messages
- Visual and programmatic association

### Dynamic Content

**ARIA Live Regions**:
- Updates announced automatically
- `aria-live="polite"` - Announces after current task
- `aria-live="assertive"` - Announces immediately (sparingly used)
- Quiz feedback, progress updates, loading states all announced

**Loading States**:
- `aria-busy="true"` during loading
- Status messages like "Loading component..."
- Clear indication when content ready

### Interactive Elements

**Buttons and Controls**:
- Descriptive labels (not generic "Submit")
- Current state announced (pressed, expanded, selected)
- Tooltips and help text accessible

**Expandable Sections**:
- State announced (expanded/collapsed)
- `aria-expanded` attribute used
- Controlled via keyboard

**Tabs**:
- Tab list role and structure
- Arrow keys to navigate between tabs
- `Enter` or `Space` to activate
- Selected tab indicated (`aria-selected="true"`)

### Video and Media Accessibility

**All Videos Include**:
- **Captions** (closed captions, user-controllable)
- **Transcripts** (full text available)
- **Audio descriptions** (for complex visual content)
- Keyboard-accessible controls

**Caption Quality**:
- Accurate text matching audio
- Speaker identification when relevant
- Sound effects noted [music playing], [bell rings]
- Synchronized timing

---

## Visual Accessibility

### Color and Contrast

**WCAG 2.1 Level AA Compliant**:
- Text contrast minimum: 4.5:1 (normal text)
- Large text contrast minimum: 3:1 (18pt+ or 14pt+ bold)
- UI component contrast: 3:1

**High Contrast Mode**:
- Enable in Settings → Accessibility → High Contrast
- Increases contrast to 7:1 or higher
- Dark text on light background or vice versa

**Color Independence**:
- Information never conveyed by color alone
- Icons, labels, patterns used in addition to color
- Example: Success (green checkmark + "Correct")
- Example: Error (red X + "Incorrect")

### Text Customization

**Font Size Adjustment**:
- Settings → Accessibility → Text Size
- Options: Small, Medium (default), Large, Extra Large, Largest
- Text scales up to 200% without horizontal scrolling
- No loss of content or functionality

**Font Family Options**:
- Default: Open Sans (high legibility)
- Dyslexia-Friendly: OpenDyslexic font
- Serif: Georgia
- Sans-Serif: Arial
- Monospace: Courier (for code)

**Line Spacing and Width**:
- Adjustable line height (1.2x to 2.0x)
- Adjustable paragraph spacing
- Maximum line width: 80 characters (optimal readability)

### Color Blind Support

**Color Blindness Modes**:
Settings → Accessibility → Color Blindness Filters

Available filters:
- **Protanopia** (red-blind) - 1% of males
- **Deuteranopia** (green-blind) - 1% of males
- **Tritanopia** (blue-blind) - rare
- **Monochromacy** (total color blindness) - very rare

**Design Considerations**:
- Never use red/green alone for pass/fail
- Patterns, icons, text labels always included
- Color palettes tested with simulators
- Network diagrams use shapes AND colors

### Visual Focus Indicators

**Focus Styles**:
- Default: 3px blue outline
- High contrast: 4px high-contrast color
- Custom: Choose your own color in settings

**Focus Order**:
- Logical, predictable order
- Follows visual layout
- No unexpected jumps

### Reduced Motion

**For Vestibular Disorders, Motion Sensitivity**:

Settings → Accessibility → Reduce Motion

When enabled:
- Animations slowed or removed
- Parallax effects disabled
- Auto-playing videos stopped
- Smooth scrolling reduced
- Transitions simplified

**Respects System Preferences**:
- Automatically detects `prefers-reduced-motion` CSS media query
- Honors operating system settings

### Zoom and Magnification

**Browser Zoom**:
- Supports up to 400% zoom (WCAG AAA)
- Layout remains functional
- No horizontal scrolling needed
- Text reflows appropriately

**Screen Magnifier Compatibility**:
- Tested with ZoomText, MAGic, Windows Magnifier
- Proper focus management
- Magnified content doesn't hide important info

---

## Hearing Accessibility

### Captions

**All Video Content Includes**:
- **Closed Captions** (can be toggled on/off)
- Accurate, synchronized text
- Speaker identification
- Sound effect descriptions

**Caption Customization**:
Settings → Accessibility → Caption Preferences
- Font size (Small, Medium, Large)
- Font family (Sans-serif, Serif, Monospace)
- Text color
- Background color and opacity
- Edge style (None, Drop shadow, Raised, Depressed)

### Transcripts

**Video Transcripts**:
- Full text transcript for every video
- Accessible via "Transcript" button below video
- Includes timestamps
- Searchable text
- Downloadable (TXT or PDF format)

**Audio-Only Content**:
- Transcripts provided for any audio-only resources
- Descriptions of non-verbal sounds
- Speaker identification

### Visual Alternatives to Audio

**No Audio-Only Content**:
- All important information has visual equivalent
- Audio instructions also shown as text
- Alerts have visual indicators
- Progress updates shown visually

**Quiz and Lab Instructions**:
- Written instructions always available
- Visual diagrams supplement audio explanations
- Text-based hints and feedback

---

## Cognitive Accessibility

### Clear Language and Structure

**Plain Language**:
- Technical terms explained on first use
- Glossary available for jargon
- Sentence structure: simple and direct
- Reading level: appropriate for adult learners

**Consistent Navigation**:
- Same menu structure throughout
- Predictable button locations
- Consistent terminology
- Clear page titles

### Focus and Attention Support

**Minimize Distractions**:
Settings → Accessibility → Focus Mode

When enabled:
- Removes sidebar content
- Hides notifications
- Disables animations
- Presents content in simplified layout

**Chunking Content**:
- Information broken into manageable sections
- White space between sections
- Clear headings separate topics
- "Bite-sized" learning modules

### Memory and Comprehension Aids

**Progress Tracking**:
- Visual progress bars
- Completed sections marked with checkmarks
- Breadcrumbs show location in course
- "Resume where you left off" feature

**Built-in Note-Taking**:
- Note tool on every component
- Notes saved automatically
- Search your notes
- Export notes for review

**Glossary and Quick Reference**:
- Hover over terms for definitions
- Glossary accessible from any page
- Flashcards for memorization
- Cheat sheets for quick reference

### Time and Pacing Control

**No Time Limits** (Except Simulated Exams):
- Study at your own pace
- Quizzes not timed
- Videos pauseable anytime
- Progress saved automatically

**Practice Exam Timing**:
- Can pause practice exams (real exam simulation optional)
- Extra time can be enabled in settings
- Timer displayed clearly
- Warnings before time expires

**Spaced Repetition**:
- Automatic review scheduling
- Notifications for optimal review times
- Respects your learning pace

---

## Motor/Mobility Accessibility

### Mouse-Free Operation

**Fully Keyboard Accessible**:
- Every feature accessible via keyboard
- See [Keyboard Navigation](#keyboard-navigation) section
- No mouse-only functions

### Large Click Targets

**Touch/Click Target Size**:
- Minimum 44x44 pixels (WCAG 2.1 Level AAA)
- Adequate spacing between targets
- No precision clicking required

### Reduce Repetitive Actions

**Efficiency Features**:
- Keyboard shortcuts for common actions
- "Mark all as read" bulk actions
- Auto-save (no repeated saving)
- Default selections for common choices

### Voice Control Compatibility

**Tested With**:
- Dragon NaturallySpeaking (Windows)
- Voice Control (macOS)
- Voice Access (Android)

**Voice-Friendly Design**:
- Descriptive button labels (for voice commands)
- No hover-only menus
- Confirmations for destructive actions

### Switch Access

**Compatible With**:
- Switch devices
- Single-switch scanning
- Two-switch operation

**Requirements**:
- All interactive elements reachable
- Adequate selection time
- Undo functionality available

---

## Assistive Technology Compatibility

### Screen Readers
- JAWS 2020+
- NVDA 2020+
- VoiceOver (macOS/iOS)
- TalkBack (Android)
- Narrator (Windows 10/11)

### Screen Magnifiers
- ZoomText
- MAGic
- Windows Magnifier
- macOS Zoom

### Voice Control
- Dragon NaturallySpeaking
- Voice Control (Apple)
- Voice Access (Android)

### Reading Tools
- Read&Write
- Learning Ally
- Bookshare

### Browser Extensions
- Read Aloud
- Mercury Reader
- Dark Reader
- BeeLine Reader

### Operating System Features
- Windows Accessibility Features
- macOS Accessibility Features
- iOS Accessibility Features
- Android Accessibility Features

---

## Requesting Accommodations

### CompTIA Exam Accommodations

**For the actual Network+ certification exam**, accommodations must be requested through CompTIA/Pearson VUE:

**Available Accommodations**:
- Extended testing time
- Separate testing room
- Screen reader compatible exam
- Large font exam
- Additional breaks
- Reader/scribe
- Sign language interpreter

**How to Request**:
1. Visit CompTIA's Exam Accommodations page
2. Complete Accommodations Request Form
3. Provide supporting documentation
4. Submit at least 15 business days before exam
5. CompTIA will review and approve/deny
6. Pearson VUE will be notified

**Documentation Required**:
- Verification of disability from qualified professional
- Description of how disability impacts testing
- History of accommodations in other settings
- Specific accommodation requests

**Contact**:
- Email: accommodations@comptia.org
- Phone: 1-866-835-8020

### Platform-Specific Accommodations

**Already Built-In**:
Most accommodations available in Settings → Accessibility (no request needed):
- Extended time on practice exams
- Font size and style adjustments
- Color customization
- Reduced motion
- High contrast modes
- Caption preferences

**Additional Accommodations**:
If you need accommodations not available in settings:

1. Email: accessibility@networkplus-learn.com
2. Describe your need
3. Explain how current platform doesn't meet need
4. Suggest solution if possible

**Examples of Custom Accommodations**:
- Alternative assessment formats
- Modified content delivery
- Extended subscription for extended timeline
- One-on-one support sessions

**We will work with you** to provide reasonable accommodations to ensure equal access.

---

## Feedback and Support

### Report Accessibility Issues

**Found an accessibility barrier?** Please let us know!

**How to Report**:
- Email: accessibility@networkplus-learn.com
- Use "Report Accessibility Issue" form (Help menu)
- Describe the barrier and your assistive technology
- Include screenshots if possible

**We aim to respond within 3 business days.**

### Accessibility Feedback

**Help us improve!** We welcome feedback on:
- Features that work well
- Features that could be improved
- Missing accommodations
- New assistive technology support
- General accessibility suggestions

### Accessibility Support

**Need help using accessibility features?**

- Email: accessibility@networkplus-learn.com
- Live chat: Available Mon-Fri, 9 AM - 5 PM EST
- Phone: 1-800-NET-PLUS (638-7587)
- Community forum: Accessibility category

**Resources**:
- Accessibility Quick Start Guide (Settings → Accessibility → Guide)
- Video tutorials (with captions and transcripts)
- One-on-one setup assistance available

---

## Accessibility Roadmap

**Current** (Available Now):
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- Caption and transcripts
- Text customization
- High contrast mode

**In Progress** (Coming Soon):
- WCAG 2.2 compliance
- Sign language interpretation for videos
- Additional language support
- Enhanced cognitive accessibility tools
- Improved voice control compatibility

**Future** (Under Consideration):
- WCAG 2.2 Level AAA features
- AI-powered personalization for disabilities
- Braille display support
- Alternative input methods
- Multimodal content delivery

**Your input shapes our roadmap!** Please share your needs and priorities.

---

## Legal and Standards

**Compliance**:
- Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
- Section 508 of the Rehabilitation Act
- Americans with Disabilities Act (ADA)
- European Accessibility Act (EAA)
- EN 301 549 (European standard)

**Audits**:
- Annual third-party accessibility audit
- Continuous automated testing
- User testing with disabled users
- Regular screen reader compatibility checks

**Accessibility Statement**:
Full accessibility conformance report available at:
networkplus-learn.com/accessibility-statement

---

## Additional Resources

**External Resources**:
- WebAIM (Web Accessibility In Mind): webaim.org
- W3C Accessibility Guidelines: w3.org/WAI
- Microsoft Accessibility: microsoft.com/accessibility
- Apple Accessibility: apple.com/accessibility
- Google Accessibility: google.com/accessibility

**Assistive Technology Resources**:
- Freedom Scientific (JAWS): freedomscientific.com
- NV Access (NVDA): nvaccess.org
- AFB (American Foundation for the Blind): afb.org

**CompTIA Resources**:
- Exam Accommodations: comptia.org/testing/test-accommodations
- Accessibility Information: comptia.org/accessibility

---

**Our Commitment**: We are dedicated to ensuring that all learners can access and benefit from our platform. Accessibility is not an afterthought—it's integrated into every aspect of our design and development process.

**Questions?** Contact us at accessibility@networkplus-learn.com

**Next Steps**:
- [Customize your accessibility settings](user-guide.md#settings)
- [Learn keyboard shortcuts](#keyboard-navigation)
- [Set up your assistive technology](#assistive-technology-compatibility)
