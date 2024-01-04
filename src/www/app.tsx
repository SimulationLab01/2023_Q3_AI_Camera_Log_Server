import 'bootstrap';
import React, { StrictMode, useTransition } from "react";
import { createRoot } from 'react-dom/client';
import './app.scss';
import { Router } from './router';
import { useTranslationContext } from './translation';
import { mode } from './global';


export const App: React.FC<{}> = function (props) {
	const [TranslationProvider, translation] = useTranslationContext()
	return (
		<TranslationProvider value={translation}>
			<Router/>
		</TranslationProvider>
	)
}


function main() {
	const root = createRoot(document.getElementById('app')!);
	if (false && mode == "development"){
		root.render(<StrictMode><App /></StrictMode>);
	}else{
		root.render(<App />)
	}
}

main()
