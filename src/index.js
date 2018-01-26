import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import './index.css';
import Reboot from 'material-ui/Reboot';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { grey, blueGrey } from 'material-ui/colors';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: blueGrey,
        secondary: grey
    },
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Reboot />
        <App />
    </MuiThemeProvider>,
    document.getElementById('root'));
registerServiceWorker();
