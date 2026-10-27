import React, { useEffect, useState } from 'react';
import { Play, RefreshCw, LoaderCircle } from 'lucide-react';
import { startResearchAnalysis, getResearchJob, getSimilarProjects, getProjectComparisons } from '../../services/projectsApi';
import { Btn, Card, Notice } from '../../components/ui';

export default function ResearchAnalysisPanel({ project }) {
  const [job, setJob] = useState(null);
  const [results, setResults] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const backendId = project?.backendId;

  async function loadResults() {
    if (!backendId) return;
    const [items, comparisonItems] = await Promise.all([
      getSimilarProjects(backendId),
      getProjectComparisons(backendId),
    ]);
    setResults(Array.isArray(items) ? items : []);
    setComparisons(Array.isArray(comparisonItems) ? comparisonItems : []);
  }

  async function runResearch() {
    setError('');
    setBusy(true);
    try {
      const created = await startResearchAnalysis(backendId);
      setJob(created);
    } catch (err) {
      setError(err.message || 'Could not start research.');
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!job?.job_id && !job?.id) return undefined;
    const jobId = job.job_id || job.id;
    let cancelled = false;
    let timer;
    async function poll() {
      try {
        const current = await getResearchJob(jobId);
        if (cancelled) return;
        setJob(current);
        const status = String(current.status || '').toLowerCase();
        if (status === 'completed' || status === 'completed_with_errors') {
          setBusy(false);
          try {
            await loadResults();
          } catch (err) {
            setError(err.message || 'Research finished, but results could not be loaded.');
            return;
          }
          if (status === 'completed_with_errors') {
            const logErrors = Array.isArray(current.log)
              ? current.log.filter((entry) => entry.level === 'error').map((entry) => entry.message)
              : [];
            setError(
              logErrors[0]
                ? 'Research finished with partial results: ' + logErrors[0]
                : 'Research finished with some errors. Available partial results are shown below.'
            );
          }
          return;
        }
        if (status === 'failed') {
          setBusy(false);
          setError(current.error || 'The research job failed. Check backend logs and configuration.');
          return;
        }
        timer = setTimeout(poll, 2500);
      } catch (err) {
        if (cancelled) return;
        setBusy(false);
        setError(err.message || 'Could not check research status.');
      }
    }
    timer = setTimeout(poll, 700);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [job?.job_id, job?.id]);

  useEffect(() => {
    if (backendId) loadResults().catch(() => {});
  }, [backendId]);

  return (
    <Card title="Research Analysis" eyebrow="Live backend research">
      <p className="small muted">Run the backend research job, monitor its status, then review similar projects collected for this case. Search results are evidence leads, not proof that an idea is original.</p>
      {!backendId && <Notice tone="warn">This saved workspace project is not linked to a backend project. Create a new project to enable live Research Analysis.</Notice>}
      {job?.status && <div className="small mt8">Job status: <strong>{job.status}</strong>{job.error ? ` — ${job.error}` : ''}</div>}
      {error && <Notice tone="warn">{error}</Notice>}
      <div className="mt8">
        <Btn variant="primary" size="sm" onClick={runResearch} disabled={!backendId || busy}>
          {busy ? <LoaderCircle size={14} /> : <Play size={14} />}
          {busy ? 'Research running…' : 'Run Research Analysis'}
        </Btn>
        <Btn variant="ghost" size="sm" onClick={() => loadResults().catch((err) => setError(err.message))} disabled={!backendId}>
          <RefreshCw size={14} /> Refresh results
        </Btn>
      </div>
      <div className="line" />
      <div className="spread"><strong className="small">Similar projects</strong><span className="mono xs muted">{results.length} found</span></div>
      {results.length ? (
        <div className="stack-sm mt8">
          {results.slice(0, 5).map((item) => (
            <div className="card card-tight" key={item.id || item.source_url}>
              <div className="strong small">{item.name || 'Untitled project'}</div>
              {item.description && <p className="small muted mt8 mb0">{item.description}</p>}
              <div className="spread mt8">
                <span className="xs muted">{item.excerpt_verified ? 'Excerpt verified' : 'Excerpt not verified'}</span>
                {item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer" className="xs">Open source ↗</a>}
              </div>
            </div>
          ))}
        </div>
      ) : <p className="small muted mb0 mt8">No similar-project records loaded yet. Run research or refresh after a job completes.</p>}
      <div className="line" />
      <div className="spread"><strong className="small">Research comparisons</strong><span className="mono xs muted">{comparisons.length} available</span></div>
      {comparisons.length ? (
        <div className="stack-sm mt8">
          {comparisons.slice(0, 5).map((item, index) => (
            <div className="card card-tight" key={item.id || index}>
              {item.explanation && <p className="small mb0">{item.explanation}</p>}
              {Array.isArray(item.possible_gaps) && item.possible_gaps.length > 0 && (
                <div className="mt8"><div className="eyebrow plain">Possible gaps to investigate</div><ul className="small">{item.possible_gaps.map((gap, i) => <li key={i}>{typeof gap === 'string' ? gap : JSON.stringify(gap)}</li>)}</ul></div>
              )}
            </div>
          ))}
        </div>
      ) : <p className="small muted mb0 mt8">No comparison records available yet. These may appear after the research run finishes.</p>}
    </Card>
  );
}
