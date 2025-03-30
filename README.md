# sight-translation - A Scroller App for Simultaneous Interpreting Training  

**Scroller** is a web-based tool for trainers and students in simultaneous interpretation, designed to practice and objectively evaluate sight translation performance. It simulates real-time speech flow by scrolling text at customizable speeds (measured in *Words Per Minute - WPM*), offering objective performance tracking and adaptive display settings.  

Developed for the [Department of Interpretation and Translation (DIT)](https://dit.unibo.it/) at the University of Bologna by **Gabriele Carioli**.  

**Live Demo**: [scroller.ditlab.it](https://scroller.ditlab.it/)  

---

## Key Features  

- **Controlled Scrolling**:  
  - Adjust speed in *words-per-minute (WPM)* to mimic speech pacing.  
  - Pause/resume functionality.  
- **Real-Time Metrics**:  
  - Clock-based tracking of elapsed/remaining time (independent of screen resolution or window size).  
- **Display Customization**:  
  - Modify font size, line spacing, and scrolling speed during exercises.  
- **Text Preparation**:  
  - Format raw text using TinyMCE (bold, headings, lists) before starting.  
- **Localization**:  
  - Interface available in Italian, English, and Spanish (German, French, Russian in progress).  

---

## Use Cases  

- **Didactics**: Trainers evaluate students under standardized conditions (same text and WPM for all).  
- **Self-Training**: Interpreters practice pacing, accuracy, and adaptability.  
- **Assessment**: Objective benchmarks for speed/accuracy in exams.  

---

## Privacy  

- Runs entirely in the browser (no server-side processing).  
- Stores only technical cookies (e.g., UI preferences like language or font size).  

---

## Compatibility  

- **Browsers**: Modern browsers (Chrome, Firefox, Safari).  
- **Devices**: Desktop, tablet, and mobile.  

---

## Setup  

1. Create a web directory or use your document root.  
2. Clone the repository:  
   ```bash  
   git clone https://github.com/bilo1967/sight-translation .  
   ```  
3. Deploy files to your web server.  
4. Access via browser (e.g., `http://localhost/`).  

---

## Dependencies / Third-party libraries 

- **CDN-Hosted**:  
  - jQuery 3.x  
  - Bootstrap 5.x  
  - FontAwesome 4.x  
  - i18Next  
  - TinyMCE 7.x  

- **Local Files**:  
  - TinyMCE community localizations  
  - [js-cookie](https://github.com/js-cookie/js-cookie)  
  - [flag-icons](https://github.com/lipis/flag-icons)  
  - [toastr.js](https://github.com/CodeSeven/toastr)  
  - [jquery-event-holdrepeat](https://github.com/bilo1967/jquery-event-holdrepeat)  

---

## License & Attribution  

- Developed for the University of Bologna’s DIT department by Gabriele Carioli. 
- Available under MIT license.
- Third-party libraries follow their respective licenses.  

---

**Feedback?** Open an issue or contact [Gabriele Carioli](https://www.unibo.it/UniboWeb/UniboSearch/Rubrica.aspx?tab=FullTextPanel&lang=it&tipo=people&query=gabriele+carioli).  
