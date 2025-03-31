const lngs = {
    en: { nativeName: 'English' },
    it: { nativeName: 'Italiano' },
    es: { nativeName: 'Español' },
    fr: { nativeName: 'Français' },
    de: { nativeName: 'Deutsch' },
    ru: { nativeName: 'Русский' },
};


// Funzione per cambiare lingua
// La callback è per salvare la scelta (per esempio, in un cookie)
function changeLanguage(lng, save = () => {}) {

    i18next.changeLanguage(lng, (err, t) => {
        if (err) return console.error(err);
        updateContent();
        save(lng);
    });
}


// Funzione per aggiornare il contenuto tradotto
function updateContent() {
    $('body').localize();
    //console.log("Lingua rilevata:", i18next.language);
}



$(function() {
    // use plugins and options as needed, for options, detail see
    // https://www.i18next.com
    i18next
        // detect user language
        // learn more: https://github.com/i18next/i18next-browser-languageDetector
        .use(i18nextBrowserLanguageDetector)
        // init i18next
        // for all options read: https://www.i18next.com/overview/configuration-options
        .init({
            debug: false,
            fallbackLng: 'en',
            resources: {
                en: {
                    translation: {
                        // here we will place our translations...
                        editor: {
                            title:          "Sight translation",
                            scrollrate:     "Scroll rate",
                            wpm:            "words per minute", 
                            wpm0:           "80 words per minute", 
                            wpm1:           "100 words per minute", 
                            wpm2:           "120 words per minute", 
                            wpm3:           "140 words per minute", 
                            wpm4:           "160 words per minute", 
                            wpm5:           "180 words per minute", 
                            wpm6:           "200 words per minute", 
                            wpm7:           "220 words per minute", 
                            wpm8:           "230 words per minute", 
                            wpm9:           "240 words per minute", 
                            runscroller:    "Start",
                            selectlanguage: "Select the app language",
                            replacethis:    "Replace this text with your...",
                        },                  
                        player: {           
                            title:          "Sight translation",
                            back:           "Close and go back to the editor",
                            player:         "Player",
                            words:          "words", 
                            scrollrate:     "Scrolling rate",
                            lineheight:     "Line height",
                            fontsize:       "Font size",
                            wpm:            "words/min", 
                            pps:            "pixels/s", 
                            totaltime:      "duration",
                            elapsedtime:    "elapsed t.",
                            remainingtime:  "remaining t.",
                            stopdescr:      "Stop the exercise",
                            paused:         "paused...",
                        },                  
                        descr: {            
                            back:           "Back to editor and load another text",
                            play:           "Play/pause",
                            stop:           "Stop",
                            rewind:         "Back 5 seconds",
                            decspeed:       "Decrease scrolling speed\n(click or hold)",
                            setspeed:       "Change scrolling speed",
                            incspeed:       "Increase scrolling speed\n(click or hold)",
                            incline:        "Decrease line height",
                            decline:        "Increase line height",
                            incfont:        "Decrease font size",
                            decfont:        "Increase font size",
                        },                  
                        toastr:  {          
                            mustreload:     "The editor interface will be in English the next time you reload the page",
                            langchanged:    "Editor language has changed",
                        },
                        
                    }
                },
                it: {
                    translation: {
                        // here we will place our translations...
                        editor: {          
                            title:          "Traduzione a vista",
                            scrollrate:     "Vel. scorrimento",
                            wpm :           "parole al minuto", 
                            wpm0:           "80 parole al minuto", 
                            wpm1:           "100 parole al minuto", 
                            wpm2:           "120 parole al minuto", 
                            wpm3:           "140 parole al minuto", 
                            wpm4:           "160 parole al minuto", 
                            wpm5:           "180 parole al minuto", 
                            wpm6:           "200 parole al minuto", 
                            wpm7:           "220 parole al minuto", 
                            wpm8:           "230 parole al minuto", 
                            wpm9:           "240 parole al minuto", 
                            runscroller:    "Inizia",
                            selectlanguage: "Seleziona la lingua dell'app",
                            replacethis:    "Sostituisci questo testo con il tuo...",
                        },
                        player: {
                            title:          "Traduzione a vista",
                            back:           "Chiudi e torna all'editor",
                            player:         "Player",
                            words:          "parole", 
                            scrollrate:     "Velocità di scorrimento",
                            lineheight:     "Interlinea",
                            fontsize:       "Dim. testo",
                            wpm:            "parole/min", 
                            pps:            "pixel/s", 
                            totaltime:      "durata",
                            elapsedtime:    "t. trascorso",
                            remainingtime:  "t. mancante",
                            stopdescr:      "Interrompi la riproduzione",
                            paused:         "in pausa...",
                        },                  
                        descr: {            
                            back:           "Torna all'editor di testo e carica un altro contenuto",
                            play:           "Riproduci/pausa",
                            stop:           "Interrompi la riproduzione",
                            rewind:         "Torna indietro di 5 secondi",
                            decspeed:       "Diminuisci la velocità di scorrimento\n(clicca o tieni premuto)",
                            setspeed:       "Regola la velocità di scorrimento",
                            incspeed:       "Aumenta la velocità di scorrimento\n(clicca o tieni premuto)",
                            incline:        "Diminuisci l'interlinea",
                            decline:        "Aumenta l'interlinea",
                            incfont:        "Diminuisci la dimensione dei caratteri",
                            decfont:        "Aumenta la dimensione dei caratteri",
                        },                  
                        toastr:  {          
                            mustreload:     "L'interfaccia dell'editor sarà in italiano la prossima volta che ricaricherai la pagina",
                            langchanged:    "Lingua dell'editor modificata",
                        },

                    },
                },
                es: {
                    translation: {
                        // here we will place our translations...
                        editor: {
                            title:          "Traducción a la vista",
                            scrollrate:     "Vel. desplazamiento",
                            wpm:            "palabras por minuto",
                            wpm0:           "80 palabras por minuto",
                            wpm1:           "100 palabras por minuto",
                            wpm2:           "120 palabras por minuto",
                            wpm3:           "140 palabras por minuto",
                            wpm4:           "160 palabras por minuto",
                            wpm5:           "180 palabras por minuto",
                            wpm6:           "200 palabras por minuto",
                            wpm7:           "220 palabras por minuto",
                            wpm8:           "230 palabras por minuto",
                            wpm9:           "240 palabras por minuto",
                            runscroller:    "Iniciar",
                            selectlanguage: "Seleccionar el idioma de la aplicación",
                            replacethis:    "Sustituya este texto por su...",
                        },                  
                        player: {           
                            title:          "Traducción a la vista",
                            back:           "Cerrar y volver al editor",
                            player:         "Reproductor",
                            words:          "palabras",
                            scrollrate:     "Velocidad de desplazamiento",
                            lineheight:     "Interlineado",
                            fontsize:       "Tamaño del texto",
                            wpm:            "palabras/min",
                            pps:            "píxeles/s",
                            totaltime:      "duración",
                            elapsedtime:    "t. transcurrido",
                            remainingtime:  "t. restante",
                            stopdescr:      "Detener la reproducción",
                            paused:         "pausado...",
                        },                  
                        descr: {            
                            back:           "Volver al editor de texto y cargar otro contenido",
                            play:           "Reproducir/Pausa",
                            stop:           "Detener la reproducción",
                            rewind:         "Retroceder 5 segundos",
                            decspeed:       "Disminuir la velocidad de desplazamiento\n(pulsar o mantener pulsado)",
                            setspeed:       "Ajustar la velocidad de desplazamiento ",
                            incspeed:       "Aumentar la velocidad de desplazamiento\n(pulsar o mantener pulsado)",
                            incline:        "Disminuir el interlineado",
                            decline:        "Aumentar el interlineado",
                            incfont:        "Disminuir el tamaño de la fuente",
                            decfont:        "Aumentar el tamaño de la fuente",
                        },                  
                        toastr:  {          
                            mustreload:     "La interfaz del editor estará en español la próxima vez que recargues la página",
                            langchanged:    "Ha cambiado el idioma del editor",
                        },
                    }                    
                },

                fr: {
                    translation: {
                        editor: {          
                            title:          "Traduction à vue",
                            scrollrate:     "Vit. défilement",
                            wpm:            "mots par minute", 
                            wpm0:           "80 mots par minute", 
                            wpm1:           "100 mots par minute", 
                            wpm2:           "120 mots par minute", 
                            wpm3:           "140 mots par minute", 
                            wpm4:           "160 mots par minute", 
                            wpm5:           "180 mots par minute", 
                            wpm6:           "200 mots par minute", 
                            wpm7:           "220 mots par minute", 
                            wpm8:           "230 mots par minute", 
                            wpm9:           "240 mots par minute", 
                            runscroller:    "Démarrer",
                            selectlanguage: "Sélectionnez la langue de l'app",
                            replacethis:    "Remplacez ce texte par votre...",
                        },
                        player: {
                            title:          "Traduction à vue",
                            back:           "Fermer et retourner à l'éditeur",
                            player:         "Lecteur",
                            words:          "mots", 
                            scrollrate:     "Vitesse de défilement",
                            lineheight:     "Interligne",
                            fontsize:       "Taille du texte",
                            wpm:            "mots/min", 
                            pps:            "pixels/s", 
                            totaltime:      "durée totale",
                            elapsedtime:    "temps écoulé",
                            remainingtime:  "temps restant",
                            stopdescr:      "Arrêter la lecture",
                            paused:         "en pause...",
                        },                  
                        descr: {            
                            back:           "Retourner à l'éditeur et charger un autre contenu",
                            play:           "Lecture/pause",
                            stop:           "Arrêter la lecture",
                            rewind:         "Reculer de 5 secondes",
                            decspeed:       "Réduire la vitesse de défilement\n(cliquez ou maintenez enfoncé)",
                            setspeed:       "Ajuster la vitesse de défilement",
                            incspeed:       "Augmenter la vitesse de défilement\n(cliquez ou maintenez enfoncé)",
                            incline:        "Réduire l'interligne",
                            decline:        "Augmenter l'interligne",
                            incfont:        "Réduire la taille du texte",
                            decfont:        "Augmenter la taille du texte",
                        },                   
                        toastr:  {           
                            mustreload:     "L'interface de l'éditeur sera en français au prochain rechargement de la page",
                            langchanged:    "Langue de l'éditeur modifiée",
                        },
                    },
                },
/*
                de: {
                },
                
                ru: {
                },
*/
            },
        }, (err, t) => {
            if (err) return console.error(err);

            // for options see
            // https://github.com/i18next/jquery-i18next#initialize-the-plugin
            jqueryI18next.init(i18next, $, {
                useOptionsAttr: true
            });

            updateContent();

            // start localizing, details:
            // https://github.com/i18next/jquery-i18next#usage-of-selector-function

        });
});
