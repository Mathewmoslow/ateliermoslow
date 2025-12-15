import { useEffect, useRef, useState } from 'react'
import { Layout, Button, Typography, Space, Grid, theme, Card, Drawer } from 'antd'
import { BgColorsOutlined } from '@ant-design/icons'
import { useAuthStore } from './store/auth'
import { EditorCanvas, type EditorHandle } from './components/editor/EditorCanvas'
import { ColorPanel } from './components/editor/ColorPanel'
import { CompanionPanel } from './components/companion/CompanionPanel'
import './styles/globals.css'

const { Header, Content, Sider } = Layout
const { Text } = Typography

function ShellHeader() {
  const { user, signInWithGoogle, signOut } = useAuthStore()
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md

  return (
    <Header className="app-header">
      <Space align="center" size={10}>
        <div className="app-title">Atelier Moslow</div>
        <Space size={6} className="app-menu">
          <Button type="text" size="small" disabled>
            File
          </Button>
          <Button type="text" size="small" disabled>
            Edit
          </Button>
          <Button
            type="text"
            size="small"
            icon={<BgColorsOutlined />}
            onClick={() => window.dispatchEvent(new CustomEvent('open-palette'))}
          >
            View
          </Button>
        </Space>
      </Space>
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
  const editorRef = useRef<EditorHandle>(null)
  const [swatchColor, setSwatchColor] = useState('#4aa3ff')
  const [paletteOpen, setPaletteOpen] = useState(false)

  const handleSelectColor = (color: string) => {
    setSwatchColor(color)
    editorRef.current?.applyColor(color)
  }

  useEffect(() => {
    init()
    const openPalette = () => setPaletteOpen(true)
    window.addEventListener('open-palette', openPalette as EventListener)
    return () => window.removeEventListener('open-palette', openPalette as EventListener)
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
            {isMobile && (
              <div className="mobile-toolbar">
                <Button
                  size="small"
                  icon={<BgColorsOutlined />}
                  onClick={() => setPaletteOpen(true)}
                >
                  Palette
                </Button>
              </div>
            )}
            <EditorCanvas
              ref={editorRef}
              isMobile={isMobile}
              swatchColor={swatchColor}
              onSwatchChange={setSwatchColor}
            />
          </Content>

          {!isMobile && (
            <Sider width={320} theme="dark" className="workspace-side">
              <CompanionPanel editorRef={editorRef} />
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

      {isMobile && (
        <Drawer
          title="Color & Harmony"
          placement="right"
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          width={isMobile ? '80%' : 420}
        >
          <ColorPanel current={swatchColor} onSelectColor={handleSelectColor} />
        </Drawer>
      )}
    </Layout>
  )
}

export default App
