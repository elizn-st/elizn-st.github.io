import { useCallback, useEffect, useRef, useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { prefersReducedMotion, scrollBehavior } from '@/lib/motion';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { Delta } from '@/components/common/Delta';
import { Table, uniformColumns } from '@/components/common/Table';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export const chatMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'chat'),
  width: 788,
  chatSidebar: true,
  bottom: true,
});

const REPLY_DELAY_MS = prefersReducedMotion ? 0 : 1100;

type Appended =
  | { readonly id: number; readonly type: 'user'; readonly text: string; readonly time: string }
  | { readonly id: number; readonly type: 'typing' }
  | { readonly id: number; readonly type: 'bot' };

const timestamp = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

function SeededAnswer() {
  const { chat } = usePortalData();
  const copy = chat.copy;
  const rows = chat.deviationRows.map((row) => ({
    key: row.sku,
    cells: [{ content: row.sku }, { content: <Delta value={row.delta} /> }],
  }));

  return (
    <div className="msg-row bot">
      <div className="msg bot">
        <p>
          {copy.answerIntro} <strong>{copy.answerEmphasis}</strong>
          {copy.answerRest}
        </p>
        <Table
          columns={uniformColumns(copy.deviationColumns)}
          rows={rows}
          compact
          rowStaggerMs={60}
          baseDelayMs={300}
        />
        <div className="chat-actions">
          {copy.answerActions.map((action) => (
            <ToastButton key={action.label} className="btn" message={action.message}>
              <Icon name={action.icon} /> {action.label}
            </ToastButton>
          ))}
        </div>
        <div className="msg-src">{copy.answerSource}</div>
      </div>
    </div>
  );
}

export function ChatScreen() {
  const { chat } = usePortalData();
  const copy = chat.copy;
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
            <div>{copy.question}</div>
            <div className="msg-time tnum">{copy.questionTime}</div>
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
                <p>{copy.replyBody}</p>
                <div className="msg-src">{copy.replySource}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="prompt-row">
        {chat.suggestedPrompts.map((prompt) => (
          <button key={prompt} type="button" className="btn" onClick={() => send(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <form className="composer" onSubmit={onSubmit}>
        <input
          className="input grow"
          placeholder={copy.composerPlaceholder}
          aria-label={copy.composerAriaLabel}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="send-btn" type="submit" aria-label={copy.sendAriaLabel}>
          <Icon name="paper-plane-tilt" />
        </button>
      </form>
    </>
  );
}
