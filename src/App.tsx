import { useEffect } from 'react'
import { useAuthStore } from './store/auth'
import { EditorCanvas } from './components/editor/EditorCanvas'
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
        <div className="panel-card">
          <div className="card-title">Beyond the Reach of Justice</div>
          <div className="card-sub">Thriller • 8 chapters</div>
        </div>
        <div className="panel-card ghost">
          <div className="card-title">New Project</div>
          <div className="card-sub">Tap to create</div>
        </div>
      </div>
      <div className="workspace-main">
        <EditorCanvas />
      </div>
      <div className="workspace-right">
        <div className="panel-header">Companion</div>
        <div className="panel-card">
          <div className="card-title">AI Brief</div>
          <div className="card-sub">
            Deliver concise, voice-aware suggestions. Keep tone consistent with the voice profile.
          </div>
        </div>
        <div className="panel-card ghost">
          <div className="card-title">Voice Profile</div>
          <div className="card-sub">Guardian prompt + cliche filter</div>
        </div>
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
