class BabelFishTranslator {
    constructor() {
        this.languages = ['English', 'Vogon', 'Martian', 'Betelgeusian'];
    }

    translate(text, fromLang, toLang) {
        // This is a mock translation. In a real application, you'd use an actual translation API.
        return `${text} (Translated from ${fromLang} to ${toLang})`;
    }

    getAvailableLanguages() {
        return this.languages;
    }
}

// Usage example:
// const translator = new BabelFishTranslator();
// console.log(translator.translate("Hello", "English", "Vogon"));