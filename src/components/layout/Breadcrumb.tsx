import { Icon } from '@/components/common/Icon';

export interface BreadcrumbProps {
  readonly section: string | null;
  readonly page: string;
}

export function Breadcrumb({ section, page }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {section && (
        <>
          <span className="crumb-section">{section}</span>
          <span className="crumb-sep">
            <Icon name="caret-right" />
          </span>
        </>
      )}
      <span className="crumb-page">{page}</span>
    </nav>
  );
}
