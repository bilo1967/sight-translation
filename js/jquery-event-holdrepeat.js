/*
 * jQuery holdrepeat Event Plugin
 * 
 * This plugin extends jQuery to support "holdrepeat" events, which are triggered 
 * when an element is pressed and held at least for a specified duration. During the 
 * hold, the event is triggered repeatedly at a configurable interval, with optional
 * acceleration to decrease the interval over time (and increase the trigger rate).
 * 
 * Features:
 * - Customizable initial delay before the first hold event.
 * - Configurable repeat interval between hold events.
 * - Optional acceleration to dynamically adjust the interval.
 * - Support for both mouse and touch events.
 * - Works with direct event binding and event delegation.
 * - Prevents accidental clicks during hold interactions (ghost clicks).
 * 
 * Usage Example:
 * 
 * // Basic usage
 * $("#element").on("holdrepeat", function(e) {
 *     console.log(`Hold iteration ${e.iteration} at ${e.currentInterval}ms`);
 * });
 * 
 * // With custom options
 * $("#element").on("holdrepeat", {
 *     initialDelay: 300,        // Delay before first hold event (ms)
 *     repeatInterval: 100,      // Base interval between hold events (ms)
 *     acceleration: 0.8,        // Acceleration factor (0-1)
 *     accelerateAfter: 5,       // Start acceleration after N iterations
 *     minRepeatInterval: 30,    // Minimum interval (ms)
 *     maxIterations: Infinity,  // Maximum iterations per hold (>=1)
 *     maxDuration: Infinity,    // Maximum hold duration (ms)
 * }, function(e) {
 *     console.log(`Hold iteration ${e.iteration + 1} at ${e.currentInterval}ms`);
 * });
 * 
 * // Event delegation
 * $(document).on("holdrepeat", ".dynamic-element", function(e) {
 *     console.log(`Hold on dynamically added element`);
 * });
 * 
 * Events:
 * - holdstart: Triggered when the initial delay expires.
 * - holdrepeat: Triggered repeatedly during the hold.
 * - holdstop: Triggered when the hold ends.
 * - holdrepeathalt: Triggered when repetitions reach time or iteration limit
 * 
 * Event Object Properties:
 * - originalEvent: The native mouse/touch event.
 * - iteration: The current hold iteration (starts at 0).
 * - startTime: Timestamp when the hold started.
 * - currentInterval: The current interval between events (ms).
 * - accelerating: true, if acceleration is on
 * - duration: (holdstop only) Total duration of the hold (ms).
 * - haltReason: reason why repetitions halted (string, holdrepeathalt only)
 * - haltTime: time when repetitions halted (timestamp, holdrepeathalt only)
 * 
 * Dependencies:
 * - jQuery 1.7+
 * 
 * Browser Support:
 * - Chrome, Firefox, Safari, and other modern browsers.
 * - Touch devices (with optional scroll prevention).
 * - Does *NOT* support Internet Explorer (any version).
 */

( function( $ ) {
    "use strict";

    // Default configuration parameters
    const defaults = {
        initialDelay: 400,          // Initial delay before first hold event (ms)
        repeatInterval: 200,        // Base interval between hold events (ms)
        preventScrollOnTouch: true, // Prevent touch scrolling during hold
        acceleration: false,        // Acceleration factor (0-1) or false
        accelerateAfter: 10,        // Start acceleration after N iterations
        minRepeatInterval: 50,      // Minimum possible interval (ms)
        maxIterations: Infinity,    // Maximum iterations per hold (>= 1)
        maxDuration: Infinity,      // Maximum hold duration (ms, >= initialDelay+repeatInterval)
    };


    /**
     * The `elementStates` WeakMap is used to store the state of each element
     * that has the custom "holdrepeat" event attached to it. Each DOM element 
     * acts as a key in the WeakMap, and the associated value is an object 
     * representing the current state of the element during the "holdrepeat" 
     * interaction.
     *
     * The stored state includes:
     *
     * - controller: instance of AbortController to remove the vanilla event 
     *   listener which consumes ghost clicks for current element.
     * - startTime: timestamp of when hold started.
     * - iteration: the number of "holdrepeat" event iterations (number of repetitions).
     * - currentInterval: current interval between "holdrepeat" repetitions.
     * - options: configured options for the "holdrepeat" event 
     *
     * **Key Management:**
     *
     * The keys in the WeakMap are the DOM elements themselves. Since each DOM 
     * element is a unique object in memory, there are no conflicts between 
     * elements already present in the DOM and those added dynamically.
     * For example, if an element is removed from the DOM and then re-added,
     * it will still be a different key in the WeakMap because its memory 
     * reference is different.
     *
     * **Key Uniqueness:**
     *
     * Uniqueness is guaranteed because DOM elements are unique objects in memory.
     * Even if two identical elements will still be distinct keys in the WeakMap 
     * because they are distinct objects. This applies to both elements already 
     * in the DOM and those added dynamically.
     *
     * **Advantages of WeakMap:**
     *
     * - It does not create strong references to DOM elements, allowing garbage 
     *   collection to free memory when an element is removed from the DOM.
     * - There is no need to manually remove keys from the map when an element 
     *   is removed, as the WeakMap  automatically handles cleanup.
     *
     * **Usage Example:**
     *
     * When a user starts pressing an element, a new state is created in the WeakMap.
     * This state is updated during the interaction (e.g., incrementing the iteration
     * and adjusting the interval) and is automatically removed when the interaction ends.
     */

    // Element-specific state management registry (uses a WeakMap)
    const elementStates = new WeakMap();


    /**
     * Handles the start of the "holdrepeat" interaction.
     * @param {Event} event - The original event (mouse or touch).
     */
    function handleStart( event ) {

        // Find the target element
        const element = getTargetElement( event );
        if ( !element ) return;

        // Check if the element is disabled
        if ( $( element ).is( ":disabled, .disabled, [aria-disabled='true']" ) ) return;

        // Get the configured options
        const container = event.delegateTarget || element;
        const options = normalizeOptions(
            $( container ).data( "holdOptions" ) || defaults
        );

        // If the element already has a state, exit
        if ( elementStates.has( element ) ) return;

        // Create a new state for the element
        const state = {
            controller: new AbortController(),
            startTime: Date.now(),
            iteration: 0,
            currentInterval: options.repeatInterval,
            options: options
        };
        elementStates.set( element, state );

        /*
         * Since a ‘hold’ event can be triggered by a mousedown-mouseup 
         * sequence, and since the same sequence, no matter how prolonged,
         * also triggers ‘click’ events, if we want to prevent a ‘hold’
         * from also generating an unwanted click, we must activate an 
         * event listener that blocks it.
         * This event listener will be destroyed by issuing an abort() on
         * an AbortController(), whose signal will be bound to the event
         * listener.
         */
        element.addEventListener( "click", e => {
            e.stopImmediatePropagation();
            e.preventDefault();
        }, {
            capture: true, // ensures to capture the event before jquery
            signal: state.controller.signal, // bind an AbortController to self-destroy 
        } );

        // Start the hold sequence
        startHoldSequence( element, state, event, options );
    }

    /**
     * Handles the end of the "holdrepeat" interaction.
     * @param {Event} event - The original event (mouse or touch).
     */
    function handleEnd( event ) {

        // Find the target element
        const element = getTargetElement( event );
        if ( !element || !elementStates.has( element ) ) return;

        // Get the current state
        const state = elementStates.get( element );

        // Determine if there was a click (mouseup/touchend after a mousedown/touchstart)
        const isClick = [ "mouseup", "touchend" ].includes( event.type );

        // Determine if the mouse click/touch was long enough to start an hold event
        const isShortPress = ( Date.now() - state.startTime ) < state.options.initialDelay;

        // Clean up the state
        cleanupElementState( element, state, event, isShortPress, isClick );
    }


    /**
     * Handles the timed sequence of hold events.
     * @param {HTMLElement} element - The target element.
     * @param {Object} state - The current state from elementStates.
     * @param {Event} originalEvent - The original browser event.
     * @param {Object} options - The configured options.
     */
    function startHoldSequence( element, state, originalEvent, options ) {
        const $element = $( element );

        state.initialTimer = setTimeout( () => {

            // Initial trigger (holdstart + first iteration)
            $element.trigger( $.Event( "holdstart", {
                originalEvent: originalEvent,
                startTime: state.startTime,
            } ) );
            triggerHoldEvent( element, 0, originalEvent );

            // Phase 2: Start the repeat cycle
            const repeatHandler = () => {

                state.holdTime = Date.now() - state.startTime;

                state.iteration++;

                // Stop looping after maxIterations or maxDuration
                if ( state.iteration >= options.maxIterations ||
                    state.holdTime >= options.maxDuration ) {

                    const reason = state.iteration >= options.maxIterations ? "iteration limit" : "time limit";

                    // Trigger a holdrepeathalt event with the reason for the halt
                    $element.trigger( $.Event( "holdrepeathalt", {
                        haltReason: reason,
                        haltTime: Date.now(),
                        startTime: state.startTime,
                        iteration: state.iteration,
                    } ) );

                    // Just exit the repetition loop by stopping all timers and return.
                    // The element state will be cleaned (and the hold will end) when the 
                    // button is released or the touch ends or when the cursor leaves the
                    // element area
                    clearTimers( state );
                    return;
                }

                // Apply acceleration after accelerateAfter iterations
                if ( options.acceleration !== false &&
                    state.iteration >= options.accelerateAfter ) {
                    state.currentInterval = Math.max(
                        state.currentInterval * options.acceleration,
                        options.minRepeatInterval
                    );
                }

                // Trigger the hold event
                triggerHoldEvent( element, state.iteration, originalEvent );

                // Schedule the next iteration
                state.repeatTimer = setTimeout( repeatHandler, state.currentInterval );
            };

            // First call 
            state.repeatTimer = setTimeout( repeatHandler, state.currentInterval );

        }, options.initialDelay );
    }




    /**
     * Triggers the hold event with context.
     * @param {HTMLElement} element - The target element.
     * @param {number} iteration - The current iteration count.
     * @param {Event} originalEvent - The original browser event.
     */
    function triggerHoldEvent( element, iteration, originalEvent ) {
        const state = elementStates.get( element );
        $( element ).trigger( $.Event( "holdrepeat", {
            originalEvent: originalEvent,
            iteration: iteration,
            startTime: state.startTime,
            holdTime: state.holdTime,
            currentInterval: state.currentInterval,
            accelerating: ( state.options.acceleration !== false ) && state.iteration >= state.options.accelerateAfter,
        } ) );
    }

    /**
     * Handles the stop of the timers in the target element state
     * @param {HTMLElement} element - The target element.
     */
    function clearTimers( state ) {

        // Stop all timers
        clearTimeout( state.initialTimer );
        clearTimeout( state.repeatTimer );
    }

    /**
     * Handles the cleanup of the state and final events.
     * @param {HTMLElement} element - The target element.
     * @param {Object} state - The current state from the WeakMap.
     * @param {Event} event - The original event.
     * @param {boolean} isShortPress - Whether the press was shorter than the initial delay.
     * @param {boolean} isClick - Whether the event is a mouseup/touchend.
     */
    function cleanupElementState( element, state, event, isShortPress = false, isClick = false ) {

        // Stop all timers
        clearTimers( state );

        // Remove the native click listener at next event cycle
        abortControllerWithDelay( state.controller );

        // Final event logic
        if ( isShortPress && isClick ) {

            // Case A: Short press + mouseup/touchend -> trigger click
            $( element ).trigger( "click" );
        } else if ( !isShortPress ) {

            // Case B: Timer expired -> trigger holdstop (except if isLeave before the timer expires)
            const duration = Date.now() - state.startTime;
            $( element ).trigger( $.Event( "holdstop", {
                originalEvent: event,
                startTime: state.startTime,
                duration: duration,
                iterations: state.iteration
            } ) );
        }

        // Final cleanup
        elementStates.delete( element );
    }


    /**
     * Safely aborts the controller after the event loop.
     * @param {AbortController} controller - The AbortController instance.
     * @param {boolean} now - Whether to abort immediately or in the next event cycle.
     */
    function abortControllerWithDelay( controller, now = false ) {
        if ( controller?.signal?.aborted ) return;

        // Scheduled for next event cycle
        if ( now ) {
            controller?.abort();
        } else {
            setTimeout( () => controller?.abort(), 0 );
        }
    }


    /**
     * Finds the target element with delegation support.
     * @param {Event} event - The original event.
     * @returns {HTMLElement} - The target element.
     */
    function getTargetElement( event ) {
        const container = event.delegateTarget || event.currentTarget;
        const selectors = $( container ).data( "holdSelectors" ) || []; // Array di selettori

        // Cerca in TUTTI i selettori registrati
        for ( const selector of selectors ) {
            const target = $( event.target ).closest( selector )[ 0 ];
            if ( target ) return target;
        }

        return event.currentTarget;
    }

    /**
     * Normalizes and validates the options.
     * @param {Object} options - The options to normalize.
     * @returns {Object} - The normalized options.
     */
    function normalizeOptions( options ) {

        const id = Math.max( 0, parseInt( options.initialDelay ) || defaults.initialDelay );
        const ri = Math.max( 50, parseInt( options.repeatInterval ) || defaults.repeatInterval );

        return {
            initialDelay: id,
            repeatInterval: ri,
            preventScrollOnTouch: !!options.preventScrollOnTouch,
            acceleration: typeof options.acceleration === "number" ?
                Math.min( 1, Math.max( 0, options.acceleration ) ) : false,
            accelerateAfter: Math.max( 1, parseInt( options.accelerateAfter ) || defaults.accelerateAfter ),
            minRepeatInterval: Math.max( 10, parseInt( options.minRepeatInterval ) || defaults.minRepeatInterval ),
            maxIterations: Math.max( 1, parseInt( options.maxIterations ) ) || Infinity,
            maxDuration: Math.max( id + ri, parseInt( options.maxDuration ) ) || Infinity,
        };
    }


    /**
     * jQuery special event setup for "holdrepeat".
     */
    $.event.special.holdrepeat = {
        setup: function( data ) { /* empty */ },
        teardown: function() { /* empty */ },

        /**
         * Adds event handlers for the "holdrepeat" event.
         * @param {Object} handleObj - The event handler object.
         */
        add: function( handleObj ) {

            const options = normalizeOptions(
                $.extend( {}, defaults, handleObj.data )
            );
            const selector = handleObj.selector;
            const container = this;

            // Add the selector to the array (only for delegated elements)
            if ( selector ) {
                const selectors = $( container ).data( "holdSelectors" ) || [];
                if ( !selectors.includes( selector ) ) {
                    $( container ).data( "holdSelectors", [ ...selectors, selector ] );
                }
            }

            // Safe namespace
            const eventNamespace = selector ?
                `.hold_${selector.replace(/[^a-z0-9]/gi, '')}` :
                '';

            $( container )
                .data( "holdOptions", options )
                .on( `mousedown${eventNamespace} touchstart${eventNamespace}`, selector || null, handleStart )
                .on( `mouseup${eventNamespace} mouseleave${eventNamespace} touchend${eventNamespace} touchcancel${eventNamespace}`, selector || null, handleEnd );
        },

        /**
         * Removes event handlers for the "holdrepeat" event.
         * @param {Object} handleObj - The event handler object.
         */
        remove: function( handleObj ) {
            const selector = handleObj.selector;
            const container = this;

            // Remove the selector from the array
            const selectors = $( container ).data( "holdSelectors" ) || [];
            $( container ).data( "holdSelectors", selectors.filter( s => s !== selector ) );

            // Unique namespace to remove events
            const eventNamespace = `.hold_${selector.replace(/[^a-z0-9]/g, '')}`;

            $( container )
                .off( `mousedown${eventNamespace} touchstart${eventNamespace}` )
                .off( `mouseup${eventNamespace} mouseleave${eventNamespace} touchend${eventNamespace} touchcancel${eventNamespace}` );
        },
    };

} )( jQuery );