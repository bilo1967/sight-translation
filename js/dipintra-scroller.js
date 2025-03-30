/* <script type="text/javascript"> */


/*
Icone di Bootstrap 5
Stop    <i class="bi bi-stop-fill"></i>
Play    <i class="bi bi-play-fill"></i>
Rewind  <i class="bi bi-rewind-fill"></i>
Undo    <i class="bi bi-arrow-counterclockwise"></i>
Plus    <i class="bi bi-plus"></i>
Minus   <i class="bi bi-dash"></i>
*/

// Costanti per la configurazione dello slider

 
const speedSliderMax     = 320;
const speedSliderMin     =   5;
const speedSliderDefault = 100;
const speedSliderStep    =   5;

console.assert((speedSliderMax - speedSliderMin) % speedSliderStep == 0, 'Error setting slider parameters: '); 
console.assert(speedSliderDefault % speedSliderStep == 0, 'Error setting slider default'); 
console.assert(
    (speedSliderMax % speedSliderStep == 0) && 
    (speedSliderMin % speedSliderStep == 0) &&
    (speedSliderMax > speedSliderMin) &&
    (speedSliderMin >= 0) &&
    (speedSliderMax >= 0 + speedSliderStep),
    'Error setting slider minimum and maximum value'
); 



// Lingue configurate in TinyMCE. 
// La chiave è il codice della lingua utilizzato nella app
// Alcune sono definite col codice di localizzazione principale a 2 caratteri
// altre con quello regionalizzato aa_AA. Usiamo questa costante per mappare
// le nostre codifiche su quelle di TinyMCE
// Per aggiungerne altre: https://www.tiny.cloud/get-tiny/language-packages/ 
const mapLangToEditorLanguage = {
    en:      'en',
    it:      'it',
    es:      'es',        
    fr:      'fr_FR',
    de:      'de',
    ru:      'ru',    
    default: 'en',
};

//
// Le bandiere da associare alle lingue, sono riferite al paese e non alla lingua.
// Quelle non elencate, sono in css/flags
// La chiave è il codice della lingua utilizzato nella app
//
const mapLangToNation = {
    en:      'gb',
    it:      'it',
    es:      'es',
    fr:      'fr',
    de:      'de',
    ru:      'ru',
    default: 'gb',
};




// 

$(document).ready(function () {


    var editorObject;   // Istanza principale di tinymce    
    
    var animation; // Riferimento all'animazione 
    var animationIsPaused  = false;
    var animationIsStopped = false;
    
    // reference di comodo ad alcuni elementi dell'interfaccia
    const slidingContainer = $('#sliding-context');
    const slidingContent   = $('#sliding-text');
    const speedSlider      = $('#speed-slider');
    const playerContainer  = $('#player-container');
    const editorContainer  = $('#editor-container');
    
    let frameStartTime;
    let currentPosition    = 0;
    
    var wordCount;

    // La lingua dell'interfaccia di tinymce non può essere cambiata al volo
    // La rileviamo qui, preferenzialmente dai cookie e in secondo luogo 
    // quello determinato da i18next o, in alternativa, l'inglese
    const editorLanguage = Cookies.get('editor-language') ?? mapEditorLanguage(i18next.language ?? 'default');
    Cookies.set('editor-language', editorLanguage);
    
    // Imposto il linguaggio dell'interfaccia dell'app
    switchLanguage();
    
    // Carica la velocità salvata nei cookie, se presente
    if (Cookies.get('text-speed')) {
        $('#text-speed-combo').val(Cookies.get('text-speed'));
    }

    
    
    /**
     * Funzione principale per l'animazione dello scorrimento del testo.
     * @param {number} timeStamp - Timestamp dell'animazione.
     */
    function animate(timeStamp = 0) {

        if (!frameStartTime) frameStartTime = timeStamp;

        let elapsed = (timeStamp - frameStartTime) / 1000.0; // Tempo trascorso in secondi 
        frameStartTime = timeStamp;

        const containerHeight = slidingContainer.height();
        const contentHeight = slidingContent.outerHeight(true);
        const maxScroll = (containerHeight + contentHeight);

        if (!animationIsPaused && !animationIsStopped) {

            const speed =  wpm2pps( speedSlider.val() );
            
            const dist = speed * elapsed;
        
            currentPosition -= dist;
            if (currentPosition <= -maxScroll) {
                $('#stop').trigger('click');
            }

            slidingContent.css('transform', `translateY(${currentPosition}px)`);
         }
        animation = requestAnimationFrame(animate);
    }
    

    /**
     * Avvia l'animazione dello scorrimento.
     */
    function startAnimation() {
        statsStart();
        animationIsPaused = false;
        animationIsStopped = false;
        frameStartTime = 0;
        animation = animate();
        showPauseSpinner(false);
    }

    /**
     * Ferma l'animazione dello scorrimento.
     */
    function stopAnimation() {
        cancelAnimationFrame(animation);
    }
    
    
    /**
     * Mostra/nasconde l'indicatore di pausa (uno)
     * spinner al centro dello schermo di scorrimento)
     */
    function showPauseSpinner(show) {
        if (show) {
            $('#paused-text').css('display', 'block');
            $('#paused-spinner').addClass("spinner-border");
        } else {
            $('#paused-text').css('display', 'none');
            $('#paused-spinner').removeClass("spinner-border");        
        }
    }
    
    /**
     * Attiva o disattiva l'animazione.
     */
    function toggleAnimation() {
        const icon = $('#start-pause i');
        icon.toggleClass('fa-start fa-pause');

        if (animationIsStopped || icon.hasClass('fa-pause')) {

            showPauseSpinner(false);
            
            startAnimation();
        } else {

            showPauseSpinner(true);

            animationIsPaused = true;
            animationIsStopped = false;
            stopAnimation();
        }
    }
  

    /**
     * Ferma l'animazione e "riavvolge"
     */ 
    function stopAndResetAnimation() {
        $('#start-pause i').removeClass('fa-pause').addClass('fa-start');
        showPauseSpinner(false);
        animationIsStopped = true;
        animationIsPaused = false;
        stopAnimation();
        slidingContent.css('transform', `translateY(0px)`);
        currentPosition = 0;
        statsReset();
    }    
    
    /**
     * Torna indietro nello scorrimento di n secondi.
     * @param {number} seconds - Numero di secondi da tornare indietro.
     */
    function rewindAnimation(seconds) {
        if (animationIsStopped || !seconds || seconds <= 0) return;
        
        // Calcola di quanti pixel riavvolgere lo scroller
        const speed = wpm2pps(speedSlider.val());
        const pixelsToRewind = speed * seconds;

        // Calcola la nuova posizione
        const newPosition = currentPosition + pixelsToRewind;
        if (newPosition > 0) {
            currentPosition = 0; // Non andare oltre l'inizio
        } else {
            currentPosition = newPosition;
        }
        
        // Applica la trasformazione
        slidingContent.css('transform', `translateY(${currentPosition}px)`);
       
        statsUpdate();
    }    
    
    
    // Gestione delle statistiche
    const statsUpdateInterval = 100; // intervallo aggiornamento statistiche in ms
    var statsTimerId = null;
    let statsStartTime;
    let statsElapsedTime;
    let statsCurrentTime;
    let statsRemainingTime;
    
    /**
     * Avvia il timer per l'aggiornamento delle statistiche.
     */    
    function statsStart() {
        if (!statsTimerId) statsTimerId = setInterval(statsUpdate, statsUpdateInterval);
        statsStartTime = Date.now();
        statsCurrentTime = statsStartTime;
        if (animationIsStopped) {
            statsElapsedTime = 0;
            $('#elapsed-time').text("00:00");
        }
    }

    function statsStop() {
        //if (statsTimerId) clearInterval(statsTimerId);
    }


    /**
     * Aggiorna le statistiche visualizzate.
     */    
    function statsUpdate() {
 
        if (animationIsStopped) return;
        
        let t;
        
        let now = Date.now();

        statsElapsedTime += (now - statsCurrentTime);
        statsCurrentTime = now;
        
        const wpm = speedSlider.val();
        
        $('#current-rate').text(wpm);
        
        const speed = wpm2pps(wpm);

        // Velocità effettiva in pixel/s
        t = Math.round(speed * 10)/10;
        if ($('#true-speed').text() != t) $('#true-speed').text(t);
        
        // Tempo stimato, in secondi
        t = (slidingContent.height() + slidingContainer.height())/speed;
        
        // Converto il tempo in formato 00:00:00
        t = msToTime(t * 1000); 
        if ($('#estimated-time').text() != t) $('#estimated-time').text(t);

        // tempo passato
        t = msToTime(statsElapsedTime);
        if ($('#elapsed-time').text() != t) $('#elapsed-time').text(t);

        // calcolo del tempo mancante
        t = msToTime(1000 * (slidingContent.height() + slidingContainer.height() + currentPosition)/speed);
        if ($('#remaining-time').text() != t) $('#remaining-time').text(t);
        
    }


    function statsReset() {
        if (statsTimerId) {
            clearInterval(statsTimerId);
            statsTimerId = null;
        }
        
        statsStartTime = null;
        statsCurrentTime = null;
        statsElapsedTime = 0;
    }
    
    /**
     * Converte parole al minuto (WPM) in pixel al secondo (PPS).
     * @param {number} rate - Velocità in parole al minuto.
     * @returns {number} Velocità in pixel al secondo.
     */
    function wpm2pps(rate) {
    
        if (isNaN(rate) || isNaN(wordCount) || isNaN(currentPosition)) return 0;
    
        const totalSpace = slidingContent.height() + slidingContainer.height();
        const currentSpace = totalSpace + currentPosition; // currentPosition è negativo
        
        const t = 60 * wordCount / rate;
        
        return totalSpace / t;
    }
    


    ///////////////
    //           //
    // Controlli //
    //           //
    ///////////////


	//
    // Inizializzazione dello slider
	//
    speedSlider.attr('min', speedSliderMin);
    speedSlider.attr('max', speedSliderMax);
    speedSlider.attr('step', speedSliderStep);
    speedSlider.val(speedSliderDefault);


    //
    // Slider velocità che cambia valore
    //
    speedSlider.on('input', (e) => {
        $('#current-rate').text($(this).val());
        statsUpdate();
    });

    //
    // Incrementa/decrementa velocità coi bottoni
    // sia quando vengono cliccati che quando vengono tenuti premuti
    //

    
    

    $(document).on('click', '#inc-text-speed', function (e) {
        changeTextSpeed(speedSlider.attr("step"));
    });
    $(document).on('click', '#dec-text-speed', function (e) {
        changeTextSpeed(-speedSlider.attr("step"));
    });  


    // Quando dec-text-speed o inc-text-speed vengono tenuti premuti,
    // attiva la ripetizione autometica dell'azione di click
    // Configura la ripetizione con valori sensati
    const options = {
//      acceleration: 0.5,
//      accelerateAfter: 5,
        repeatInterval: 20, 
        maxIterations: (speedSliderMax - speedSliderMin) / speedSliderStep,
    };
    
    //$('#dec-text-speed').on('holdrepeat', options, function (e) {
    $(document).on('holdrepeat', '#dec-text-speed', options, function (e) {
        changeTextSpeed(-speedSlider.attr("step"));
    });
    //$('#inc-text-speed').on('holdrepeat', options, function (e) {

    $(document).on('holdrepeat', '#inc-text-speed', options, function (e) {
        changeTextSpeed(speedSlider.attr("step"));
    });    

 
    //
    // Incrementa/decrementa dimensione font
    //
    $(document).on('click', '#inc-font-size', function (e) {
        adjustFontSize(1);
    });    
    $(document).on('click', '#dec-font-size', function (e) {
        adjustFontSize(-1);
    });    
    
    
    //
    // Incrementa/decrementa interlinea
    //
    $(document).on('click', '#inc-line-height', function(e) {
        adjustLineHeight(2);
    });
    $(document).on('click', '#dec-line-height', function(e) {
        adjustLineHeight(-2);
    });

    //
    // Start-pause 
    // 
    $(document).on('click', '#start-pause', function(e) {
        toggleAnimation();
    });
    
    //
	// Stop
	//
    $(document).on('click', '#stop', function(e) {
        stopAndResetAnimation();
    });
    

    // barra spaziatrice = click su start-pause
    $(document).on('keypress', function(e) {
        if (e.which == 32 && editorContainer.css('display') == 'none') {
	        $('#start-pause').trigger('click');
            e.preventDefault();
        }
    });    
    
    // Gestore dell'evento per il bottone "Rewind"
    $(document).on('click', '#rewind-button', function (e) {
        e.preventDefault();
        rewindAnimation(5); // Torna indietro di n secondi
    });


    function changeTextSpeed(step) {
    
        const v = parseInt(speedSlider.val()) + parseInt(step); 
        speedSlider.val(v);
        $('#current-rate').text(v);
        statsUpdate();        

    }    

    
    /**
     *  EDITOR
     */

    $('#editor-textarea').tinymce({

        toolbar: [
            'undo redo cut copy removeformat | blocks  fontfamily fontsize |  forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent blockquote numlist bullist | lineheight',
        ],
        //menubar: 'file edit insert view format tools help', // omesso: view
        menubar:   'file edit insert      format tools help',
        plugins: "wordcount emoticons charmap insertdatetime searchreplace lists advlist autosave help",
        theme: 'silver',
        setup: function (ed) {
            ed.on('init', function(args) {
                // Ora l'editor è istanziato e posso copiare il riferimento ad esso
  				editorObject = this;  // = tinymce.activeEditor
//				this.execCommand("fontSize", false, "20px");
//              this.execCommand("fontName", false, "Playfair Display");
            });
        },
        font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 36pt 48pt',
        autosave_ask_before_unload: false,
        autosave_interval: '30s',
        autosave_restore_when_empty: true,
        autosave_retention: '30m',
        //height: '400px',
        //autoresize: '100%', // aggiungere resize ai plugin,
        language: editorLanguage,
        language_url: "/js/tinymce.7/langs/" + editorLanguage + '.js',
        visual: false, // non mostrare caratteri nascosti, vedi menu "view"
        branding: false,
        promotion: false,
        license_key: 'gpl',
    });
    
	//
	// Attiva riproduzione
	// 
	$(document).on('click', '#start-player', function(e) {
        e.preventDefault();
       

        let v = $('#text-speed-combo').val();
        
        speedSlider.val(v);
        $('#current-rate').text(v);
       
        slidingContent.html($('#editor-textarea').val());
        editorContainer.fadeOut(200).hide();
        playerContainer.fadeIn(200);
        $(window).trigger('resize');


        // Conteggio le parole qui perché non cambiano
        // durante lo scrolling e non ha senso ricalcolarle
        // a ogni frame di animazione
        
        wordCount = editorObject.plugins.wordcount.body.getWordCount(); 
        $('#words-in-text').text(wordCount);

        statsReset();
        $('#start-pause').trigger('click');
       
	});
	
    //
    // Imposta la velocità iniziale
    //
	$(document).on('change', '#text-speed-combo', function(e) {
	    e.preventDefault();
        let v = $('#text-speed-combo').val();
        
        Cookies.set('text-speed', v, {expires: 365});
        
        speedSlider.val(v);
        $('#current-rate').text(v);
	});
	
	
    $(window).resize(function() {

        var w = playerContainer.width(),
            h = playerContainer.height() 
                - parseInt(playerContainer.css('margin-top'))
                - parseInt(playerContainer.css('margin-bottom')),
			d = $('#player-body').outerHeight() 
			    - $('#player-body').height()
				+ $('#player-footer').outerHeight()
                + $('#player-title-row').outerHeight() ;

		slidingContainer.css('height', h - slidingContainer.position().top - d);
        
		slidingContent.css('top', slidingContainer.height());
	});
	$(document).on('click', '#resizeScreenButton', function(e) {
		e.preventDefault();
	    slidingContainer.css('height', 400);
	    $(window).trigger('resize');
	});

    
    //
	// Back to editor
	//
    $(document).on('click', '#back-to-editor', function(e) {
	    e.preventDefault();
		$('#stop').trigger('click');
		playerContainer.fadeOut(200).hide();
		editorContainer.fadeIn(200);
    });

    //
    // Gestisco il cambiamento dell'icona nel selettore della lingua
    //
    $('#languageDropdown .dropdown-item').on('click', function() {
        const lang = $(this).data('lang') ?? 'en';
        const icon = getLangIcon(lang);
        $('#languageDropdownButton').html(icon);
        
        switchLanguage(lang);
    });

    // Da eseguire appena la pagina è caricata    
	$(window).trigger('resize');
	playerContainer.hide();
	
});


// Utility varie

function msToTime(milliseconds) {
    // Converti i millisecondi in secondi
    let totalSeconds = Math.floor(milliseconds / 1000);

    // Calcola le ore, i minuti e i secondi
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    // Aggiungi uno zero iniziale se necessario
    let formattedHours = String(hours).padStart(2, '0');
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(seconds).padStart(2, '0');

    // Restituisci il tempo formattato
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


/**
 * Regola la dimensione del font del testo.
 * @param {number} step - Incremento/decremento della dimensione del font.
 */
function adjustFontSize(step) {
    $('#sliding-text *').each(function () {
        let fontSize = parseInt($(this).css("font-size"));
        fontSize += step;
        fontSize = Math.min(Math.max(fontSize, 8), 100);
        $(this).css("font-size", fontSize + 'px');
    });
}

/**
 * Regola l'interlinea del testo.
 * @param {number} step - Incremento/decremento dell'interlinea.
 */
function adjustLineHeight(step) {
    $('#sliding-text > *').each(function () {
        let lineHeight = Math.round(parseFloat($(this).css("line-height")));
        lineHeight = Math.max(lineHeight + step, 12);
        $(this).css("line-height", lineHeight + "px");
    });
}


function switchLanguage(lang = null) {

    // Se non viene passata nessuna lingua come parametro
    // allora uso quella nei cookie, se non c'è uso quella
    // rilevata da i18next oppure e, se non ne è stata 
    // rilavata nessuna, l'inglese

    lang = lang ?? getCurrentLanguage();
    lang = lang.substring(0, 2).toLowerCase();
    
    // questa funzione è definita in i18n.js
    changeLanguage(lang);

    // salvo la lingua nei cookie
    saveLanguage(lang);    
}

function getCurrentLanguage() {
    const lang = Cookies.get('language') ?? i18next.language ?? 'en';
    return lang.substring(0, 2).toLowerCase();
}

function mapEditorLanguage(lang) {
    lang = lang.substring(0, 2).toLowerCase() ?? 'default';
    return mapLangToEditorLanguage[lang];
}


//
// Genera il codice HTML per visualizzare la bandierina
//
function getLangIcon(lang) {

    lang = mapLangToNation[lang.substring(0, 2).toLowerCase() ??  'en'];
    
    return '<i class="flag-icon flag-icon-squared flag-icon-' + lang + '"></i>';
}

function saveLanguage(lang) {

    // Considero solo il prefisso di 2 caratteri (it_IT, fr-FR, ecc.)
    if (lang) lang = lang.substring(0, 2).toLowerCase() ?? 'en';
    
    const edLang = mapEditorLanguage(lang);
    
    // Icona per la lingua dell'interfaccia
    const langIcon = getLangIcon(lang);
    
    currentEditorLanguage = Cookies.get('editor-language'); // Serve che sia globale    
    
    if (currentEditorLanguage != edLang) {
        
        toastr.success(
            $.t('toastr.mustreload'),
            $.t('toastr.langchanged'),
            {"positionClass": "toast-middle", timeOut: 3000}
        );

    }

    $('#languageDropdownButton').html(langIcon);

    Cookies.set('language', lang, {expires: 365});
    Cookies.set('editor-language', edLang, {expires: 365});
}

/* </script> */
