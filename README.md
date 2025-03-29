# sight-translation - a scroller app for simultaneous interpreting training
_Scroller_ is a web-based tool for trainers and students in simultaneous interpreting, designed to practice and objectively evaluate sight translation performance. It simulates real-time speech flow by scrolling text at customizable speeds in words-per-minute ([WPM](https://en.wikipedia.org/wiki/Words_per_minute)), offering objective performance tracking and adaptive display settings.
Users can load or paste text, adjust scrolling speed (WPM), and customize readability (font size, line spacing) during exercises. Real-time metrics (elapsed/remaining time) and pause/resume functionality are included.
This tool has been conceived and developed for the Department of Interpretation and Translation (DIT) at the University of Bologna by Gabriele Carioli.

## Key Features  
- **Controlled Scrolling**: 
  - Adjust speed in *words-per-minute (WPM)* to mimic speech pacing.  
  - Pause/resume functionality.  
- **Real-Time Metrics**: elapsed/remaining time (objective, clock-based measurement, independent of window size and screen resolution).
- **Display Customization and Accessibility**: Modify font size and line spacing, and text scrolling rate *during* exercises.  
- **Text Preparation**: Format raw text via TinyMCE (bold, headings, etc.) before scrolling.
- **Localization**: Interface localization is available in italian, english, spanish (german, french and russian are on the way).

## Use Cases  
- **Didactics**: Trainers evaluate students under standardized conditions (same text/WPM, independently from windows size and screen resolution).  
- **Self-Training**: Interpreters practice pacing and adaptability.  
- **Assessment**: Objective benchmarks for speed/accuracy in interpretation exams.

## Privacy
It entirely runs on your browser. Technical cookies are stored to save user interface preferences.

## Compatibility
Works with modern browsers such as Chrome and derivatives, Firefox, Safari, both on computers and mobile devices.

## Dependencies
- JQuery 3.x (via CDN)
- Bootstrap 5.x (via CDN)
- FontAwesome 4.x (via CDN)
- I18Next (via CDN)
- TinyMCE 7.x (via CDN)
- TinyMCE community localizations (local)
- JS.Cookie (https://github.com/js-cookie/js-cookie, local)
- Flag-Icons (https://github.com/lipis/flag-icons, local)
- Toastr.JS (https://github.com/CodeSeven/toastr, local)
- jquery-event-holdrepeat (https://github.com/bilo1967/jquery-event-holdrepeat, local)

## Demo
You can test/use it from our website: [scroller.ditlab.it](https://scroller.ditlab.it/)

## Setup  
1. Create a local directory or the document root for a web site
2. Enter your directory
3. Clone the repo:  
   ```bash  
   git clone https://github.com/bilo1967/sight-translation .
   ```
4. Point your browser to your directory or web site
5. Enjoy
