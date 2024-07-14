import { render } from 'solid-js/web';
import App from './App';
import {I18nProvider} from "@utils/i18n.tsx";

const root = document.getElementById('root');
if (root) {
  render(() => <I18nProvider><App /></I18nProvider>, root);
}
