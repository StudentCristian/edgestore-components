// Defining a data model.
class Resume {
  markdown string
}

// Create a function to extract the resume from a string.
function ExtractResume(resume: string) -> Resume {
  // Specify a client as provider/model-name
  // you can use custom LLM params with a custom client name from clients.baml like "client CustomHaiku"
  client Gemini  
  prompt #"
    Adaptar a la sintaxis markdown vas a transcribir en el schema markdown 
    {{ resume }}

    {{ ctx.output_format }}
  "#
}

// Test the function with a sample resume. Open the VSCode playground to run this.
test vaibhav_resume {
  functions [ExtractResume]
  args {
    resume #"
      # This is header for diagram below

      ```mermaid
        graph TD;
            A-->B;
            A-->C;
            B-->D;
            C-->D;
      ```
    "#
  }
}
