import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PenTool, Library, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState('');
  const [asOf, setAsOf] = useState(new Date().toISOString().split('T')[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [finalMarkdown, setFinalMarkdown] = useState<string>('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setStatus('started');
    setError(null);
    setCurrentNode(null);
    setFinalMarkdown('');

    try {
      // Connect to the FastAPI backend SSE endpoint
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, as_of: asOf }),
      });

      if (!response.body) throw new Error('ReadableStream not yet supported in this browser.');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        // The SSE stream chunks are separated by double newlines.
        const events = chunk.split('\n\n');
        
        for (const event of events) {
          if (!event.trim()) continue;
          
          let eventType = 'message';
          let dataStr = '';
          
          const lines = event.split('\n');
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.replace('event: ', '').trim();
            } else if (line.startsWith('data: ')) {
              dataStr += line.replace('data: ', '').trim();
            }
          }
          
          if (!dataStr) continue;
          const dataObj = JSON.parse(dataStr);
          
          if (eventType === 'start') {
            setStatus('running');
          } else if (eventType === 'update') {
            setCurrentNode(dataObj.node);
            // If the reducer node triggers, it might have the final MD compiled early
            if (dataObj.payload?.final) {
               setFinalMarkdown(dataObj.payload.final);
            }
            if (dataObj.payload?.merged_md && !dataObj.payload?.final) {
               setFinalMarkdown(dataObj.payload.merged_md);
            }
          } else if (eventType === 'done') {
            setStatus('completed');
            setIsGenerating(false);
          } else if (eventType === 'error') {
            throw new Error(dataObj.error);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setIsGenerating(false);
      setStatus('error');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Blog Writing Agent</h1>
        <p>Premium Agentic Blog Generation powered by Gemini 1.5</p>
      </header>

      <main className="layout-grid">
        {/* Left Sidebar Form */}
        <section className="glass-panel">
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>What should the blog be about?</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={5}
                placeholder="E.g., A comprehensive guide on the architecture of Vision Transformers..."
                required
              />
            </div>
            
            <div className="form-group">
              <label>Data cutoff date (As-of)</label>
              <input 
                type="date" 
                value={asOf}
                onChange={(e) => setAsOf(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary" disabled={isGenerating || !topic.trim()}>
              {isGenerating ? (
                <><Loader2 className="animate-pulse" size={20} /> Generating...</>
              ) : (
                <><PenTool size={20} /> Generate Blog Post</>
              )}
            </button>
          </form>

          {/* Progress Tracker below form */}
          {status && (
            <div className="tracker-container" style={{ marginTop: '2rem' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Workflow Status</div>
              {status === 'error' ? (
                <span className="status-badge error"><AlertCircle size={16} /> Error Generating Blog</span>
              ) : status === 'completed' ? (
                <span className="status-badge done"><CheckCircle2 size={16} /> Completed Successfully</span>
              ) : (
                <span className="status-badge"><Loader2 size={16} className="animate-pulse" /> Running Agentic Graph...</span>
              )}
              
              {currentNode && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  Current Node: <strong style={{ color: 'var(--accent-color)' }}>{currentNode}</strong>
                </div>
              )}
              
              {error && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderRadius: '8px', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right Main Viewer */}
        <section className="glass-panel">
          {finalMarkdown ? (
            <div className="markdown-body">
              <ReactMarkdown>{finalMarkdown}</ReactMarkdown>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px', color: 'var(--text-secondary)', opacity: 0.6 }}>
              <Library size={64} style={{ marginBottom: '1rem' }} />
              <h3>Your blog post will appear here</h3>
              <p>Enter a topic and start generation.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
