class BabelFishTranslator {
    constructor() {
        this.languages = ['English', 'Chinese', 'Vogon', 'Martian', 'Betelgeusian'];
        this.translations = {
            'hello': '你好',
            'goodbye': '再见',
            'thank you': '谢谢',
            'how are you': '你好吗',
            'what is your name': '你叫什么名字',
            'nice to meet you': '很高兴认识你',
            'where are you from': '你从哪里来',
            'i don\'t understand': '我不明白',
            'please speak slowly': '请说慢一点',
            'can you help me': '你能帮助我吗'
        };
    }

    translate(text, fromLang, toLang) {
        if (fromLang === 'English' && toLang === 'Chinese') {
            const lowerText = text.toLowerCase();
            if (this.translations[lowerText]) {
                return this.translations[lowerText];
            } else {
                // If the exact phrase isn't found, translate word by word
                return text.split(' ').map(word => this.translations[word.toLowerCase()] || word).join(' ');
            }
        } else if (fromLang === 'Chinese' && toLang === 'English') {
            for (let [eng, chi] of Object.entries(this.translations)) {
                if (text === chi) return eng;
            }
            return text; // Return original if no translation found
        } else {
            // Mock translation for other language pairs
            return `${text} (Translated from ${fromLang} to ${toLang})`;
        }
    }

    getAvailableLanguages() {
        return this.languages;
    }
}
