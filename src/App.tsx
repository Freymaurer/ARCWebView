import './App.css'
import { PageLayout} from '@primer/react'
import WebViewer from './components/WebViewer';

// function Placeholder({height, children}: {height: number | string; children: React.ReactNode}) {
//   return (
//     <div
//       style={{
//         width: '100%',
//         height,
//         display: 'grid',
//         placeItems: 'center',
//         background: 'canvas.inset',
//         borderRadius: 2,
//         border: '1px solid',
//         borderColor: 'border.subtle',
//       }}
//     >
//       {children}
//     </div>
//   )
// }

function App() {

  return (
    <PageLayout>
      {/* <PageLayout.Header>
        <Placeholder height={64}>Header</Placeholder>
      </PageLayout.Header> */}
      <PageLayout.Content>
        {/* <Placeholder height={400}>Content</Placeholder> */}
        <WebViewer />
      </PageLayout.Content>
      {/* <PageLayout.Pane>
        <Placeholder height={200}>Pane</Placeholder>
      </PageLayout.Pane> */}
      {/* <PageLayout.Footer>
        <Placeholder height={64}>Footer</Placeholder>
      </PageLayout.Footer> */}
    </PageLayout>
  )
}

export default App
