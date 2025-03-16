import { Toaster } from 'react-hot-toast';
import '@xyflow/react/dist/style.css';
import { AuthProvider } from './components/auth/AuthProvider';
import { Editor } from './components/Editor';

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <Editor />
      </AuthProvider>
    </>
  );
}
