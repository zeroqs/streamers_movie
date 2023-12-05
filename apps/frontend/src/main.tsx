import './index.css'
import '@mantine/core/styles.css'

import { createTheme, MantineProvider } from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './App'

const theme = createTheme({
	/** Put your mantine theme override here */
})

ReactDOM.createRoot(document.querySelector('#root')!).render(
	<MantineProvider theme={theme}>
		<App />
	</MantineProvider>,
)
