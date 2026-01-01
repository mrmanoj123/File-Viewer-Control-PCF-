# File-Viewer-Control-PCF-
File Viewer Control – Power Apps Component Framework (PCF)

This repository contains Version 1 of a custom File Viewer / File Upload control built using Power Apps Component Framework (PCF).

The control is implemented using pure TypeScript, JavaScript, and CSS, with a focus on clarity, maintainability, and predictable behavior when integrating with Power Apps (Canvas Apps).

🚀 Overview

Power Apps out-of-the-box file controls have several limitations when it comes to validation, preview, and customization.
This PCF control is designed to extend those capabilities while keeping the implementation transparent and easy to troubleshoot.

This project follows an iterative approach, starting with core functionality and laying a solid foundation for future enhancements.

✨ Features (v1)

📂 Single & multiple file upload support

✅ File type validation

📏 File size validation

👀 Runtime file preview (where supported by the browser)

🗑 File removal before submission

🔄 Base64 conversion using the FileReader API

📝 Displays file metadata

File name

File type

File size

Last modified date

⚙️ Configurable behavior using PCF properties

📤 Canvas App–friendly outputs using structured JSON

🛠 Technology Stack

Power Apps Component Framework (PCF)

TypeScript

JavaScript

CSS

Browser FileReader API

No external frameworks are used in this version to keep the logic easy to understand and debug.

🧠 Design Considerations

From a technical perspective, this control was designed to:

Address real-world limitations of standard Power Apps file controls

Provide clear validation feedback and predictable UX

Keep file handling logic explicit and debuggable

Ensure clean data flow between PCF and Canvas Apps

Support future enhancements without refactoring core logic

🔌 Integration with Power Apps

The control exposes file information as JSON output

Canvas Apps can parse the output using ParseJSON()

Validation state can be consumed by the app to:

Block submission

Show notifications

Control business logic

📌 Current Limitations

Preview support depends on browser capabilities (e.g., PDFs, images)

Office documents (Word, Excel) rely on browser handling or download

This version focuses on core functionality rather than advanced UI frameworks

🧭 Roadmap (Planned Enhancements)

Enhanced preview support

Improved accessibility and UX refinements

Optional React / Fluent UI version

Performance optimizations for large files

Extended configuration options

🤝 Contributions & Feedback

This is an evolving project.
Feedback, suggestions, and improvements are welcome.

If you’re working with Power Apps, PCF, or custom file handling scenarios, feel free to explore, fork, or raise issues.

📬 Author

Manoj
Power Apps | PCF | SharePoint | Power Platform
Open to technical consulting, freelancing, and troubleshooting engagements
