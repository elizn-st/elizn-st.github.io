import { useEffect, useMemo, useRef, useState } from 'react';
import { cx } from '@/lib/cx';
import { filterSearchIndex, type SearchEntry } from '@/data/search';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useOverlays } from '@/state/OverlayContext';
import { useRouter } from '@/routing/RouterContext';
import { Icon } from '@/components/common/Icon';

const FOCUS_DELAY_MS = 40;

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useOverlays();
  const { navigate } = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const groups = useMemo(() => filterSearchIndex(query), [query]);
  const flat = useMemo<readonly SearchEntry[]>(
    () => groups.flatMap((group) => group.entries),
    [groups],
  );

  useBodyScrollLock(searchOpen);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  // A new result set always starts on its first row.
  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    if (!searchOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!flat.length) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % flat.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + flat.length) % flat.length);
      } else if (event.key === 'Enter') {
        const entry = flat[activeIndex];
        if (entry) {
          closeSearch();
          navigate(entry.route);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, flat, activeIndex, closeSearch, navigate]);

  useEffect(() => {
    const active = resultsRef.current?.querySelector('.sr-item.is-active');
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const openEntry = (entry: SearchEntry) => {
    closeSearch();
    navigate(entry.route);
  };

  let cursor = -1;

  return (
    <div
      className={cx('search-overlay', searchOpen && 'is-open')}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeSearch();
      }}
    >
      <div className="sr-panel" role="dialog" aria-label="Search">
        <div className="sr-field">
          <Icon name="magnifying-glass" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search SKUs, dashboards or actions"
            aria-label="Search"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd className="sr-kbd">Esc</kbd>
        </div>

        <div className="sr-results" ref={resultsRef}>
          {groups.length === 0 ? (
            <div className="sr-empty">
              <Icon name="magnifying-glass" />
              <p>Nothing matches “{query}”</p>
              <span>Try a SKU code, a category or a dashboard name</span>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="sr-group">
                <div className="sr-label">{group.label}</div>
                {group.entries.map((entry) => {
                  cursor += 1;
                  const index = cursor;
                  return (
                    <button
                      key={`${group.label}-${entry.label}`}
                      type="button"
                      className={cx('sr-item', index === activeIndex && 'is-active')}
                      onClick={() => openEntry(entry)}
                    >
                      <span className="sr-icon">
                        <Icon name={entry.icon} />
                      </span>
                      <span className="grow">
                        <span className="sr-title">{entry.label}</span>
                        <span className="sr-meta">{entry.meta}</span>
                      </span>
                      <span className="sr-enter">
                        <Icon name="arrow-elbow-down-left" />
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="sr-foot">
          <span>
            <kbd className="sr-kbd">↑</kbd>
            <kbd className="sr-kbd">↓</kbd> navigate
          </span>
          <span>
            <kbd className="sr-kbd">↵</kbd> open
          </span>
          <span className="grow" />
          <span className="tnum">Indexed 2,500 SKUs</span>
        </div>
      </div>
    </div>
  );
}
