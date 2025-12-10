import { useEffect } from 'react'
import { useAuthStore } from './store/auth'
import './styles/globals.css'

function Header() {
  const { user, signInWithGoogle, signOut } = useAuthStore()

  return (
    <header className="app-header">
      <div className="app-title">Atelier Moslow</div>
      <div className="app-actions">
        {user ? (
          <>
            <span className="user-label">{user.email}</span>
            <button className="ghost-button" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <button className="primary-button" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  )
}

function Loading() {
  return (
    <div className="loading-state">
      <div className="spinner" aria-hidden />
      <p>Loading your workspace…</p>
    </div>
  )
}

function PlaceholderWorkspace() {
  return (
    <div className="workspace-shell">
      <div className="workspace-left">
        <div className="panel-header">Projects</div>
        <div className="panel-muted">Project list coming next.</div>
      </div>
      <div className="workspace-main">
        <div className="ribbon-placeholder">
          <div className="pill">Type system</div>
          <div className="pill">Page layout</div>
          <div className="pill">AI Companion</div>
        </div>
        <div className="editor-canvas">
          <div className="page-placeholder">
            <h1>Writer-ready canvas</h1>
            <p>
              Tiptap editor and companion UI will render here. Auth is wired to Supabase; next we
              will hydrate projects and documents from the new schema.
            </p>
          </div>
        </div>
      </div>
      <div className="workspace-right">
        <div className="panel-header">Companion</div>
        <div className="panel-muted">AI panel stub.</div>
      </div>
    </div>
  )
}

function App() {
  const { init, loading, user } = useAuthStore()

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="app-shell">
      <Header />
      {loading ? <Loading /> : <PlaceholderWorkspace key={user?.id ?? 'guest'} />}
    </div>
  )
}

export default App
