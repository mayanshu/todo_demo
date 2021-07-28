import type { AppProps } from 'next/app'
import { AuthUserProvider } from '../context/authContext';

// import your stylesheets
import '../styles/globals.css';
import '@material/typography/dist/mdc.typography.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@material/notched-outline/dist/mdc.notched-outline.css';
import '@material/line-ripple/dist/mdc.line-ripple.css';
import '@material/ripple/dist/mdc.ripple.css';
import '@material/icon-button/dist/mdc.icon-button.css';
import '@rmwc/icon/icon.css';
import '@material/button/dist/mdc.button.css';
import '@material/snackbar/dist/mdc.snackbar.css';
import '@material/top-app-bar/dist/mdc.top-app-bar.css';
import '@rmwc/avatar/avatar.css'
import '@material/drawer/dist/mdc.drawer.css';
import '@material/list/dist/mdc.list.css';
import '@material/checkbox/dist/mdc.checkbox.css';
import '@material/icon-button/dist/mdc.icon-button.css';
import '@material/card/dist/mdc.card.css';
import '@material/fab/dist/mdc.fab.css';
import '@material/data-table/dist/mdc.data-table.css';
import '@rmwc/data-table/data-table.css';
import '@material/dialog/dist/mdc.dialog.css';
import '@rmwc/circular-progress/circular-progress.css';

function MyApp({ Component, pageProps }: any) {
  return <AuthUserProvider><Component {...pageProps} /></AuthUserProvider>
}

export default MyApp
