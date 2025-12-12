import { useEffect } from 'react'
import { Layout, Button, Typography, Space, Grid, theme, Card } from 'antd'
import { useAuthStore } from './store/auth'
import { EditorCanvas } from './components/editor/EditorCanvas'
import './styles/globals.css'

const { Header, Content, Sider } = Layout
const { Text } = Typography

function ShellHeader() {
  const { user, signInWithGoogle, signOut } = useAuthStore()
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md

  return (
    <Header className="app-header">
      <div className="app-title">Atelier Moslow</div>
      <Space align="center" size={12}>
        {user && !isMobile && <Text type="secondary">{user.email}</Text>}
        {user ? (
          <Button size={isMobile ? 'small' : 'middle'} onClick={signOut}>
            Sign out
          </Button>
        ) : (
          <Button type="primary" size={isMobile ? 'small' : 'middle'} onClick={signInWithGoogle}>
            Sign in with Google
          </Button>
        )}
      </Space>
    </Header>
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

function App() {
  const { init, loading } = useAuthStore()
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const { token } = theme.useToken()

  useEffect(() => {
    init()
  }, [init])

  return (
    <Layout className="app-shell" style={{ background: token.colorBgBase }}>
      <ShellHeader />
      {loading ? (
        <Loading />
      ) : (
        <Layout className="workspace-shell">
          {!isMobile && (
            <Sider width={260} theme="dark" className="workspace-side">
              <div className="panel-header">Projects</div>
              <div className="panel-muted">Project list coming next.</div>
              <Card size="small" className="panel-card ant-card-ghost">
                <div className="card-title">Beyond the Reach of Justice</div>
                <div className="card-sub">Thriller • 8 chapters</div>
              </Card>
              <Card size="small" className="panel-card ant-card-ghost dashed">
                <div className="card-title">New Project</div>
                <div className="card-sub">Tap to create</div>
              </Card>
            </Sider>
          )}

          <Content className="workspace-main">
            <EditorCanvas isMobile={isMobile} />
          </Content>

          {!isMobile && (
            <Sider width={280} theme="dark" className="workspace-side">
              <div className="panel-header">Companion</div>
              <Card size="small" className="panel-card">
                <div className="card-title">AI Brief</div>
                <div className="card-sub">
                  Deliver concise, voice-aware suggestions. Keep tone consistent with the voice
                  profile.
                </div>
              </Card>
              <Card size="small" className="panel-card ant-card-ghost dashed">
                <div className="card-title">Voice Profile</div>
                <div className="card-sub">Guardian prompt + cliche filter</div>
              </Card>
            </Sider>
          )}

          {isMobile && (
            <div className="mobile-panels">
              <Card size="small" className="panel-card">
                <div className="card-title">Projects</div>
                <div className="card-sub">Compact list for mobile coming next.</div>
              </Card>
              <Card size="small" className="panel-card">
                <div className="card-title">Companion</div>
                <div className="card-sub">AI panel mobile layout.</div>
              </Card>
            </div>
          )}
        </Layout>
      )}
    </Layout>
  )
}

export default App
