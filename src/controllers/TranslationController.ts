import { readFileSync, readdirSync } from 'fs'

const _basePath = './src/locales'
const _fallbackLocale = 'en'

class TranslationController {
    private translations: Record<string, Record<string, string>>

    constructor(namespace: string) {
        const files = readdirSync(_basePath, { withFileTypes: true })
        const locales = files.filter(file => file.isDirectory()).map(file => file.name)

        this.translations = {}

        locales.forEach(locale => {
            const buffer = readFileSync(`${_basePath}/${locale}/${namespace}.json`, 'utf-8')
            this.translations[locale] = JSON.parse(buffer)
        })
    }

    getTranslation(locale: string = _fallbackLocale, key: string) {
        return this.translations?.[locale]?.[key] ?? key
    }
}

export default TranslationController
