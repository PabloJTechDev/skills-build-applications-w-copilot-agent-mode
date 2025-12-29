import React, { useEffect, useMemo, useState } from 'react';

function buildActivitiesApiUrl() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/activities/`;
  }
  return 'http://localhost:8000/api/activities/';
}

function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function getColumns(list) {
  const columns = new Set();
  const sample = Array.isArray(list) ? list.slice(0, 20) : [];

  for (const item of sample) {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      for (const key of Object.keys(item)) {
        columns.add(key);
      }
    }
  }

  if (columns.size === 0) {
    return ['value'];
  }

  return Array.from(columns);
}

function formatCell(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function getRowKey(item, index) {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    return item.id ?? item._id ?? index;
  }
  return index;
}

export default function Activities() {
  const endpoint = useMemo(() => buildActivitiesApiUrl(), []);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const columns = useMemo(() => getColumns(items), [items]);

  console.log('[Activities] REST endpoint:', endpoint);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      console.log('[Activities] Fetching:', endpoint);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log('[Activities] Fetched data:', data);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const list = normalizeListResponse(data);
        console.log('[Activities] Normalized list length:', list.length);

        if (!cancelled) {
          setItems(list);
        }
      } catch (err) {
        console.error('[Activities] Fetch error:', err);
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return (
    <section className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h1 className="h5 mb-0">Activities</h1>
        <a
          className="btn btn-outline-secondary btn-sm"
          href={endpoint}
          target="_blank"
          rel="noreferrer"
        >
          API
        </a>
      </div>

      <div className="card-body">
        <div className="mb-3">
          <span className="text-muted">Endpoint: </span>
          <a className="link-primary" href={endpoint} target="_blank" rel="noreferrer">
            {endpoint}
          </a>
        </div>

        {loading && (
          <div className="d-flex align-items-center gap-2">
            <div className="spinner-border" role="status" aria-label="Loading" />
            <span>Loading…</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mb-0">
            Error loading activities: {String(error.message || error)}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="alert alert-secondary mb-0">No activities found.</div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th scope="col" key={col}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={getRowKey(item, index)}>
                    {columns.map((col) => (
                      <td key={col} style={{ maxWidth: 360 }}>
                        <span className="d-inline-block text-truncate" style={{ maxWidth: 360 }}>
                          {col === 'value' ? formatCell(item) : formatCell(item?.[col])}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
