import { useCallback, useEffect, useRef, useState } from 'react';
import { DEVIATION_ROWS, SUGGESTED_PROMPTS } from '@/data/chat';
import { prefersReducedMotion, scrollBehavior } from '@/lib/motion';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { Delta } from '@/components/common/Delta';
import { Table, uniformColumns } from '@/components/common/Table';
import type { ScreenMeta } from '@/routing/screens';

export const chatMeta: ScreenMeta = {
  section: null,
  page: 'AI analyst',
  width: 788,
  chatSidebar: true,
  bottom: true,
};

const REPLY_DELAY_MS = prefersReducedMotion ? 0 : 1100;

const DEVIATION_COLUMNS = uniformColumns(['SKU', 'Δ%']);

type Appended =
  | { readonly id: number; readonly type: 'user'; readonly text: string; readonly time: string }
  | { readonly id: number; readonly type: 'typing' }
  | { readonly id: number; readonly type: 'bot' };

const timestamp = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

function SeededAnswer() {
  const rows = DEVIATION_ROWS.map((row) => ({
    key: row.sku,
    cells: [{ content: row.sku }, { content: <Delta value={row.delta} /> }],
  }));

  return (
    <div className="msg-row bot">
      <div className="msg bot">
        <p>
          For the Aug 05–11 cycle, the largest deviation is <strong>iPad Air 11 256GB</strong>: the
          recommendation is 7% below the current price, driven by a seasonal demand dip and price
          cut from Competitor B.
        </p>
        <Table
          columns={DEVIATION_COLUMNS}
          rows={rows}
          compact
          rowStaggerMs={60}
          baseDelayMs={300}
        />
        <div className="chat-actions">
          <ToastButton className="btn" message="Excel export started">
            <Icon name="microsoft-excel-logo" /> Export to Excel
          </ToastButton>
          <ToastButton className="btn" message="Chart opened">
            <Icon name="chart-line" /> Show as chart
          </ToastButton>
          <ToastButton className="btn" message="PDF export started">
            <Icon name="file-pdf" /> Export to PDF
          </ToastButton>
        </div>
        <div className="msg-src">Source: Pricing Data Platform, cycle Aug 05–11</div>
      </div>
    </div>
  );
}

export function ChatScreen() {
  const [appended, setAppended] = useState<readonly Appended[]>([]);
  const [draft, setDraft] = useState('');
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);
  const lastRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  useEffect(() => {
    if (!appended.length) return;
    lastRowRef.current?.scrollIntoView({ block: 'end', behavior: scrollBehavior });
  }, [appended]);

  const send = useCallback((text: string) => {
    const userId = nextId.current++;
    const typingId = nextId.current++;
    setAppended((current) => [
      ...current,
      { id: userId, type: 'user', text, time: timestamp() },
      { id: typingId, type: 'typing' },
    ]);

    const timer = window.setTimeout(() => {
      setAppended((current) =>
        current.map((entry) => (entry.id === typingId ? { id: typingId, type: 'bot' } : entry)),
      );
    }, REPLY_DELAY_MS);
    timers.current.push(timer);
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    send(text);
  };

  return (
    <>
      <div className="thread">
        <div className="msg-row user">
          <div className="msg user">
            <div>Show me the SKUs with the largest deviation from the recommendation this week</div>
            <div className="msg-time tnum">10:42 AM</div>
          </div>
        </div>
        <SeededAnswer />
        {appended.map((entry, index) => {
          const ref = index === appended.length - 1 ? lastRowRef : undefined;
          if (entry.type === 'user') {
            return (
              <div key={entry.id} className="msg-row user" ref={ref}>
                <div className="msg user">
                  <div>{entry.text}</div>
                  <div className="msg-time tnum">{entry.time}</div>
                </div>
              </div>
            );
          }
          if (entry.type === 'typing') {
            return (
              <div key={entry.id} className="msg-row bot" ref={ref}>
                <div className="msg bot">
                  <span className="typing">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            );
          }
          return (
            <div key={entry.id} className="msg-row bot" ref={ref}>
              <div className="msg bot">
                <p>
                  Pulling that from the pricing data platform for cycle Aug 05–11. The strongest
                  signal is competitor movement in Smartphones, which drove 46% of this week&apos;s
                  recommendations.
                </p>
                <div className="msg-src">
                  Source: Pricing Data Platform · generated from indexed cycle data
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="prompt-row">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button key={prompt} type="button" className="btn" onClick={() => send(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <form className="composer" onSubmit={onSubmit}>
        <input
          className="input grow"
          placeholder="Ask a question about a SKU or category"
          aria-label="Message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="send-btn" type="submit" aria-label="Send">
          <Icon name="paper-plane-tilt" />
        </button>
      </form>
    </>
  );
}
