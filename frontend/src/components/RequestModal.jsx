import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function RequestModal({ roomId, requests = [], onClose, onAccept, onReject, currentUserId, isAdmin = false, token = null }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    let mounted = true;

    const normalize = (r) => {
      if (!r) return { id: null, username: 'Unknown', email: '' };
      if (typeof r === 'string') return { id: r, username: null, email: null };
      const id = r._id || r.user?._id || r.userId || r;
      const username = r.username || r.user?.username || null;
      const email = r.email || r.user?.email || null;
      return { id, username, email };
    };

    const fetchMissing = async () => {
      const normalized = requests.map(normalize);
      const toFetch = normalized.filter((x) => x.id && !x.username);
      const fetched = {};
      await Promise.all(
        toFetch.map(async (t) => {
          try {
            const data = await api(`/users/${t.id}`, {}, token);
            fetched[t.id] = { username: data.username, email: data.email };
          } catch (e) {
            fetched[t.id] = { username: t.id, email: '' };
          }
        })
      );

      const merged = normalized.map((n) => ({
        id: n.id,
        username: n.username || (n.id && fetched[n.id]?.username) || `User ${n.id}`,
        email: n.email || (n.id && fetched[n.id]?.email) || '',
      }));

      if (mounted) setList(merged);
    };

    fetchMissing();
    return () => (mounted = false);
  }, [requests]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Join Requests ({requests.length})</div>
        <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.length === 0 && (
            <div style={{ color: 'var(--text2)' }}>No pending requests.</div>
          )}
          {list.map((nr, i) => {
            return (
              <div key={nr.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{(nr.username && nr.username[0]) || '?'}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 600 }}>{nr.username}</div>
                  {nr.email && <div style={{ fontSize: 12, color: 'var(--text2)' }}>{nr.email}</div>}
                </div>
                {isAdmin ? (
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button className="h-btn" onClick={() => onAccept(roomId, nr.id)}>Accept</button>
                    <button className="h-btn" onClick={() => onReject(roomId, nr.id)}>Reject</button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
