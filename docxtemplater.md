Installation
The first step is to install Docxtemplater and PizZip via npm.

Both libraries are developed by our team.

npm install --save docxtemplater pizzip

Usage
First, download the input.docx file and place it in a folder. This file serves as your "template" and includes two tags: {last_name} and {first_name}.

Next, create a new file named your_script_name.js in the same folder as the template. This file will contain the script that generates the document.

Copy the following code into your_script_name.js:

// Load our library that generates the document
const Docxtemplater = require("docxtemplater");
// Load PizZip library to load the docx/pptx/xlsx file in memory
const PizZip = require("pizzip");

// Builtin file system utilities
const fs = require("fs");
const path = require("path");

// Load the docx file as binary content
const content = fs.readFileSync(
    path.resolve(__dirname, "input.docx"),
    "binary"
);

// Unzip the content of the file
const zip = new PizZip(content);

/*
 * Parse the template.
 * This function throws an error if the template is invalid,
 * for example, if the template is "Hello {user" (missing closing tag)
 */
const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
});

/*
 * Render the document : Replaces :
 * - {first_name} with John
 * - {last_name} with Doe,
 * ...
 */
doc.render({
    first_name: "John",
    last_name: "Doe",
    phone: "+33666666",
    description: "The Acme Product",
});

/*
 * Get the output document and export it as a Node.js buffer
 * This method is available since docxtemplater@3.62.0
 */
const buf = doc.toBuffer();

// Write the Buffer to a file
fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);
/*
 * Instead of writing it to a file, you could also
 * let the user download it, store it in a database,
 * on AWS S3, ...
 */
This code uses sample data for the {first_name} and
{last_name}placeholders.

Navigate to the folder containing your script using the command line and run your_script_name.js with Node.js:

node your_script_name.js
After running this command, you will find an output.docx file in the same folder, with the {first_name} tag replaced by "John" and the {last_name} tag replaced by "Doe".

Congratulations!

Get list of placeholders
To be able to construct a form dynamically or to validate the document beforehand, it can be useful to get access to all placeholders defined in a given template. Before rendering a document, docxtemplater parses the Word document into a compiled form. In this compiled form, the document is stored in an AST which contains all the necessary information to get the list of the variables and list them in a JSON object.

With the simple inspection module, it is possible to get this compiled form and show the list of tags. suite:

const InspectModule = require("docxtemplater/js/inspect-module.js");
const iModule = InspectModule();
const doc = new Docxtemplater(zip, {
    modules: [iModule],
    linebreaks: true,
    paragraphLoop: true,
});
doc.render(/* data */);
const tags = iModule.getAllTags();
console.log(tags);
/*
 * After getting the tags, you can render the document like this:
 * doc.render(data);
 */