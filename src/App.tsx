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
    <WebViewer />
  )
}

export default App
