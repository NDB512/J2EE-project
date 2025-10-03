import '@mantine/core/styles.css'
import './App.css'
import './index.css'
import { createTheme, MantineProvider } from '@mantine/core'
import { Button } from '@mantine/core'
import AppRouter from './Routers/AppRouter'

const theme = createTheme({
  colors: {
    primary: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'],
    neutral: ['#FAFAFA', '#F5F5F5', '#EEEEEE', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242', '#212121'],
  },
  primaryColor: 'primary',
  headings: { fontFamily: 'Greycliff CF, sans-serif'
  },

  primaryShade: 6,
  defaultGradient: { from: 'primary.4', to: 'primary.8', deg: 132 },

  colorScheme: 'dark',
})

function App() {

  return (
    <MantineProvider theme={theme}>
      <AppRouter />
    </MantineProvider>
  )
}

export default App
