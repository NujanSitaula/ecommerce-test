'use client';

interface BaselShopSortBarProps {
  lang: string;
  itemsCount: number;
  sort?: string;
  onSortChange?: (value: string) => void;
}

export default function BaselShopSortBar({
  itemsCount,
  sort,
  onSortChange,
}: BaselShopSortBarProps) {
  return (
    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
      <div className="text-muted small">{itemsCount} items</div>
      <div className="d-flex align-items-center gap-2">
        <span
          className="small text-muted text-uppercase"
          style={{ whiteSpace: 'nowrap' }}
        >
          Sort by
        </span>
        <select
          className="form-select form-select-sm"
          value={sort ?? ''}
          onChange={(e) => onSortChange?.(e.target.value)}
          aria-label="Sort products"
        >
          <option value="">Recommended</option>
          <option value="lowest">Price: Low to High</option>
          <option value="highest">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

