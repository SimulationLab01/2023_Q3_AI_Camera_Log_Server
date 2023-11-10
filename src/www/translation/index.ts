import { createContext, useContext } from "react"
import * as en_us from './en-us.json'

export type Translator = typeof en_us

const translators = {
	'en-us': en_us,
}

type Lang = keyof typeof translators
type TranslationContextType = [Translator, (x: Lang)=>void]
const TranslationContext = createContext<TranslationContextType>([translators['en-us'], (_) => { }])

export function useTranslationContext() {
	return [TranslationContext.Provider, [translators["en-us"], (_) => { }]] as [typeof TranslationContext.Provider, TranslationContextType]
}

export function useTranslation(){
	const [translation, _] = useContext(TranslationContext)
	return translation
}
