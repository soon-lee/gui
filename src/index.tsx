/* @refresh reload */
import {render} from 'solid-js/web'

import './index.css'
import App from './App'
import {I18nProvider} from './utils/i18n'

const root = document.getElementById('root')

render(() =>
    <I18nProvider lang="en">
        <App/>
    </I18nProvider>, root!)
