import React, { useState, useEffect } from 'react';
import BibleReader from './BibleReader';
import WorksheetHero from './WorksheetHero';

export default function IntegratedWorkspace({ lang }) {
  const [selectedStudyId, setSelectedStudyId] = useState('shoftim');
  const [activeSection, setActiveSection] = useState('parasha');

  useEffect(() => {
    // Listen to worksheet step scroll/focus events to recommend section context without overwriting manual state
    const handleStepContext = (e) => {
      const step = e.detail?.step;
      if (!step) return;
      if (step === 6) setActiveSection('haftara');
      else if (step === 11) setActiveSection('gospel');
      else if (step >= 2 && step <= 5) setActiveSection('parasha');
    };

    window.addEventListener('worksheet-step-focus', handleStepContext);
    return () => window.removeEventListener('worksheet-step-focus', handleStepContext);
  }, []);

  return (
    <div className="workspace-container">
      <WorksheetHero
        lang={lang}
        selectedStudyId={selectedStudyId}
        onStudyChange={(id) => setSelectedStudyId(id)}
      />

      {/* Workspace Split Grid */}
      <div className="workspace-grid">
        <div className="workspace-left">
          <BibleReader
            studyId={selectedStudyId}
            initialSection={activeSection}
            lang={lang}
            onSectionChange={(sec) => setActiveSection(sec)}
          />
        </div>
        <div className="workspace-right">
          {/* Static HTML #werkblad is rendered here in the DOM */}
        </div>
      </div>
    </div>
  );
}
