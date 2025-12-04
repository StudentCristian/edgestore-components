---
title: 🏠 Welcome
description: The easiest way to use LLMs
slug: home
layout: overview
hide-toc: false
---

**BAML is a domain-specific language to generate structured outputs from LLMs -- with the best developer experience.**

With BAML you can build reliable Agents, Chatbots with RAG, extract data from PDFs, and more.

### A small sample of features:
1. **An amazingly fast developer experience** for prompting in the BAML VSCode playground
2. **Fully type-safe outputs**, even when streaming structured data (that means autocomplete!)
3. **Flexibility** -- it works with **any LLM**, **any language**, and **any schema**.
4. **State-of-the-art structured outputs** that even [outperform OpenAI with their own models](https://www.boundaryml.com/blog/sota-function-calling?q=0) -- plus it works with OpenSource models.


## Products

<Cards cols={2}>
  <Card
    title="Guide"
    icon="fa-regular fa-pen"
    href="/guide/introduction/what-is-baml"
  >
    Everything you need to know about how to get started with BAML. From installation to prompt engineering techniques.
  </Card>
  <Card
    title="Playground"
    icon="fa-regular fa-browser"
    href="https://promptfiddle.com"
  >
    An online interactive playground to playaround with BAML without any installations.
  </Card>
  <Card
    title="Examples"
    icon="fa-regular fa-grid-2"
    href="/examples"
  >
    Examples of prompts, projects, and more.
  </Card>
  <Card
    title="Reference"
    icon="fa-regular fa-code"
    href="/ref"
  >
    Language docs on all BAML syntax. Quickly learn syntax with simple examples and code snippets.
  </Card>
</Cards>

## Motivation

Prompts are more than just f-strings; they're actual functions with logic that can quickly become complex to organize, maintain, and test.

Currently, developers craft LLM prompts as if they're writing raw HTML and CSS in text files, lacking:
- Type safety
- Hot-reloading or previews
- Linting

The situation worsens when dealing with structured outputs. Since most prompts rely on Python and Pydantic, developers must _execute_ their code and set up an entire Python environment just to test a minor prompt adjustment, or they have to setup a whole Python microservice just to call an LLM.

BAML allows you to view and run prompts directly within your editor, similar to how Markdown Preview function -- no additional setup necessary, that interoperates with all your favorite languages and frameworks.

Just as TSX/JSX provided the ideal abstraction for web development, BAML offers the perfect abstraction for prompt engineering. Watch our [demo video](/guide/introduction/what-is-baml#demo-video) to see it in action.

## Comparisons

Here's our in-depth comparison with a couple of popular frameworks:
- [BAML vs Pydantic](/guide/comparisons/baml-vs-pydantic)
- [BAML vs Marvin](/guide/comparisons/baml-vs-marvin)

{/* 
<div className="motivation">
  Insert something powerful here.
</div>

<ButtonGroup>
<Button href="https://calendly.com/boundary-founders/connect-45" intent="primary" rightIcon="arrow-right" large>
  Schedule a demo with our team!
</Button>

<Button href="https://buildwithfern.com/showcase" minimal large>
  View our showcase
</Button>
</ButtonGroup> */} 

<Note>You can check out this repo: https://github.com/BoundaryML/baml-examples/tree/main/nextjs-starter</Note>

To set up BAML with Typescript do the following:

<Steps>
  ### Install BAML VSCode/Cursor Extension
      https://marketplace.visualstudio.com/items?itemName=boundary.baml-extension

      - syntax highlighting
      - testing playground
      - prompt previews

  ### Install BAML
      <CodeBlocks>
        ```bash npm
        npm install @boundaryml/baml
        ```

        ```bash pnpm
        pnpm add @boundaryml/baml
        ```

        ```bash yarn
        yarn add @boundaryml/baml
        ```

        ```bash bun
        bun add @boundaryml/baml
        ```

        ```bash deno
        deno install npm:@boundaryml/baml
        ```
    </CodeBlocks>

  ### Add BAML to your existing project
      This will give you some starter BAML code in a `baml_src` directory.

      <CodeBlocks>
        ```bash npm
        npx baml-cli init
        ```

        ```bash pnpm
        pnpm exec baml-cli init
        ```

        ```bash yarn
        yarn baml-cli init
        ```

        ```bash bun
        bun baml-cli init
        ```

        ```bash deno
        deno run -A npm:@boundaryml/baml/baml-cli init
        ```
    </CodeBlocks>

  ### Generate the `baml_client` typescript package from `.baml` files

    One of the files in your `baml_src` directory will have a [generator block](/ref/baml/generator). This tells BAML how to generate the `baml_client` directory, which will have auto-generated typescript code to call your BAML functions.

    <CodeBlocks>
      ```bash npm
      npx baml-cli generate
      ```

      ```bash pnpm
      pnpm exec baml-cli generate
      ```

      ```bash yarn
      yarn baml-cli generate
      ```

      ```bash bun
      bun baml-cli generate
      ```

      ```bash deno
      deno run -A npm:@boundaryml/baml/baml-cli generate
      # You may need to use the --unstable-sloppy-imports flag if you get an error about ESM
      # https://github.com/BoundaryML/baml/issues/1213#issuecomment-2526200783

      ```
    </CodeBlocks>

    <Note>
      If you need baml_client to be 'ESM' compatible, you can add the following `generator` configuration to your `.baml` file:

      ```baml
      generator typescript {
        ...
        module_format "esm" // the default is "cjs" for CommonJS
      }
      ```
    </Note>

    You can modify your `package.json` so you have a helper prefix in front of your build command.

    ```json package.json
    {
      "scripts": {
        // Add a new command
        "baml-generate": "baml-cli generate",
        // Always call baml-generate on every build.
        "build": "npm run baml-generate && tsc --build",
      }
    }
    ```

    See [What is baml_src](/guide/introduction/baml_src) to learn more about how this works.
    <img src="/assets/languages/baml-to-ts.png" />


    <Tip>
      If you set up the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=Boundary.baml-extension), it will automatically run `baml-cli generate` on saving a BAML file.
    </Tip>

  ### Use a BAML function in Typescript!
    <Error>If `baml_client` doesn't exist, make sure to run the previous step! </Error>

    <CodeBlocks>
    ```typescript index.ts
    import { b } from "./baml_client"
    import type { Resume } from "./baml_client/types"

    async function Example(raw_resume: string): Promise<Resume> {
      // BAML's internal parser guarantees ExtractResume
      // to be always return a Resume type
      const response = await b.ExtractResume(raw_resume);
      return response;
    }

    async function ExampleStream(raw_resume: string): Promise<Resume> {
      const stream = b.stream.ExtractResume(raw_resume);
      for await (const msg of stream) {
        console.log(msg) // This will be a Partial<Resume> type
      }

      // This is guaranteed to be a Resume type.
      return await stream.getFinalResponse();
    }
    ```

    ```typescript sync_example.ts
    import { b } from "./baml_client/sync_client"
    import type { Resume } from "./baml_client/types"

    function Example(raw_resume: string): Resume {
      // BAML's internal parser guarantees ExtractResume
      // to be always return a Resume type
      const response = b.ExtractResume(raw_resume);
      return response;
    }

    // Streaming is not available in the sync_client.

    ```
    </CodeBlocks>
</Steps>

---
title: Set Environment Variables
slug: /guide/development/environment-variables
---



## Environment Variables in BAML

Sometimes you'll see environment variables used in BAML, like in clients:

```baml

client<llm> GPT4o {
  provider baml-openai-chat
  options {
    model gpt-4o
    api_key env.OPENAI_API_KEY
  }
}
```

<Markdown src="/snippets/setting-env-vars.mdx" />

## Setting LLM API Keys per Request
You can set the API key for an LLM dynamically by passing in the key as a header or as a parameter (depending on the provider), using the [ClientRegistry](/guide/baml-advanced/llm-client-registry).

---
slug: /guide/development/terminal-logs
---
You can add logging to determine what the BAML runtime is doing when it calls LLM endpoints and parses responses.

To enable logging, set the `BAML_LOG` environment variable:
```sh
# default is warn
BAML_LOG=info
```

| Level | Description |
|-------|-------------|
| `error` | Fatal errors by BAML |
| `warn` | Logs any time a function fails (includes LLM calling failures, parsing failures) |
| `info` | Logs every call to a function (including prompt, raw response, and parsed response) |
| `debug` | Requests and detailed parsing errors (warning: may be a lot of logs) |
| `trace` | Everything and more |
| `off` | No logging |


Example log:
<img src="/assets/terminal-logs/log_message.png" />

---

Since `>0.54.0`:

To truncate each log entry to a certain length, set the `BOUNDARY_MAX_LOG_CHUNK_CHARS` environment variable:

```sh
BOUNDARY_MAX_LOG_CHUNK_CHARS=3000
```

This will truncate each part in a log entry to 3000 characters.

---
slug: /guide/development/upgrade-baml-versions
title: Upgrading BAML / Fixing Version Mismatches
---

Remember that the generated `baml_client` code is generated by your `baml_py` / `@boundaryml/baml` package dependency (using `baml-cli generate`), but can also be generated by the VSCode extension when you save a BAML file.

**To upgrade BAML versions:**
1. Update the `generator` clause in your `generators.baml` file (or wherever you have it defined) to the new version. If you ran `baml-cli init`, one has already been generated for you!
```baml generators.baml
generator TypescriptGenerator {
    output_type "typescript"
    ....
    // Version of runtime to generate code for (should match the package @boundaryml/baml version)
    version "0.62.0"
}
```

2. Update your `baml_py`  / `@boundaryml/baml` package dependency to the same version.


<CodeBlock>
```sh pip
pip install --upgrade baml-py
```
```sh npm
npm install @boundaryml/baml@latest
```

```sh ruby
gem install baml
```
</CodeBlock>

3. Update VSCode BAML extension to point to the same version. Read here for how to keep VSCode in sync with your `baml_py` / `@boundaryml/baml` package dependency: [VSCode BAML Extension reference](/ref/editor-extension-settings/baml-cli-path)

You only need to do this for minor version upgrades (e.g., 0.54.0 -> 0.62.0), not patch versions (e.g., 0.62.0 -> 0.62.1).



## Troubleshooting

See the [VSCode BAML Extension reference](/ref/editor-extension-settings/baml-cli-path) for more information on how to prevent version mismatches.

---
title: Concurrent function calls
slug: /guide/baml-basics/concurrent-calls
---


We’ll use `function ClassifyMessage(input: string) -> Category` for our example:

<Accordion title="classify-message.baml">
```baml
enum Category {
    Refund
    CancelOrder
    TechnicalSupport
    AccountIssue
    Question
}

function ClassifyMessage(input: string) -> Category {
  client GPT4o
  prompt #"
    Classify the following INPUT into ONE
    of the following categories:

    INPUT: {{ input }}

    {{ ctx.output_format }}

    Response:
  "#
}
```
</Accordion>

<Tabs>
<Tab title="Python">

You can make concurrent `b.ClassifyMessage()` calls like so:

```python main.py
import asyncio

from baml_client.async_client import b
from baml_client.types import Category

async def main():
    await asyncio.gather(
        b.ClassifyMessage("I want to cancel my order"),
        b.ClassifyMessage("I want a refund")
    )

if __name__ == '__main__':
    asyncio.run(main())
```
</Tab>

<Tab title="TypeScript">

You can make concurrent `b.ClassifyMessage()` calls like so:

```ts main.ts
import { b } from './baml_client'
import { Category } from './baml_client/types'
import assert from 'assert'

const main = async () => {
  const category = await Promise.all(
    b.ClassifyMessage('I want to cancel my order'),
    b.ClassifyMessage('I want a refund'),
  )
}

if (require.main === module) {
  main()
}

```
</Tab>

<Tab title="Ruby (beta)">

BAML Ruby (beta) does not currently support async/concurrent calls.

Please [contact us](/contact) if this is something you need.

</Tab>
</Tabs>


When BAML raises an exception, it will be an instance of a subclass of `BamlError`. This allows you to catch all BAML-specific exceptions with a single `except` block.

## Example
<CodeGroup>
```python Python
from baml_client import b
from baml_py.errors import BamlError, BamlInvalidArgumentError, BamlClientError, BamlClientHttpError, BamlValidationError

try:
  b.CallFunctionThatRaisesError()
except BamlError as e:
  print(e)


try:
  b.CallFunctionThatRaisesError()
except BamlValidationError as e:
  # The original prompt sent to the LLM
  print(e.prompt)
  # The LLM response string
  print(e.raw_output)
  # A human-readable error message
  print(e.message)
```


```typescript TypeScript
import { b } from './baml_client'
// For catching parsing errors, you can import this
import { BamlValidationError, BamlClientFinishReasonError } from '@boundaryml/baml'
// The rest of the BAML errors contain a string that is prefixed with:
// "BamlError:"
// Subclasses are sequentially appended to the string.
// For example, BamlInvalidArgumentError is returned as:
// "BamlError: BamlInvalidArgumentError:"
// Or, BamlClientHttpError is returned as:
// "BamlError: BamlClientError: BamlClientHttpError:"


async function example() {
  try {
    await b.CallFunctionThatRaisesError()
  } catch (e) {
    if (e instanceof BamlValidationError || e instanceof BamlClientFinishReasonError) {
      // You should be lenient to these fields missing.
      // The original prompt sent to the LLM
      console.log(e.prompt)
      // The LLM response string
      console.log(e.raw_output)
      // A human-readable error message
      console.log(e.message)
    } else {
      // Handle other BAML errors
      console.log(e)
    }
  }
}

```

```ruby Ruby
# Example coming soon
```  
</CodeGroup>


## BamlError

Base class for all BAML exceptions.  

<ParamField
  path="message"
  type="string"
>
  A human-readable error message.
</ParamField>

### BamlInvalidArgumentError

Subclass of `BamlError`.

Raised when one or multiple arguments to a function are invalid.

### BamlClientError

Subclass of `BamlError`.

Raised when a client fails to return a valid response.

<Warning>
In the case of aggregate clients like `fallback` or those with `retry_policy`, only the last client's error is raised.  
</Warning>

#### BamlClientHttpError

Subclass of `BamlClientError`.

Raised when the HTTP request made by a client fails with a non-200 status code.

<ParamField
  path="status_code"
  type="int"
>
  The status code of the response.

Common status codes are:

- 1: Other
- 2: Other
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error
</ParamField>


#### BamlClientFinishReasonError

Subclass of `BamlClientError`.

Raised when the finish reason of the LLM response is not allowed.

<ParamField
  path="finish_reason"
  type="string"
>
  The finish reason of the LLM response.
</ParamField>

<ParamField
  path="message"
  type="string"
>
  An error message.
</ParamField>

<ParamField
  path="prompt"
  type="string"
>
  The original prompt that was sent to the LLM, formatted as a plain string. Images sent as base64-encoded strings are not serialized into this field.
</ParamField>

<ParamField
  path="raw_output"
  type="string"
>
  The raw text from the LLM that failed to parse into the expected return type of a function.
</ParamField>

### BamlValidationError

Subclass of `BamlError`.

Raised when BAML fails to parse a string from the LLM into the specified object.

<ParamField
  path="raw_output"
  type="string"
>
  The raw text from the LLM that failed to parse into the expected return type of a function.
</ParamField>

<ParamField
  path="message"
  type="string"
>
  The parsing-related error message.
</ParamField>

<ParamField
  path="prompt"
  type="string"
>
  The original prompt that was sent to the LLM, formatted as a plain string. Images sent as base64-encoded strings are not serialized into this field.
</ParamField>

---
slug: /guide/baml-basics/multi-modal
---

## Multi-modal input

You can use `audio` or `image` input types in BAML prompts. Just create an input argument of that type and render it in the prompt.

Check the "raw curl" checkbox in the playground to see how BAML translates multi-modal input into the LLM Request body.

```baml
// "image" is a reserved keyword so we name the arg "img"
function DescribeMedia(img: image) -> string {
  client openai/gpt-4o
  // Most LLM providers require images or audio to be sent as "user" messages.
  prompt #"
    {{_.role("user")}}
    Describe this image: {{ img }}
  "#
}

// See the "testing functions" Guide for more on testing Multimodal functions
test Test {
  functions [DescribeMedia]
  args {
    img {
      url "https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png"
    }
  }
}
```
See how to [test images in the playground](/guide/baml-basics/testing-functions#images).

## Try it! Press 'Run Test' below!
 <div class="resizer">
<iframe
  class="resized"
  src="https://promptfiddle.com/embed?id=multimodal"
 
  height="640"
  style="border: none;"
  resize="both"
  overflow="auto"
  msallowfullscreen
></iframe>
</div>


## Calling Multimodal BAML Functions

#### Images
Calling a BAML function with an `image` input argument type (see [image types](/ref/baml/types#image))

The `from_url` and `from_base64` methods create an `Image` object based on input type.
<CodeBlocks>
```python Python
from baml_py import Image
from baml_client import b

async def test_image_input():
  # from URL
  res = await b.TestImageInput(
      img=Image.from_url(
          "https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png"
      )
  )

  # Base64 image
  image_b64 = "iVBORw0K...."
  res = await b.TestImageInput(
    img=Image.from_base64("image/png", image_b64)
  )
```

```typescript TypeScript
import { b } from '../baml_client'
import { Image } from "@boundaryml/baml"
...

  // URL
  let res = await b.TestImageInput(
    Image.fromUrl('https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png'),
  )

  // Base64
  const image_b64 = "iVB0R..."
  let res = await b.TestImageInput(
    Image.fromBase64('image/png', image_b64),
  )
  
```

```ruby Ruby (beta)
we're working on it!
```

</CodeBlocks>
 
### Audio
Calling functions that have `audio` types. See [audio types](/ref/baml/types#audio)

<CodeBlocks>
```python Python
from baml_py import Audio
from baml_client import b

async def run():
  # from URL
  res = await b.TestAudioInput(
      img=Audio.from_url(
          "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg"
      )
  )

  # Base64
  b64 = "iVBORw0K...."
  res = await b.TestAudioInput(
    audio=Audio.from_base64("audio/ogg", b64)
  )
```

```typescript TypeScript
import { b } from '../baml_client'
import { Audio } from "@boundaryml/baml"
...

  // URL
  let res = await b.TestAudioInput(
    Audio.fromUrl('https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg'),
  )

  // Base64
  const audio_base64 = ".."
  let res = await b.TestAudioInput(
    Audio.fromBase64('audio/ogg', audio_base64),
  )
  
```

```ruby Ruby (beta)
we're working on it!
```
</CodeBlocks>

---
title: Prompting in BAML
---

<Note>
We recommend reading the [installation](/guide/installation-language/python) instructions first
</Note>

BAML functions are special definitions that get converted into real code (Python, TS, etc) that calls LLMs. Think of them as a way to define AI-powered functions that are type-safe and easy to use in your application.

### What BAML Functions Actually Do
When you write a BAML function like this:

```rust BAML
function ExtractResume(resume_text: string) -> Resume {
  client "openai/gpt-4o"
  // The prompt uses Jinja syntax.. more on this soon.
  prompt #"
     Extract info from this text.

    {# special macro to print the output schema + instructions #}
    {{ ctx.output_format }}

    Resume:
    ---
    {{ resume_text }}
    ---
  "#
}
```

BAML converts it into code that:

1. Takes your input (`resume_text`)
2. Sends a request to OpenAI's GPT-4 API with your prompt.
3. Parses the JSON response into your `Resume` type
4. Returns a type-safe object you can use in your code

### Prompt Preview + seeing the CURL request
For maximum transparency, you can see the API request BAML makes to the LLM provider using the VSCode extension.
Below you can see the **Prompt Preview**, where you see the full rendered prompt (once you add a test case):

<img src="/assets/vscode/extract-resume-prompt-preview.png" alt="Prompt preview" />

Note how the `{{ ctx.output_format }}` macro is replaced with the output schema instructions.

The Playground will also show you the **Raw CURL request** (if you click on the "curl" checkbox):

<img src="/assets/vscode/curl-preview.png" alt="Raw CURL request" />

<Warning>
Always include the `{{ ctx.output_format }}` macro in your prompt. This injects your output schema into the prompt, which helps the LLM output the right thing. You can also [customize what it prints](/ref/prompt-syntax/ctx-output-format).

One of our design philosophies is to never hide the prompt from you. You control and can always see the entire prompt.
</Warning>

## Calling the function
Recall that BAML will generate a `baml_client` directory in the language of your choice using the parameters in your [`generator`](/ref/baml/generator) config. This contains the function and types you defined.

Now we can call the function, which will make a request to the LLM and return the `Resume` object:
<CodeBlocks>
```python python
# Import the baml client (We call it `b` for short)
from baml_client import b
# Import the Resume type, which is now a Pydantic model!
from baml_client.types import Resume 

def main():
resume_text = """Jason Doe\nPython, Rust\nUniversity of California, Berkeley, B.S.\nin Computer Science, 2020\nAlso an expert in Tableau, SQL, and C++\n"""

    # this function comes from the autogenerated "baml_client".
    # It calls the LLM you specified and handles the parsing.
    resume = b.ExtractResume(resume_text)

    # Fully type-checked and validated!
    assert isinstance(resume, Resume)

```

```typescript typescript
import b from 'baml_client'
import { Resume } from 'baml_client/types'

async function main() {
  const resume_text = `Jason Doe\nPython, Rust\nUniversity of California, Berkeley, B.S.\nin Computer Science, 2020\nAlso an expert in Tableau, SQL, and C++`

  // this function comes from the autogenerated "baml_client".
  // It calls the LLM you specified and handles the parsing.
  const resume = await b.ExtractResume(resume_text)

  // Fully type-checked and validated!
  resume.name === 'Jason Doe'
  if (resume instanceof Resume) {
    console.log('resume is a Resume')
  }
}
```

```ruby ruby

require_relative "baml_client/client"
b = Baml.Client

# Note this is not async
res = b.TestFnNamedArgsSingleClass(
    myArg: Baml::Types::Resume.new(
        key: "key",
        key_two: true,
        key_three: 52,
    )
)
```

</CodeBlocks>


<Warning>
Do not modify any code inside `baml_client`, as it's autogenerated.
</Warning>

## Next steps

Checkout [PromptFiddle](https://promptfiddle.com) to see various interactive BAML function examples or view the [example prompts](/examples)

Read the next guide to learn more about choosing different LLM providers and running tests in the VSCode extension.

<CardGroup cols={2}>

  <Card title="Switching LLMs" icon="fa-solid fa-gears" href="/guide/baml-basics/switching-llms">

    Use any provider or open-source model

  </Card>

  <Card title="Testing Functions" icon="fa-solid fa-vial" href="/guide/baml-basics/testing-functions">

    Test your functions in the VSCode extension

  </Card>

  <Card title="Chat Roles" icon="fa-solid fa-comments" href="/examples/prompt-engineering/chat">

    Define user or assistant roles in your prompts

  </Card>

  <Card title="Function Calling / Tools" icon="fa-solid fa-toolbox" href="/examples/prompt-engineering/tools-function-calling">

    Use function calling or tools in your prompts

  </Card>

</CardGroup>

---
slug: /guide/baml-basics/streaming
---

BAML lets you stream in structured JSON output from LLMs as it comes in.

If you tried streaming in a JSON output from an LLM you'd see something like:
```
{"items": [{"name": "Appl
{"items": [{"name": "Apple", "quantity": 2, "price": 1.
{"items": [{"name": "Apple", "quantity": 2, "price": 1.50}], "total_cost":
{"items": [{"name": "Apple", "quantity": 2, "price": 1.50}], "total_cost": 3.00} # Completed
```

BAML gives you fine-grained control of how it fixes this partial JSON and transforms
it into a series of semantically valid partial objects.

<Tip>You can check out more examples (including streaming in FastAPI and NextJS) in the [BAML Examples] repo.</Tip>

[call BAML functions]: /docs/calling-baml/calling-functions
[BAML Examples]: https://github.com/BoundaryML/baml-examples/tree/main

Let's stream the output of this function `function ExtractReceiptInfo(email: string) -> ReceiptInfo` for our example:

<Accordion title="extract-receipt-info.baml">

```rust
class ReceiptItem {
  name string
  description string?
  quantity int
  price float
}

class ReceiptInfo {
    items ReceiptItem[]
    total_cost float?
}

function ExtractReceiptInfo(email: string) -> ReceiptInfo {
  client GPT4o
  prompt #"
    Given the receipt below:

    {{ email }}

    {{ ctx.output_format }}
  "#
}
```
</Accordion>

The BAML code generator creates a set of types in the `baml_client` library
in a module called `partial_types` in `baml_client`. These types are modified
from your original types to support streaming.

By default, BAML will convert all Class fields into nullable fields, and
fill those fields with non-null values as much as possible given the tokens
received so far.

<Tabs>

<Tab title="Python">
BAML will generate `b.stream.ExtractReceiptInfo()` for you, which you can use like so:

```python main.py
import asyncio
from baml_client import b, partial_types, types

# Using a stream:
def example1(receipt: str):
    stream = b.stream.ExtractReceiptInfo(receipt)

    # partial is a Partial type with all Optional fields
    for partial in stream:
        print(f"partial: parsed {len(partial.items)} items (object: {partial})")

    # final is the full, original, validated ReceiptInfo type
    final = stream.get_final_response()
    print(f"final: {len(final.items)} items (object: {final})")

# Using only get_final_response() of a stream
#
# In this case, you should just use b.ExtractReceiptInfo(receipt) instead,
# which is slightly faster and more efficient.
def example2(receipt: str):
    final = b.stream.ExtractReceiptInfo(receipt).get_final_response()
    print(f"final: {len(final.items)} items (object: {final})")

# Using the async client:
async def example3(receipt: str):
    # Note the import of the async client
    from baml_client.async_client import b
    stream = b.stream.ExtractReceiptInfo(receipt)
    async for partial in stream:
        print(f"partial: parsed {len(partial.items)} items (object: {partial})")

    final = await stream.get_final_response()
    print(f"final: {len(final.items)} items (object: {final})")

receipt = """
04/14/2024 1:05 pm

Ticket: 220000082489
Register: Shop Counter
Employee: Connor
Customer: Sam
Item	#	Price
Guide leash (1 Pair) uni UNI
1	$34.95
The Index Town Walls
1	$35.00
Boot Punch
3	$60.00
Subtotal	$129.95
Tax ($129.95 @ 9%)	$11.70
Total Tax	$11.70
Total	$141.65
"""

if __name__ == '__main__':
    #uncomment one at a time and run to see the difference
    example1(receipt)
    #example2(receipt)
    #asyncio.run(example3(receipt))
```
</Tab>

<Tab title="TypeScript">
BAML will generate `b.stream.ExtractReceiptInfo()` for you, which you can use like so:

```ts main.ts
import { b } from './baml_client'

// Using both async iteration and getFinalResponse() from a stream
const example1 = async (receipt: string) => {
  const stream = b.stream.ExtractReceiptInfo(receipt)

  // partial is a Partial type with all Optional fields
  for await (const partial of stream) {
    console.log(`partial: ${partial.items?.length} items (object: ${partial})`)
  }

  // final is the full, original, validated ReceiptInfo type
  const final = await stream.getFinalResponse()
  console.log(`final: ${final.items.length} items (object: ${final})`)
}

// Using only async iteration of a stream
const example2 = async (receipt: string) => {
  for await (const partial of b.stream.ExtractReceiptInfo(receipt)) {
    console.log(`partial: ${partial.items?.length} items (object: ${partial})`)
  }
}

// Using only getFinalResponse() of a stream
//
// In this case, you should just use b.ExtractReceiptInfo(receipt) instead,
// which is faster and more efficient.
const example3 = async (receipt: string) => {
  const final = await b.stream.ExtractReceiptInfo(receipt).getFinalResponse()
  console.log(`final: ${final.items.length} items (object: ${final})`)
}

const receipt = `
04/14/2024 1:05 pm

Ticket: 220000082489
Register: Shop Counter
Employee: Connor
Customer: Sam
Item	#	Price
Guide leash (1 Pair) uni UNI
1	$34.95
The Index Town Walls
1	$35.00
Boot Punch
3	$60.00
Subtotal	$129.95
Tax ($129.95 @ 9%)	$11.70
Total Tax	$11.70
Total	$141.65
`

if (require.main === module) {
  example1(receipt)
  example2(receipt)
  example3(receipt)
}
```
</Tab>

<Tab title="Ruby (beta)">
BAML will generate `Baml.Client.stream.ExtractReceiptInfo()` for you,
which you can use like so:

```ruby main.rb
require_relative "baml_client/client"

$b = Baml.Client

# Using both iteration and get_final_response() from a stream
def example1(receipt)
  stream = $b.stream.ExtractReceiptInfo(receipt)

  stream.each do |partial|
    puts "partial: #{partial.items&.length} items"
  end

  final = stream.get_final_response
  puts "final: #{final.items.length} items"
end

# Using only iteration of a stream
def example2(receipt)
  $b.stream.ExtractReceiptInfo(receipt).each do |partial|
    puts "partial: #{partial.items&.length} items"
  end
end

# Using only get_final_response() of a stream
#
# In this case, you should just use BamlClient.ExtractReceiptInfo(receipt) instead,
# which is faster and more efficient.
def example3(receipt)
  final = $b.stream.ExtractReceiptInfo(receipt).get_final_response
  puts "final: #{final.items.length} items"
end

receipt = <<~RECEIPT
  04/14/2024 1:05 pm

  Ticket: 220000082489
  Register: Shop Counter
  Employee: Connor
  Customer: Sam
  Item  #  Price
  Guide leash (1 Pair) uni UNI
  1 $34.95
  The Index Town Walls
  1 $35.00
  Boot Punch
  3 $60.00
  Subtotal $129.95
  Tax ($129.95 @ 9%) $11.70
  Total Tax $11.70
  Total $141.65
RECEIPT

if __FILE__ == $0
  example1(receipt)
  example2(receipt)
  example3(receipt)
end
```

</Tab>
<Tab title="OpenAPI">

Streaming is not yet supported via OpenAPI, but it will be coming soon!

</Tab>
</Tabs>

<Note>
Number fields are always streamed in only when the LLM completes them. E.g. if
the final number is 129.95, you'll only see null or 129.95 instead of partial
numbers like 1, 12, 129.9, etc.
</Note>

## Semantic Streaming

BAML provides powerful attributes to control how your data streams, ensuring that partial values always maintain semantic validity. Here are the three key streaming attributes:

### `@stream.done`
This attribute ensures a type or field is only streamed when it's completely finished. It's useful when you need atomic, fully-formed values.

For example:
```baml
class ReceiptItem {
  name string
  quantity int
  price float

  // The entire ReceiptItem will only stream when complete
  @@stream.done
}

// Receipts is a list of ReceiptItems,
// each internal item will only stream when complete
type Receipts = ReceiptItem[]

class Person {
  // Name will only appear when fully complete,
  // until then it will be null
  name string @stream.done     
  // Numbers (floats and ints) will only appear
  // when fully complete by default
  age int                     
  // Bio will stream token by token
  bio string                  
}
```

### `@stream.not_null`
This attribute ensures a containing object is only streamed when this field has a value. It's particularly useful for discriminator fields or required metadata.

For example:
```baml
class Message {
  // Message won't stream until type is known
  type "error" | "success" | "info" @stream.not_null
  // Timestamp will only appear when fully complete
  // until then it will be null
  timestamp string @stream.done                       
  // Content can stream token by token
  content string                                      
}
```

### `@stream.with_state`
This attribute adds metadata to track if a field has finished streaming. It's perfect for showing loading states in UIs.

For example:
```baml
class BlogPost {
  // The blog post will only stream when title is known
  title string @stream.done @stream.not_null
  // The content will stream token by token, and include completion state
  content string @stream.with_state 
}
```

This will generate the following code in the `partial_types` module:
<Tabs>
<Tab title="Python">
```python
class StreamState(BaseModel, Generic[T]):
  value: T,
  state: "incomplete" | "complete"

class BlogPost(BaseModel):
  title: str
  content: StreamState[str | None]
```
</Tab>

<Tab title="Typescript">
```typescript
interface StreamState<T> {
  value: T,
  state: "incomplete" | "complete"
}

interface BlogPost {
  title: StreamState<string>
  content: StreamState<string>
}
```
</Tab>
</Tabs>

### Type Transformation Summary

Here's how these attributes affect your types in generated code:

| BAML Type                         | Generated Type (during streaming)              | Description                                    |
|----------------------------------|----------------------------|------------------------------------------------|
| `T`                               | `Partial[T]?`              | Default: Nullable and partial                   |
| `T @stream.done`                  | `T?`                       | Nullable but always complete when present       |
| `T @stream.not_null`              | `Partial[T]`               | Always present but may be partial              |
| `T @stream.done @stream.not_null` | `T`                        | Always present and always complete             |
| `T @stream.with_state`            | `StreamState[Partial[T]?]` | Includes streaming state metadata              |

<Warning>
The return type of a function is not affected by streaming attributes!
</Warning>

## Putting it all together

Let's put all of these concepts together to design an application that
streams a conversation containing stock recommendations, using semantic
streaming to ensure that the streamed data obeys our domain's invariants.

```baml
enum Stock {
  APPL
  MSFT
  GOOG
  BAML
}

// Make recommendations atomic - we do not want a recommendation to be
// modified by streaming additional messages.
class Recommendation {
  stock Stock
  amount float
  action "buy" | "sell"
  @@stream.done
}

class AssistantMessage {
  message_type "greeting" | "conversation" | "farewell" @stream.not_null
  message string @stream.with_state @stream.not_null
}

function Respond(
  history: (UserMessage | AssistantMessage | Recommendation)[]
) -> Message | Recommendation { 
  client DeepseekR1
  prompt #"
    Make the message in the conversation, using a conversational
    message or a stock recommendation, based on this conversation history:
    {{ history }}.

    {{ ctx.output_format }}
  "#
}
```

<Tabs>

<Tab title="Python">
The above BAML code will generate the following Python definitions in the
`partial_types` module. The use of streaming attributes has several effects on
the generated code:

 - `Recommendation` does not have any partial fields because it was marked
   `@stream.done`.
 - The `Message.message` `string` is wrapped in `StreamState`, allowing
   runtime checking of its completion status. This status could be used
   to render a spinner as the message streams in.
 - The `Message.message_type` field may not be `null`, because it was marked
   as `@stream.not_null`.

```python
class StreamState(BaseModel, Generic[T]):
  value: T,
  state: Literal["Pending", "Incomplete", "Complete"]

class Stock(str, Enum):
    APPL = "APPL"
    MSFT = "MSFT"
    GOOG = "GOOG"
    BAML = "BAML"

class Recommendation(BaseClass):
    stock: Stock
    amount: float
    action: Literal["buy", "sell"]

class Message(BaseClass):
  message_type: Literal["gretting","conversation","farewell"]
  message: StreamState[string]
```
</Tab>

<Tab title="Typescript">
This BAML code will generate the following Typescript definitions in the
`partial_types` module. The use of streaming attributes has several effects on
the generated code:

 - `Recommendation` does not have any partial fields because it was marked
   `@stream.done`.
 - The `Message.message` `string` is wrapped in `StreamState`, allowing
   runtime checking of its completion status. This status could be used
   to render a spinner as the message streams in.
 - The `Message.message_type` field may not be `null`, because it was marked
   as `@stream.not_null`.

```typescript
export interface StreamState<T> {
  value: T,
  state: "Pending" | "Incomplete" | "Complete"
}

export enum Category {
  APPL = "APPl",
  MSFT = "MSFT",
  GOOG = "GOOG",
  BAML = "BAML",
}

export interface Recommendation {
  stock: Stock,
  amount: float,
  action: "buy" | "sell"
}

export interface Message {
  message_type: "gretting" | "conversation" | "farewell"
  message: StreamState<string>
}
```
</Tab>

</Tabs>

---
title: Switching LLMs
slug: guide/baml-basics/switching-llms
---

BAML Supports getting structured output from **all** major providers as well as all OpenAI-API compatible open-source models. See [LLM Providers Reference](/ref/llm-client-providers/open-ai) for how to set each one up.
<Tip>
BAML can help you get structured output from **any Open-Source model**, with better performance than other techniques, even when it's not officially supported via a Tool-Use API (like o1-preview) or fine-tuned for it! [Read more about how BAML does this](https://www.boundaryml.com/blog/schema-aligned-parsing).
</Tip>

### Using `client "<provider>/<model>"`

Using `openai/model-name` or `anthropic/model-name` will assume you have the ANTHROPIC_API_KEY or OPENAI_API_KEY environment variables set.

```rust BAML
function MakeHaiku(topic: string) -> string {
  client "openai/gpt-4o" // or anthropic/claude-3-5-sonnet-20240620
  prompt #"
    Write a haiku about {{ topic }}.
  "#
}
```

### Using a named client
<Note>Use this if you are using open-source models or need customization</Note>
The longer form uses a named client, and supports adding any parameters supported by the provider or changing the temperature, top_p, etc.

```rust BAML
client<llm> MyClient {
  provider "openai"
  options {
    model "gpt-4o"
    api_key env.OPENAI_API_KEY
    // other params like temperature, top_p, etc.
    temperature 0.0
    base_url "https://my-custom-endpoint.com/v1"
    // add headers
    headers {
      "anthropic-beta" "prompt-caching-2024-07-31"
    }
  }

}

function MakeHaiku(topic: string) -> string {
  client MyClient
  prompt #"
    Write a haiku about {{ topic }}.
  "#
}
```

Consult the [provider documentation](/ref/llm-client-providers/open-ai) for a list of supported providers
and models, the default options, and setting [retry policies](/ref/llm-client-strategies/retry-policy).

<Tip>
If you want to specify which client to use at runtime, in your Python/TS/Ruby code,
you can use the [client registry](/ref/baml_client/client-registry) to do so.

This can come in handy if you're trying to, say, send 10% of your requests to a
different model.
</Tip>

---
slug: /guide/baml-basics/testing-functions
---

You can test your BAML functions in the VSCode Playground by adding a `test` snippet into a BAML file:

```baml
enum Category {
    Refund
    CancelOrder
    TechnicalSupport
    AccountIssue
    Question
}

function ClassifyMessage(input: string) -> Category {
  client GPT4Turbo
  prompt #"
    ... truncated ...
  "#
}

test Test1 {
  functions [ClassifyMessage]
  args {
    // input is the first argument of ClassifyMessage
    input "Can't access my account using my usual login credentials, and each attempt results in an error message stating 'Invalid username or password.' I have tried resetting my password using the 'Forgot Password' link, but I haven't received the promised password reset email."
  }
  // 'this' is the output of the function
  @@assert( {{ this == "AccountIssue" }})
}
```

### Try it! Press 'Run Test' below!

{" "}

<div class="resizer">
  <iframe
    class="resized"
    src="https://promptfiddle.com/embed?id=testing_functions"
    height="640"
    style="border: none;"
    resize="both"
    overflow="auto"
    msallowfullscreen
  ></iframe>
</div>

See more [interactive examples](https://promptfiddle.com)

The BAML playground will give you a starting snippet to copy that will match your function signature.

<Warning>
  BAML doesn't use colons `:` between key-value pairs except in function
  parameters.
</Warning>

<hr />
## Complex object inputs

Objects are injected as dictionaries

```rust
class Message {
  user string
  content string
}

function ClassifyMessage(messages: Messages[]) -> Category {
...
}

test Test1 {
  functions [ClassifyMessage]
  args {
    messages [
      {
        user "hey there"
        // multi-line string using the #"..."# syntax
        content #"
          You can also add a multi-line
          string with the hashtags
          Instead of ugly json with \n
        "#
      }
    ]
  }
}
```

<hr />
## Test Image Inputs in the Playground

For a function that takes an image as input, like so:

```baml
function MyFunction(myImage: image) -> string {
  client GPT4o
  prompt #"
    Describe this image: {{myImage}}
  "#
}
```

You can define test cases using image files, URLs, or base64 strings.

<Tabs>

<Tab title="File">

<Warning>
  Committing a lot of images into your repository can make it slow to clone and
  pull your repository. If you expect to commit >500MiB of images, please read
  [GitHub's size limit documentation][github-large-files] and consider setting
  up [large file storage][github-lfs].
</Warning>

[github-large-files]: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
[github-lfs]: https://docs.github.com/en/repositories/working-with-files/managing-large-files/configuring-git-large-file-storage

```baml
test Test1 {
  functions [MyFunction]
  args {
    myImage {
      file "../path/to/image.png"
    }
  }
}
```

<ParamField path="file" type="string" required="true">
  The path to the image file, relative to the directory containing the current BAML file.

Image files must be somewhere in `baml_src/`.

</ParamField>

<ParamField path="media_type" type="string">
  The mime-type of the image. If not set, and the provider expects a mime-type
  to be provided, BAML will try to infer it based on first, the file extension,
  and second, the contents of the file.
</ParamField>

</Tab>

<Tab title="URL">
```baml
test Test1 {
  functions [MyFunction]
  args {
    myImage {
      url "https...."
    }
  }
}
```

<ParamField path="url" type="string" required="true">
  The publicly accessible URL from which the image may be downloaded.
</ParamField>

<ParamField path="media_type" type="string">
  The mime-type of the image. If not set, and the provider expects a mime-type
  to be provided, BAML will try to infer it based on the contents of the file.
</ParamField>

</Tab>

<Tab title="Base64">
```baml
test Test1 {
  args {
    myImage {
      base64 "base64string"
      media_type "image/png"
    }
  }
}
```

<ParamField path="base64" type="string" required="true">
  The base64-encoded image data.
</ParamField>

<ParamField path="media_type" type="string">
  The mime-type of the image. If not set, and the provider expects a mime-type
  to be provided, BAML will try to infer it based on the contents of the file.

If `base64` is a data URL, this field will be ignored.

</ParamField>

</Tab>
</Tabs>

<br />
## Test Audio Inputs in the Playground

For a function that takes audio as input, like so:

```baml
function MyFunction(myAudio: audio) -> string {
  client GPT4o
  prompt #"
    Describe this audio: {{myAudio}}
  "#
}
```

You can define test cases using audio files, URLs, or base64 strings.

<Tabs>

<Tab title="File">

<Warning>
  Committing a lot of audio files into your repository can make it slow to clone
  and pull your repository. If you expect to commit >500MiB of audio, please
  read [GitHub's size limit documentation][github-large-files] and consider
  setting up [large file storage][github-lfs].
</Warning>

```baml
test Test1 {
  functions [MyFunction]
  args {
    myAudio {
      file "../path/to/audio.mp3"
    }
  }
}
```

<ParamField path="file" type="string" required="true">
  The path to the audio file, relative to the directory containing the current BAML file.

audio files must be somewhere in `baml_src/`.

</ParamField>

<ParamField path="media_type" type="string">
  The mime-type of the audio. If not set, and the provider expects a mime-type
  to be provided, BAML will try to infer it based on first, the file extension,
  and second, the contents of the file.
</ParamField>

</Tab>

<Tab title="URL">
```baml
test Test1 {
  functions [MyFunction]
  args {
    myAudio {
      url "https...."
    }
  }
}
```

<ParamField path="url" type="string" required="true">
  The publicly accessible URL from which the audio may be downloaded.
</ParamField>

<ParamField path="media_type" type="string">
  The mime-type of the audio. If not set, and the provider expects a mime-type
  to be provided, BAML will try to infer it based on the contents of the file.
</ParamField>

</Tab>

<Tab title="Base64">
```baml
test Test1 {
  args {
    myAudio {
      base64 "base64string"
      media_type "audio/mp3"
    }
  }
}
```

<ParamField path="base64" type="string" required="true">
  The base64-encoded audio data.
</ParamField>

<ParamField path="media_type" type="string">
  The mime-type of the audio. If not set, and the provider expects a mime-type
  to be provided, BAML will try to infer it based on the contents of the file.

If `base64` is a data URL, this field will be ignored.

</ParamField>
</Tab>
</Tabs>

## Assertions

Test blocks in BAML code may contain checks and asserts. These attributes
behave similarly to value-level [Checks and Asserts](/guide/baml-advanced/checks-and-asserts),
with several additional variables available in the context of the jinja
expressions you can write in a test:

- The `_` variable contains fields `result`, `checks` and `latency_ms`.
- The `this` variable refers to the value computed by the test, and is
  shorthand for `_.result`.
- In a given check or assert, `_.checks.$NAME` can refer to the NAME of any earlier
  check that was run in the same test block. By referring to prior checks,
  you can build compound checks and asserts, for example asserting that all
  checks of a certain type passed.

The following example illustrates how each of these features can be used to
validate a test result.

```rust
test MyTest {
  functions [EchoString]
  args {
    input "example input"
  }
  @@check( nonempty, {{ this|length > 0 }} )
  @@check( small_enough, {{ _.result|length < 1000 }} )
  @@assert( {{ _.checks.nonempty and _.checks.small_enough }})
  @@assert( {{ _.latency_ms < 1000 }})
}
```

`@@check` and `@@assert` behave differently:

- A `@@check` represents a property
  of the test result that should either be manually checked or checked by a
  subsequent stage in the test. Multiple `@@check` predicates can fail
  without causing a hard failure of the test.
- An `@@assert` represents a hard guarantee. The first failing assert will halt
  the remainder of the checks and asserts in this particular test.

For more information about the syntax used inside `@@check` and `@@assert`
attributes, see [Checks and Asserts](/guide/baml-advanced/checks-and-asserts)

## Dynamic Types Tests

Classes and enums marked with the [`@@dynamic`](/ref/baml_client/type-builder)
attribute can be modified in tests using the `type_builder` and `dynamic`
blocks.

<Markdown src="../../snippets/dynamic-class-test.mdx" />

The `type_builder` block can contain new types scoped to the parent `test` block
and also `dynamic` blocks that act as modifiers for dynamic classes or enums.

### Try it! Press 'Run Test' below!

{" "}

<div class="resizer">
  <iframe
    class="resized"
    src="https://promptfiddle.com/embed?id=dynamic_types"
    height="640"
    style="border: none;"
    resize="both"
    overflow="auto"
    msallowfullscreen
  ></iframe>
</div>

## Command Line Testing

While the VSCode playground is excellent for interactive development and debugging, you can also run your tests from the command line using the BAML CLI:

```bash
# Run all tests
baml-cli test

# Run tests for a specific function
baml-cli test -i "ClassifyMessage::"

# Run tests in parallel with custom concurrency
baml-cli test --parallel 5

# List available tests without running them
baml-cli test --list
```

See the [CLI Test Reference](/ref/baml-cli/test) for complete documentation of all available options, filtering capabilities, and output formats.


With checks and asserts, you can set specific rules to ensure your data's
value falls within an acceptable range.

BAML provides two types of validations:
- **`@assert`** for strict validations. If a type fails an `@assert` validation, it
  will not be returned in the response. If the failing assertion was part of the
  top-level type, it will raise an exception. If it's part of a container, it
  will be removed from the container.
- **`@check`** for non-exception-raising validations. Whether a `@check` passes or
  fails, the data will be returned. You can access the results of invidividual
  checks in the response data.

## Assertions

Assertions are used to guarantee properties about a type or its components in a response.
They can be written directly as inline attributes next to the field
definition or on the line following the field definition, or on a top-level type used
in a function declaration.

### Using `@assert`

BAML will raise an exception if a function returns a `Foo` where `Foo.bar`
is not between 0 and 10.

If the function `NextInt8` returns `128`, BAML will raise an exception.

```baml BAML
class Foo {
  bar int @assert(between_0_and_10, {{ this > 0 and this < 10 }}) //this = Foo.bar value
}

function NextInt8(a: int) -> int @assert(ok_int8, {{ this >= -128 and this < 127 }}) {
  client GPT4
  prompt #"Return the number after {{ a }}"#
}
```

See [Jinja in Attributes](/ref/attributes/jinja-in-attributes) for a longer description of the Jinja syntax
available in asserts.

Asserts may be applied to a whole class via `@@assert`.

```baml BAML
class Bar {
  baz int
  quux string
  @@assert(length_limit, {{ this.quux|length < this.baz }})
}
```

### Using `@assert` with `Union` Types

Note that when using [`Unions`](/ref/baml/types#union-), it is
crucial to specify where the `@assert` attribute is applied within the union
type, as it is not known until runtime which type the value will be.

```baml BAML
class Foo {
  bar (int @assert(positive, {{ this > 0 }}) | bool @assert(is_true, {{ this }}))
}
```

In the above example, the `@assert` attribute is applied specifically to the
`int` and `string` instances of the `Union`, rather than to the `Foo.bar` field
as a whole.

Likewise, the keyword `this` refers to the value of the type instance it is
directly associated with (e.g., `int` or `string`).

## Chaining Assertions
You can have multiple assertions on a single field by chaining multiple `@assert` attributes.

In this example, the asserts on `bar` and `baz` are equivalent.
```baml BAML
class Foo {
  bar int @assert(between_0_and_10, {{ this > 0 and this < 10 }})
  baz int @assert(positive, {{ this > 0 }}) @assert(less_than_10, {{ this < 10 }})
}
```

Chained asserts are evaluated in order from left to right. If the first assert
fails, the second assert will not be evaluated.

## Writing Assertions

Assertions are represented as Jinja expressions and can be used to validate
various types of data. Possible constraints include checking the length of a
string, comparing two values, or verifying the presence of a substring with
regular expressions.

In the future, we plan to support shorthand syntax for common assertions to make
writing them easier.

For now, see our [Jinja cookbook / guide](/ref/prompt-syntax/what-is-jinja)
or the [Minijinja filters docs](https://docs.rs/minijinja/latest/minijinja/filters/index.html#functions)
for more information on writing expressions.



### Expression keywords

- `this` refers to the value of the current field being validated.


`this.field` is used to refer to a specific field within the context of `this`.
Access nested fields of a data type by chaining the field names together with a `.` as shown below.
```baml BAML
class Resume {
  name string
  experience string[]

}

class Person {
  resume Resume @assert({{ this.experience|length > 0 }}, "Nonzero experience")
  person_name name
}
```

## Assertion Errors

When asserts fail, your BAML function will raise a `BamlValidationError`
exception, same as when parsing fails. You can catch this exception and handle
it as you see fit.

You can define custom names for each assertion, which will be included
in the exception for that failure case. If you don't define a custom name,
BAML will display the body of the assert expression.

In this example, if the `quote` field is empty, BAML raises a
`BamlValidationError` with the message **"exact_citation_not_found"**. If the
`website_link` field does not contain **"https://",** it raises a
`BamlValidationError` with the message **invalid_link**.

```baml BAML
class Citation {
  //@assert(<name>, <expr>)
  quote string @assert(exact_citation_found,
	  {{ this|length > 0 }}
  )

  website_link string @assert(valid_link,
    {{ this|regex_match("https://") }}
  )
}
```

<CodeBlocks>

```python Python
from baml_client import b
from baml_client.types import Citation

def main():
    try:
        citation: Citation = b.GetCitation("SpaceX, is an American spacecraft manufacturer, launch service provider...")

        # Access the value of the quote field
        quote = citation.quote
        website_link = citation.website_link
        print(f"Quote: {quote} from {website_link}")
        
    except BamlValidationError as e:
        print(f"Validation error: {str(e)}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

```

```typescript Typescript
import { b, BamlValidationError } from './baml_client';
import { Citation } from './baml_client/types';

const main = () => {
    try {
        const citation = b.GetCitation("SpaceX, is an American spacecraft manufacturer, launch service provider...");
        
        const quote = citation.quote.value;
        console.log(`Quote: ${quote}`);

        const checks = citation.quote.checks;
        console.log(`Check exact_citation_found: ${checks.exact_citation_found.status}`);
        for (const check of get_checks(checks)) {
            console.log(`Check ${check.name}: ${check.status}`);
        }

        const author = citation.author;
        console.log(`Author: ${author}`);
    } catch (e) {
        if (e instanceof BamlValidationError) {
            console.log(`Validation error: ${e}`);
        } else {
            console.error(e);
        }
    }
};
```

</CodeBlocks>


## Checks

`@check` attributes add validation without raising exceptions if they fail.
Types with `@check` attributes allow the checks to be inspected at
runtime.


```baml BAML
( bar int @check(less_than_zero, {{ this < 0 }}) )[]
```

<CodeBlocks>
```python Python
List[Checked[int, Dict[Literal["less_than_zero"]]]]
```

```typescript Typescript
Checked<int,"less_than_zero">[]
```
</CodeBlocks>


The following example uses both `@check` and `@assert`. If `line_number` fails its
`@assert`, no `Citation` will be returned by `GetCitation()`. However,
`exact_citation_not_found` can fail without interrupting the result. Because it
was a `@check`, client code can inspect the result of the check.


```baml BAML
class Citation {
  quote string @check(
      exact_citation_match,
	  {{ this|length > 0 }}
  )
  line_number string @assert(
    has_line_number,
    {{ this|length >= 0 }}
  )
}

function GetCitation(full_text: string) -> Citation {
  client GPT4 
  prompt #"
    Generate a citation of the text below in MLA format:
    {{full_text}}

    {{ctx.output_format}}
  "#
}

```

<CodeBlocks>
```python Python
from baml_client import b
from baml_client.types import Citation, get_checks

def main():
    citation = b.GetCitation("SpaceX, is an American spacecraft manufacturer, launch service provider...")

    # Access the value of the quote field
    quote = citation.quote.value 
    print(f"Quote: {quote}")

    # Access a particular check.
    quote_match_check = citation.quote.checks['exact_citation_match'].status
    print(f"Citation match status: {quote_match_check})")

    # Access each check and its status.
    for check in get_checks(citation.quote.checks):
        print(f"Check {check.name}: {check.status}")
```

```typescript Typescript
import { b, get_checks } from './baml_client'
import { Citation } from './baml_client/types'

const main = () => {
    const citation = b.GetCitation("SpaceX, is an American spacecraft manufacturer, launch service provider...")

    // Access the value of the quote field
    const quote = citation.quote.value
    console.log(`Quote: ${quote}`)

    // Access a particular check.
    const quote_match_check = citation.quote.checks.exact_citation_match.status;
    console.log(`Exact citation status: ${quote_match_check}`);

    // Access each check and its status.
    for (const check of get_checks(citation.quote.checks)) {
        console.log(`Check: ${check.name}, Status: ${check.status}`)
    }
}
```


</CodeBlocks>

You can also chain multiple `@check` and `@assert` attributes on a single field.

```baml BAML
class Foo {
  bar string @check(bar_nonempty, {{ this|length > 0 }})
  @assert(bar_no_foo, {{ this|regex_match("foo") }})
  @check(bar_no_fizzle, {{ this|regex_match("fizzle") }})
  @assert(bar_no_baz, {{ this|regex_match("baz") }})
}
```

<Tip> When using `@check`, all checks on the response data are evaluated even if
one fails. In contrast, with `@assert`, a failure will stop the parsing process
and immediately raise an exception. </Tip>


## Advanced Example

The following example shows more complex minijinja expressions, see the
[Minijinja filters docs](https://docs.rs/minijinja/latest/minijinja/filters/index.html#functions)
for more information on available operators to use in your assertions.

--------

The `Book` and `Library` classes below demonstrate how to validate a book's
title, author, ISBN, publication year, genres, and a library's name and books.
The block-level assertion in the `Library` class ensures that all books have
unique ISBNs.

```baml BAML
class Book {
    title string @assert(this|length > 0)
    author string @assert(this|length > 0)
    isbn string @assert(
        {{ this|regex_match("^(97(8|9))?\d{9}(\d|X)$") }},
        "Invalid ISBN format"
    )
    publication_year int @assert(valid_pub_year, {{ 1000 <= this <= 2100 }})
    genres string[] @assert(valid_length, {{ 1 <= this|length <= 10 }})
}

class Library {
    name string
    books Book[] @assert(nonempty_books, {{ this|length > 0 }})
                 @assert(unique_isbn, {{ this|map(attribute='isbn')|unique()|length == this|length }} )
}
```

In this example, we use a block-level `@@assert` to check a dependency across
a pair of fields.

```baml BAML
class Person {
    name string @assert(valid_name, {{ this|length >= 2 }})
    age int @assert(valid_age, {{ this >= 0 }})
    address Address

    @@assert(not_usa_minor, {{
        this.age >= 18 or this.address.country != "USA",
    }})
}
```
---
title: Client Registry
---

If you need to modify the model / parameters for an LLM client at runtime, you can modify the `ClientRegistry` for any specified function.

<Tabs>

<Tab title="Python">

```python
import os
from baml_py import ClientRegistry

async def run():
    cr = ClientRegistry()
    # Creates a new client
    cr.add_llm_client(name='MyAmazingClient', provider='openai', options={
        "model": "gpt-4o",
        "temperature": 0.7,
        "api_key": os.environ.get('OPENAI_API_KEY')
    })
    # Sets MyAmazingClient as the primary client
    cr.set_primary('MyAmazingClient')

    # ExtractResume will now use MyAmazingClient as the calling client
    res = await b.ExtractResume("...", { "client_registry": cr })
```

</Tab>

<Tab title="TypeScript">
```typescript
import { ClientRegistry } from '@boundaryml/baml'

async function run() {
    const cr = new ClientRegistry()
    // Creates a new client
    cr.addLlmClient('MyAmazingClient', 'openai', {
        model: "gpt-4o",
        temperature: 0.7,
        api_key: process.env.OPENAI_API_KEY
    })
    // Sets MyAmazingClient as the primary client
    cr.setPrimary('MyAmazingClient')

    // ExtractResume will now use MyAmazingClient as the calling client
    const res = await b.ExtractResume("...", { clientRegistry: cr })
}
```
</Tab>

<Tab title="Ruby">

```ruby
require_relative "baml_client/client"

def run
  cr = Baml::ClientRegistry.new

  # Creates a new client
  cr.add_llm_client(
    'MyAmazingClient',
    'openai',
    {
      model: 'gpt-4o',
      temperature: 0.7,
      api_key: ENV['OPENAI_API_KEY']
    }
  )

  # Sets MyAmazingClient as the primary client
  cr.set_primary('MyAmazingClient')

  # ExtractResume will now use MyAmazingClient as the calling client
  res = Baml.Client.extract_resume(input: '...', baml_options: { client_registry: cr })
end

# Call the asynchronous function
run
```
</Tab>

<Tab title="OpenAPI">

The API supports passing client registry as a field on `__baml_options__` in the request body.

Example request body:

```json
{
    "resume": "Vaibhav Gupta",
    "__baml_options__": {
        "client_registry": {
            "clients": [
                {
                    "name": "OpenAI",
                    "provider": "openai",
                    "retry_policy": null,
                    "options": {
                        "model": "gpt-4o-mini",
                        "api_key": "sk-..."
                    }
                }
            ],
            "primary": "OpenAI"
        }
    }
}
```

```sh
curl -X POST http://localhost:2024/call/ExtractResume \
    -H 'Content-Type: application/json' -d @body.json
```

</Tab>

</Tabs>

## ClientRegistry Interface

<Tip>
    Note: `ClientRegistry` is imported from `baml_py` in Python and `@boundaryml/baml` in TypeScript, not `baml_client`.

    As we mature `ClientRegistry`, we will add a more type-safe and ergonomic interface directly in `baml_client`. See [Github issue #766](https://github.com/BoundaryML/baml/issues/766).
</Tip>

Methods use `snake_case` in Python and `camelCase` in TypeScript.

### add_llm_client / addLlmClient
A function to add an LLM client to the registry.

<ParamField
    path="name"
    type="string"
    required
>
    The name of the client.

    <Warning>
    Using the exact same name as a client also defined in .baml files overwrites the existing client whenever the ClientRegistry is used.
    </Warning>
</ParamField>

<Markdown src="/snippets/client-constructor.mdx" />

<ParamField path="retry_policy" type="string">
The name of a retry policy that is already defined in a .baml file. See [Retry Policies](/ref/llm-client-strategies/retry-policy).
</ParamField>

### set_primary / setPrimary
This sets the client for the function to use. (i.e. replaces the `client` property in a function)

<ParamField
    path="name"
    type="string"
    required
>
    The name of the client to use.

    This can be a new client that was added with `add_llm_client` or an existing client that is already in a .baml file.
</ParamField>

---
title: Collector
---
<Info>
This feature was added in 0.79.0
</Info>

The `Collector` allows you to inspect the internal state of BAML function calls, including raw HTTP requests, responses, usage metrics, and timing information, so you can always see the raw data, without any abstraction layers.

## Quick Start

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector

# Create a collector with optional name
collector = Collector(name="my-collector")

# Use it with a function call
result = b.ExtractResume("...", baml_options={"collector": collector})

# Access logging information
print(collector.last.usage)  # Print usage metrics
print(collector.last.raw_llm_response)  # Print final response as string
# since there may be retries, print the last http response received
print(collector.last.calls[-1].http_response) 
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import { b } from 'baml_client'
import { Collector } from '@boundaryml/baml'

// Create a collector with optional name
const collector = new Collector("my-collector")

// Use it with a function call
const result = await b.ExtractResume("...", { collector })

// Access logging information
console.log(collector.last?.usage)  // Print usage metrics
console.log(collector.last?.rawLlmResponse)  // Print final response
// since there may be retries, print the last http response received
console.log(collector.last?.calls[-1].httpResponse)
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"
b = Baml.Client

# Create a collector with optional name
collector = Baml::Collector.new(name: "my-collector")

# Use it with a function call
res = b.ExtractResume(input: '...', baml_options: { collector: collector })

# Access logging information
print(collector.last.usage)  # Print usage metrics
print(collector.last.calls[-1].http_response)  # Print final response
print(collector.last.raw_llm_response) # a string of the last response made
```
</Tab>
</Tabs>

## Common Use Cases

### Basic Logging

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector  # Import the Collector class

def run():
    # Create a collector instance with an optional name
    collector = Collector(name="my-collector")
    # collector will be modified by the function to include all internal state
    res = b.ExtractResume("...", baml_options={"collector": collector})
    # This will print the return type of the function
    print(res)

    # This is guaranteed to be set by the function
    assert collector.last is not None

    # This will print the id of the last request
    print(collector.last.id)

    # This will print the usage of the last request
    # (This aggregates usage from all retries if there was usage emitted)
    print(collector.last.usage)

    # This will print the raw response of the last request
    print(collector.last.calls[-1].http_response)

    # This will print the raw text we used to run the parser.
    print(collector.last.raw_llm_response)
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import {b} from 'baml_client'
import {Collector} from '@boundaryml/baml'

async function run() {
    // Create a collector instance with an optional name
    const collector = new Collector("my-collector")
    // collector will be modified by the function to include all internal state
    const res = await b.ExtractResume("...", { collector })
    // This will print the return type of the function
    console.log(res)

    // This is guaranteed to be set by the function
    assert(collector.last)

    // This will print the id of the last request
    console.log(collector.last.id)

    // This will print the usage of the last request
    // (This aggregates usage from all retries if there was usage emitted)
    console.log(collector.last.usage)

    // This will print the raw response of the last request
    console.log(collector.last.calls[-1].httpResponse)

    // This will print the raw text we used to run the parser.
    console.log(collector.last.rawLlmResponse)
}
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"
b = Baml.Client

def run
    # Create a collector instance
    collector = Baml::Collector.new(name: "my-collector")
    # The function will now use the collector to track internal state
    res = b.ExtractResume(input: 'hi there', baml_options: { collector: collector })

    # This will print the return type of the function
    print(res)

    # This is guaranteed to be set by the function
    raise "Assertion failed" unless collector.last

    # This will print the id of the last request
    print(collector.last.id)

    # This will print the usage of the last request
    # (This aggregates usage from all retries if there was usage emitted)
    print(collector.last.usage)

    # This will print the raw response of the last request
    print(collector.last.calls[-1].http_response)

    # This will print the raw text we used to run the parser.
    print(collector.last.raw_llm_response)
end

# Call the function
run
```
</Tab>
</Tabs>

### Managing Collector State

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector

def run():
    collector = Collector(name="reusable-collector")
    res = b.ExtractResume("...", baml_options={"collector": collector})
   
    # Reuse the same collector
    res = b.TestOpenAIGPT4oMini("Second call", baml_options={"collector": collector})
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import {b} from 'baml_client'
import {Collector} from '@boundaryml/baml'

async function run() {
    const collector = new Collector("reusable-collector")
    const res = await b.ExtractResume("...", { collector })
  
    // Reuse the same collector
    const res2 = await b.ExtractResume("...", { collector })
}
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"
b = Baml.Client

def run
    collector = Baml::Collector.new(name: "reusable-collector")
    res = b.ExtractResume(input: 'First call', baml_options: { collector: collector })
  
    # Reuse the same collector
    res = b.ExtractResume(input: 'Second call', baml_options: { collector: collector })
end
```
</Tab>
</Tabs>

### Using Multiple Collectors

You can use multiple collectors to track different aspects of your application:

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector

def run():
    # Create separate collectors for different parts of your application
    collector_a = Collector(name="collector-a")
    collector_b = Collector(name="collector-b")
    
    # Use both collectors for the same function call
    res = b.ExtractResume("...", baml_options={"collector": [collector_a, collector_b]})
    
    # Both collectors will have the same logs
    assert collector_a.last.usage.input_tokens == collector_b.last.usage.input_tokens
    
    # Use only collector_a for another call
    res2 = b.TestOpenAIGPT4oMini("another call", baml_options={"collector": collector_a})
    
    # collector_a will have 2 logs, collector_b will still have 1
    assert len(collector_a.logs) == 2
    assert len(collector_b.logs) == 1
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import {b} from 'baml_client'
import {Collector} from '@boundaryml/baml'

async function run() {
    // Create separate collectors for different parts of your application
    const collector_a = new Collector("collector-a")
    const collector_b = new Collector("collector-b")
    
    // Use both collectors for the same function call
    const res = await b.ExtractResume("...", { collector: [collector_a, collector_b] })
    
    // Both collectors will have the same logs
    assert(collector_a.last?.usage.inputTokens === collector_b.last?.usage.inputTokens)
    
    // Use only collector_a for another call
    const res2 = await b.ExtractResume("...", { collector: collector_a })
    
    // collector_a will have 2 logs, collector_b will still have 1
    assert(collector_a.logs.length === 2)
    assert(collector_b.logs.length === 1)
}
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"
b = Baml.Client
def run
    # Create separate collectors for different parts of your application
    collector_a = Baml::Collector.new(name: "collector-a")
    collector_b = Baml::Collector.new(name: "collector-b")
    
    # Use both collectors for the same function call
    res = b.ExtractResume(input: 'hi there', baml_options: { collector: [collector_a, collector_b] })
    
    # Both collectors will have the same logs
    raise "Assertion failed" unless collector_a.last.usage.input_tokens == collector_b.last.usage.input_tokens
    
    # Use only collector_a for another call
    res2 = b.ExtractResume(input: 'another call', baml_options: { collector: collector_a })
    
    # collector_a will have 2 logs, collector_b will still have 1
    raise "Assertion failed" unless collector_a.logs.length == 2
    raise "Assertion failed" unless collector_b.logs.length == 1
end
```
</Tab>
</Tabs>

### Usage Tracking

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector

def run():
    collector_a = Collector(name="collector-a")
    res = b.ExtractResume("...", baml_options={"collector": collector_a})

    collector_b = Collector(name="collector-b")
    res = b.ExtractResume("...", baml_options={"collector": collector_b})

    # The total usage of both logs is now available
    print(collector_a.usage)
    print(collector_b.usage)
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import {b} from 'baml_client'
import {Collector} from '@boundaryml/baml'

async function run() {
    const collector_a = new Collector("collector-a")
    const res = await b.ExtractResume("...", { collector: collector_a })

    const collector_b = new Collector("collector-b")
    const res2 = await b.ExtractResume("...", { collector: collector_b })
    // The total usage of both logs is now available
    console.log(collector_a.usage)
    console.log(collector_b.usage)
}
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"

def run
    collector_a = Baml::Collector.new(name: "collector-a")
    res = Baml.Client.ExtractResume(input: 'First call', baml_options: { collector: collector_a })

    collector_b = Baml::Collector.new(name: "collector-b")
    res = Baml.Client.ExtractResume(input: 'Second call', baml_options: { collector: collector_b })


    # The total usage of both logs is now available
    print(collector_a.usage)
    print(collector_b.usage)
end
```
</Tab>
</Tabs>

## API Reference

### Collector Class

The Collector class provides properties to introspect the internal state of BAML function calls.

| Property | Type | Description |
|--------|------|-------------|
| `logs` | `List[FunctionLog]` | A list of all function calls (ordered from oldest to newest) |
| `last` | `FunctionLog \| null` | The most recent function log. |
| `usage` | `Usage` | The cumulative total usage of all requests this collector has tracked. This includes all retries and fallbacks, if those did use any tokens. |


The Collector class provides the following methods:

| Method | Type | Description |
|--------|------|-------------|
| `id(id: string)` | `FunctionLog \| null` | Get the function log by id. |
| `clear()` | `void` | Clears all logs. |

### FunctionLog Class

The `FunctionLog` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The id of the request. |
| `function_name` | `string` | The name of the function. |
| `log_type` | `"call" \| "stream"` | The manner in which the function was called. |
| `timing` | `Timing` | The timing of the request. |
| `usage` | `Usage` | The usage of the request (aggregated from all calls). |
| `calls` | `(LLMCall \| LLMStreamCall)[]` | Every call made to the LLM (including fallbacks and retries). Sorted from oldest to newest. |
| `raw_llm_response` | `string \| null` | The raw text from the best matching LLM. |
| `tags` | `Map[str, any]` | Any user provided metadata. |


### Timing Class

The `Timing` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `start_time_utc_ms` | `int` | The start time of the request in milliseconds since epoch. |
| `duration_ms` | `int \| null` | The duration of the request in milliseconds. |

#### StreamTiming Class (extends Timing)

| Property | Type | Description |
|----------|------|-------------|
| `time_to_first_token_ms` | `int \| null` | The time to first token in milliseconds. |

### Usage Class

The `Usage` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `input_tokens` | `int \| null` | The cumulative number of tokens used in the inputs. |
| `output_tokens` | `int \| null` | The cumulative number of tokens used in the outputs. |

<Info>
Note: Usage may not include all things like "thinking_tokens" or "cached_tokens". For that you may need to look at the raw HTTP response and build your own adapters.
</Info>

### LLMCall Class

The `LLMCall` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `client_name` | `str` | The name of the client used. |
| `provider` | `str` | The provider of the client used. |
| `timing` | `Timing` | The timing of the request. |
| `http_request` | `HttpRequest` | The raw HTTP request sent to the client. |
| `http_response` | `HttpResponse \| null` | The raw HTTP response from the client (null for streaming). |
| `usage` | `Usage \| null` | The usage of the request (if available). |
| `selected` | `bool` | Whether this call was selected and used for parsing. |

### LLMStreamCall Class (extends LLMCall)

The `LLMStreamCall` includes the same properties as `LLMCall` plus the following:

| Property | Type | Description |
|----------|------|-------------|  
| `timing` | `StreamTiming` | The timing of the request. |
|`chunks` | `string[]` | The chunks of the response (API coming soon). |


### HttpRequest Class

The `HttpRequest` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `url` | `str` | The URL of the request. |
| `method` | `str` | The HTTP method of the request. |
| `headers` | `object` | The request headers. |
| `body` | `HTTPBody` | The request body. |

### HttpResponse Class

The `HttpResponse` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `status` | `int` | The HTTP status code. |
| `headers` | `object` | The response headers. |
| `body` | `HTTPBody` | The response body. |

### HTTPBody Class

The `HTTPBody` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `text()` | `string` | The body as a string. |
| `json()` | `object` | The body as a JSON object. |


## Related Topics
- [Using with_options](/ref/baml_client/with-options) - Learn how to configure logging globally
- [TypeBuilder](/ref/baml_client/type-builder) - Build custom types for your BAML functions
- [Client Registry](/ref/baml_client/client-registry) - Manage LLM clients and their configurations

## Best Practices
1. Use a single collector instance when tracking related function calls in a chain.
3. Consider using multiple collectors to track different parts of your application.
4. Use function IDs when tracking specific calls in parallel operations.
5. For streaming calls, be aware that `http_response` will be null, but you can still access usage information.

---
title: Dynamic Types - TypeBuilder
slug: guide/baml-advanced/dynamic-types
---

Sometimes you have **output schemas that change at runtime** -- for example if
you have a list of Categories that you need to classify that come from a
database, or your schema is user-provided.

`TypeBuilder` is used to create or modify dynamic types at runtime to achieve this.


### Dynamic BAML Enums

Imagine we want to make a categorizer prompt, but the list of categories to output come from a database.
1. Add `@@dynamic` to the class or enum definition to mark it as dynamic in BAML.

```rust baml
enum Category {
  VALUE1 // normal static enum values that don't change
  VALUE2
  @@dynamic // this enum can have more values added at runtime
}

// The Category enum can now be modified at runtime!
function DynamicCategorizer(input: string) -> Category {
  client GPT4
  prompt #"
    Given a string, classify it into a category
    {{ input }}

    {{ ctx.output_format }}
  "#
}

```

2. Import the `TypeBuilder` from baml_client in your runtime code and modify `Category`. All dynamic types you
define in BAML will be available as properties of `TypeBuilder`. Think of the
typebuilder as a registry of modified runtime types that the baml function will
read from when building the output schema in the prompt.

<Tabs>

<Tab title="Python">
```python
from baml_client.type_builder import TypeBuilder
from baml_client import b

async def run():
  tb = TypeBuilder()
  tb.Category.add_value('VALUE3')
  tb.Category.add_value('VALUE4')
  # Pass the typebuilder in the baml_options argument -- the last argument of the function.
  res = await b.DynamicCategorizer("some input", { "tb": tb })
  # Now res can be VALUE1, VALUE2, VALUE3, or VALUE4
  print(res)

```
</Tab>

<Tab title="TypeScript">
```typescript
import TypeBuilder from '../baml_client/type_builder'
import {
  b
} from '../baml_client'

async function run() {
  const tb = new TypeBuilder()
  tb.Category.addValue('VALUE3')
  tb.Category.addValue('VALUE4')
  const res = await b.DynamicCategorizer("some input", { tb: tb })
  // Now res can be VALUE1, VALUE2, VALUE3, or VALUE4
  console.log(res)
}
```
</Tab>

<Tab title="Ruby">
```ruby
require_relative '../baml_client'

def run
  tb = Baml::TypeBuilder.new
  tb.Category.add_value('VALUE3')
  tb.Category.add_value('VALUE4')
  res = Baml.Client.dynamic_categorizer(input: "some input", baml_options: {tb: tb})
  # Now res can be VALUE1, VALUE2, VALUE3, or VALUE4
  puts res
end
```
</Tab>

<Tab title="OpenAPI">
Dynamic types are not yet supported when used via OpenAPI.

Please let us know if you want this feature, either via [Discord] or [GitHub][openapi-feedback-github-issue].

[Discord]: https://discord.gg/BTNBeXGuaS
[openapi-feedback-github-issue]: https://github.com/BoundaryML/baml/issues/892
</Tab>

</Tabs>



### Dynamic BAML Classes
Now we'll add some properties to a `User` class at runtime using @@dynamic.


```rust BAML
class User {
  name string
  age int
  @@dynamic
}

function DynamicUserCreator(user_info: string) -> User {
  client GPT4
  prompt #"
    Extract the information from this chunk of text:
    "{{ user_info }}"

    {{ ctx.output_format }}
  "#
}
```

We can then modify the `User` schema at runtime. Since we marked `User` with `@@dynamic`, it'll be available as a property of `TypeBuilder`.

<CodeBlocks>

```python Python
from baml_client.type_builder import TypeBuilder
from baml_client import b

async def run():
  tb = TypeBuilder()
  tb.User.add_property('email', tb.string())
  tb.User.add_property('address', tb.string()).description("The user's address")
  res = await b.DynamicUserCreator("some user info", { "tb": tb })
  # Now res can have email and address fields
  print(res)

```

```typescript TypeScript
import TypeBuilder from '../baml_client/type_builder'
import {
  b
} from '../baml_client'

async function run() {
  const tb = new TypeBuilder()
  tb.User.add_property('email', tb.string())
  tb.User.add_property('address', tb.string()).description("The user's address")
  const res = await b.DynamicUserCreator("some user info", { tb: tb })
  // Now res can have email and address fields
  console.log(res)
}
```

```ruby Ruby
require_relative 'baml_client/client'

def run
  tb = Baml::TypeBuilder.new
  tb.User.add_property('email', tb.string)
  tb.User.add_property('address', tb.string).description("The user's address")

  res = Baml.Client.dynamic_user_creator(input: "some user info", baml_options: {tb: tb})
  # Now res can have email and address fields
  puts res
end
```
</CodeBlocks>


### Add existing BAML types to a property (e.g. you want to add a subset of tools)

Imagine you have a `ChatResponse` type in a function that you want to modify with a set of tools.
```baml {3}
class ChatResponse {
  answer string?
  @@dynamic
}

function Chat(messages: Message[]) -> ChatResponse {
  ...
}
```

You want to add a `tool_calls` property to the `ChatResponse` type that can be a list of `GetWeather` or `GetNews` types, that are completely defined in BAML.
```baml {11,12}
class GetWeather {
  location string
}

class GetNews {
  topic string
}

class ChatResponse {
  answer string?
  // We want to add this property at runtime!
  tools (GetWeather | GetNews)[]?
  @@dynamic
}

function Chat(messages: Message[]) -> ChatResponse {
  ...
}
```

You can modify the set of tools that can be used in the `ChatResponse` type at runtime like this:


<Tabs>

<Tab title="Python">
```python
tb = TypeBuilder()
tb.ChatResponse.add_property(
    "tools", 
    tb.union([
        # we could comment one of these if we wanted!
        tb.GetWeather.type(), 
        tb.GetNews.type()
    ]).list()
).description("The tool calls in the response")
```
</Tab>

<Tab title="TypeScript">
```typescript
const tb = new TypeBuilder()
tb.ChatResponse.addProperty("tools", 
    tb.union([
      // we could comment one of these if we wanted!
      tb.GetWeather.type(), 
      tb.GetNews.type()
    ]).list()).description("The tool calls in the response")
```
</Tab>

<Tab title="Ruby">
```ruby
tb = Baml::TypeBuilder.new
tb.ChatResponse.add_property("tools", tb.union([tb.GetWeather.type(), tb.GetNews.type()]).list).description("The tool calls in the response")
```
</Tab>

</Tabs>

### Creating new dynamic classes or enums not in BAML
The previous examples showed how to modify existing types. Here we create a new `Hobbies` enum, and a new class called `Address` without having them defined in BAML.

Note that you must attach the new types to the existing Return Type of your BAML function(in this case it's `User`).

<CodeBlocks>

```python Python
from baml_client.type_builder import TypeBuilder
from baml_client.async_client import b

async def run():
  tb = TypeBuilder()
  hobbies_enum = tb.add_enum("Hobbies")
  hobbies_enum.add_value("Soccer")
  hobbies_enum.add_value("Reading")

  address_class = tb.add_class("Address")
  address_class.add_property("street", tb.string()).description("The user's street address")

  tb.User.add_property("hobby", hobbies_enum.type().optional())
  tb.User.add_property("address", address_class.type().optional())
  res = await b.DynamicUserCreator("some user info", {"tb": tb})
  # Now res might have the hobby property, which can be Soccer or Reading
  print(res)

```

```typescript TypeScript
import TypeBuilder from '../baml_client/type_builder'
import { b } from '../baml_client'

async function run() {
  const tb = new TypeBuilder()
  const hobbiesEnum = tb.addEnum('Hobbies')
  hobbiesEnum.addValue('Soccer')
  hobbiesEnum.addValue('Reading')

  const addressClass = tb.addClass('Address')
  addressClass.addProperty('street', tb.string()).description("The user's street address")


  tb.User.addProperty('hobby', hobbiesEnum.type().optional())
  tb.User.addProperty('address', addressClass.type())
  const res = await b.DynamicUserCreator("some user info", { tb: tb })
  // Now res might have the hobby property, which can be Soccer or Reading
  console.log(res)
}
```

```ruby Ruby
require_relative 'baml_client/client'

def run
  tb = Baml::TypeBuilder.new
  hobbies_enum = tb.add_enum('Hobbies')
  hobbies_enum.add_value('Soccer')
  hobbies_enum.add_value('Reading')

  address_class = tb.add_class('Address')
  address_class.add_property('street', tb.string)

  tb.User.add_property('hobby', hobbies_enum.type.optional)
  tb.User.add_property('address', address_class.type.optional)

  res = Baml::Client.dynamic_user_creator(input: "some user info", baml_options: { tb: tb })
  # Now res might have the hobby property, which can be Soccer or Reading
  puts res
end
```
</CodeBlocks>



TypeBuilder provides methods for building different kinds of types:

| Method | Returns | Description | Example |
|--------|---------|-------------|---------|
| `string()` | `FieldType` | Creates a string type | `tb.string()` |
| `int()` | `FieldType` | Creates an integer type | `tb.int()` |
| `float()` | `FieldType` | Creates a float type | `tb.float()` |
| `bool()` | `FieldType` | Creates a boolean type | `tb.bool()` |
| `literal_string(value: string)` | `FieldType` | Creates a literal string type | `tb.literal_string("hello")` |
| `literal_int(value: int)` | `FieldType` | Creates a literal integer type | `tb.literal_int(123)` |
| `literal_bool(value: boolean)` | `FieldType` | Creates a literal boolean type | `tb.literal_bool(true)` |
| `list(type: FieldType)` | `FieldType` | Makes a type into a list | `tb.list(tb.string())` |
| `union(types: FieldType[])` | `FieldType` | Creates a union of types | `tb.union([tb.string(), tb.int()])` |
| `map(key: FieldType, value: FieldType)` | `FieldType` | Creates a map type | `tb.map(tb.string(), tb.int())` |
| `add_class(name: string)` | `ClassBuilder` | Creates a new class | `tb.add_class("User")` |
| `add_enum(name: string)` | `EnumBuilder` | Creates a new enum | `tb.add_enum("Category")` |
| `MyClass` | `FieldType` | Reference an existing BAML class | `tb.MyClass.type()` |


### Adding descriptions to dynamic types

<CodeBlocks>

```python Python
tb = TypeBuilder()
tb.User.add_property("email", tb.string()).description("The user's email")
```

```typescript TypeScript
const tb = new TypeBuilder()
tb.User.addProperty("email", tb.string()).description("The user's email")
```

```ruby Ruby
tb = Baml::TypeBuilder.new
tb.User.add_property("email", tb.string).description("The user's email")
```

</CodeBlocks>


### Creating dynamic classes and enums at runtime with BAML syntax
Ok, what if you just want to write some actual baml code to modify the types at runtime?

The `TypeBuilder` has a higher level API `add_baml` to do this:

<Tabs>

<Tab title="Python">
```python Python
tb = TypeBuilder()
tb.add_baml("""
  // Creates a new class Address that does not exist in the BAML source.
  class Address {
    street string
    city string
    state string
  }

  // Modifies the existing @@dynamic User class to add the new address property.
  dynamic class User {
    address Address
  }

  // Modifies the existing @@dynamic Category enum to add a new variant.
  dynamic enum Category {
    VALUE5
  }
""")
```
</Tab>

<Tab title="TypeScript">
```typescript TypeScript
const tb = new TypeBuilder()
tb.addBaml(`
  // Creates a new class Address that does not exist in the BAML source.
  class Address {
    street string
    city string
    state string
  }

  // Modifies the existing @@dynamic User class to add the new address property.
  dynamic class User {
    address Address
  }

  // Modifies the existing @@dynamic Category enum to add a new variant.
  dynamic enum Category {
    VALUE5
  }
`)
```
</Tab>

<Tab title="Ruby">
```ruby Ruby
tb = Baml::TypeBuilder.new
tb.add_baml("
  // Creates a new class Address that does not exist in the BAML source.
  class Address {
    street string
    city string
    state string
  }

  // Modifies the existing @@dynamic User class to add the new address property.
  dynamic class User {
    address Address
  }

  // Modifies the existing @@dynamic Category enum to add a new variant.
  dynamic enum Category {
    VALUE5
  }
")
```
</Tab>

</Tabs>

### Building dynamic types from JSON schema

JSON Schema is a declarative language for validating JSON data structures, often derived from language-native type definitions such as Python classes, TypeScript interfaces, or Java classes.

BAML supports converting JSON schemas into dynamic BAML types, allowing you to automatically use your existing data models with BAML's LLM functions. This feature enables seamless integration between your application's type system and BAML's structured output capabilities.

We have a working implementation of this feature, but are waiting for concrete use cases to merge it into the main codebase. For a detailed explanation of this functionality, see our [article on dynamic JSON schemas](https://www.boundaryml.com/blog/dynamic-json-schemas). You can also explore the [source code and examples](https://github.com/BoundaryML/baml-examples/tree/main/json-schema-to-baml) to understand how to implement this in your projects.

Please chime in on [the GitHub issue](https://github.com/BoundaryML/baml/issues/771) if this is something you'd like to use.

### Testing dynamic types in BAML

When testing dynamic types there are two different cases:
1. Injecting properties into dynamic types returned by the tested function.
2. Injecting values into dynamic types received as arguments by the tested function.

The first case requires using the `type_builder` and `dynamic` blocks in the
test, whereas the second case only requires specifying the values in the `args`
block.

#### Testing return types

##### Dynamic classes

Suppose we have a dynamic class `Resume` and we want to add a property that
stores the user's work experience when we testing a specific function. We can
do that by specifying the types and properties that we need in the
`type_builder` block.


```baml {4, 14-27}
class Resume {
  name string
  skills string[]
  @@dynamic // Marked as @@dynamic.
}

// Function that returns a dynamic class.
function ExtractResume(from_text: string) -> Resume {
  // Prompt
}

test ReturnDynamicClassTest {
  functions [ExtractResume]
  type_builder {
    // Defines a new type available only within this test block.
    class Experience {
      title string
      company string
      start_date string
      end_date string
    }

    // Injects new properties into the `@@dynamic` part of the Resume class.
    dynamic class Resume {
      experience Experience[]
    }
  }
  args {
    from_text #"
      John Doe

      Experience
      - Software Engineer, Boundary, Sep 2022 - Sep 2023

      Skills
      - Python
      - Java
    "#
  }
}
```

The rendered prompt for `ExtractResume` will now include the `experience` field
defined in the `dynamic` block and the LLM will correctly extract the experience
in the input text.

##### Dynamic enums

Dynamic enums can be included in the `type_builder` block just like classes. The
only difference is that we inject new variants in the `dynamic` block instead of
properties.

```baml {7, 17-22}
enum Category {
  Refund
  CancelOrder
  TechnicalSupport
  AccountIssue
  Question
  @@dynamic // Marked as @@dynamic.
}

// Function that returns a dynamic enum.
function ClassifyMessage(message: string) -> Category {
  // Prompt
}

test ReturnDynamicEnumTest {
  functions [ClassifyMessage]
  type_builder {
    // Injects new variants into the `@@dynamic` part of the Category enum.
    dynamic enum Category {
      Feedback
    }
  }
  args {
	  message "I think the product is great!"
  }
}
```

The `Feedback` variant will be rendered in the prompt for `ClassifyMessage`
during the test execution.

#### Testing parameter types

When a dynamic type is used as an input parameter of a function, we can simply
pass any value in the `args` block of the test and the value will be rendered in
the prompt.

##### Dynamic classes

```baml {4, 17-24}
class Resume {
  name string
  skills string[]
  @@dynamic // Marked as @@dynamic.
}

function WriteResume(resume: Resume) -> string {
  // Prompt
}

test DynamicClassAsInputTest {
  functions [WriteResume]
  args {
    resume {
      name "John Doe"
      skills ["C++", "Java"]
      experience [
        {
          title "Software Engineer"
          company "Boundary"
          start_date "2023-09-01"
          end_date "2024-09-01"
        }
      ]
    }
  }
}
```

##### Dynamic enums

Enums work the same way, any variant defined in the `args` block will be
rendered normally.

```baml {7, 17}
enum Category {
  Refund
  CancelOrder
  TechnicalSupport
  AccountIssue
  Question
  @@dynamic // Marked as @@dynamic.
}

function WriteCustomerMessage(category: Category) -> string {
  // Prompt
}

test DynamicEnumAsInputTest {
  functions [WriteCustomerMessage]
  args {
    category Feedback // The enum is dynamic so it accepts a new variant.
  }
}
```

For more information about dynamic types, see [Type Builder](/ref/baml_client/type-builder).

<Info>
  Requires BAML version >=0.79.0
</Info>

First and foremost, BAML provides a high level API where functions are a first
class citizen and their execution is fully transparent to the developer. This
means that you can simply call a BAML function and everything from prompt
rendering, HTTP request building, LLM API network call and response parsing is
handled for you. Basic example:

```baml BAML
class Resume {
  name string
  experience string[]
  education string[]
}

function ExtractResume(resume: string) -> Resume {
  client "openai/gpt-4o"
  prompt #"
    Extract the following information from the resume:

    ---
    {{ resume }}
    ---

    {{ ctx.output_format }}
  "#
}
```

Now we can use this function in our server code after running `baml-cli generate`:

<CodeBlocks>
```python Python
from baml_client import b

async def run():
  # HTTP request + LLM response parsing.
  resume = await b.ExtractResume("John Doe | Software Engineer | BSc in CS")
  print(resume)
```

```typescript TypeScript
import { b } from 'baml_client'

async function run() {
  // HTTP request + LLM response parsing.
  const resume = await b.ExtractResume("John Doe | Software Engineer | BSc in CS")
  console.log(resume)
}
```

```ruby Ruby
require_relative 'baml_client'

b = Baml.Client

def run
  # HTTP request + LLM response parsing.
  resume = b.ExtractResume("John Doe | Software Engineer | BSc in CS")
  puts resume
end
```
</CodeBlocks>

However, sometimes we may want to execute a function without so much abstraction
or have access to the HTTP request before sending it. For this, BAML provides a
lower level API that exposes the HTTP request and LLM response parser to the
caller. Here's an example that uses the `requests` library in Python, the
`fetch` API in Node.js and the `Net::HTTP` library in Ruby to manually send an
HTTP request to OpenAI's API and parse the LLM response.

<CodeBlocks>
```python Python
import requests
# requests is not async so for simplicity we'll use the sync client.
from baml_client.sync_client import b

def run():
  # Get the HTTP request object.
  req = b.request.ExtractResume("John Doe | Software Engineer | BSc in CS")

  # Send the HTTP request.
  res = requests.post(url=req.url, headers=req.headers, json=req.body.json())

  # Parse the LLM response.
  parsed = b.parse.ExtractResume(response.json()["choices"][0]["message"]["content"])

  # Fully parsed Resume type.
  print(parsed)
```

```typescript TypeScript
import { b } from 'baml_client'

async function run() {
  // Get the HTTP request object.
  const req = await b.request.ExtractResume("John Doe | Software Engineer | BSc in CS")

  // Send the HTTP request.
  const res = await fetch(req.url, {
    method: req.method,
    headers: req.headers,
    body: JSON.stringify(req.body.json())
  })

  // Parse the HTTP body.
  const body = await res.json() as any

  // Parse the LLM response.
  const parsed = b.parse.ExtractResume(body.choices[0].message.content)

  // Fully parsed Resume type.
  console.log(parsed)
}
```

```ruby Ruby
require 'net/http'
require 'uri'
require 'json'

require_relative 'baml_client'

b = Baml.Client

def run
  # Get the HTTP request object.
  baml_req = b.request.ExtractResume(resume: "John Doe | Software Engineer | BSc in CS")

  # Construct the Ruby HTTP client.
  uri = URI.parse(baml_req.url)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = uri.scheme == 'https'

  # Construct the Ruby HTTP request.
  req = Net::HTTP::Post.new(uri.path)
  req.initialize_http_header(baml_req.headers)
  req.body = baml_req.body.json.to_json

  # Send the HTTP request.
  response = http.request(req)

  # Parse the LLM response.
  parsed = b.parse.ExtractResume(
    llm_response: JSON.parse(response.body)["choices"][0]["message"]["content"]
  )

  # Fully parsed Resume type.
  puts parsed
end
```
</CodeBlocks>

Note that `request.body.json()` returns an object (dict in Python, hash in Ruby)
which we are then serializing to JSON, but `request.body` also exposes the raw
binary buffer so we can skip the serialization:

<CodeBlocks>
```python Python
res = requests.post(url=req.url, headers=req.headers, data=req.body.raw())
```

```typescript TypeScript
const res = await fetch(req.url, {
  method: req.method,
  headers: req.headers,
  body: req.body.raw()
})
```

```ruby Ruby
req.body = baml_req.body.raw.pack("C*")
```
</CodeBlocks>

## Using Provider SDKs

We can use the same modular API with the official SDKs. Here are some examples:

### [OpenAI](https://platform.openai.com/docs/quickstart?api-mode=chat)

<CodeBlocks>
```python Python
from openai import AsyncOpenAI
from baml_client import b

async def run():
  # Initialize the OpenAI client.
  client = AsyncOpenAI()

  # Get the HTTP request object.
  req = await b.request.ExtractResume("John Doe | Software Engineer | BSc in CS")

  # Use the openai library to send the request.
  res = await client.chat.completions.create(**req.body.json())

  # Parse the LLM response.
  parsed = b.parse.ExtractResume(res.choices[0].message.content)

  # Fully parsed Resume type.
  print(parsed)
```

```typescript TypeScript
import OpenAI from 'openai'
import { b } from 'baml_client'

async function run() {
  // Initialize the OpenAI client.
  const client = new OpenAI()

  // Get the HTTP request object.
  const req = await b.request.ExtractResume("John Doe | Software Engineer | BSc in CS")

  // Use the openai library to send the request.
  const res = await client.chat.completions.create(req.body.json())

  // Parse the LLM response.
  const parsed = b.parse.ExtractResume(res.choices[0].message.content!)

  // Fully parsed Resume type.
  console.log(parsed)
}
```
</CodeBlocks>

### [Anthropic](https://docs.anthropic.com/en/api/client-sdks)

Remember that the client is defined in the BAML function (or you can use the
[client registry](./client-registry.mdx)):

```baml BAML {2}
function ExtractResume(resume: string) -> Resume {
  client "anthropic/claude-3-haiku"
  // Prompt here...
}
```

<CodeBlocks>
```python Python
import anthropic
from baml_client import b

async def run():
  # Initialize the Anthropic client.
  client = anthropic.AsyncAnthropic()

  # Get the HTTP request object.
  req = await b.request.ExtractResume("John Doe | Software Engineer | BSc in CS")

  # Use the anthropic library to send the request.
  res = await client.messages.create(**req.body.json())

  # Parse the LLM response.
  parsed = b.parse.ExtractResume(res.content[0].text)

  # Fully parsed Resume type.
  print(parsed)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk'
import { b } from 'baml_client'

async function run() {
  // Initialize the Anthropic client.
  const client = new Anthropic()

  // Get the HTTP request object.
  const req = await b.request.ExtractResume("John Doe | Software Engineer | BSc in CS")

  // Use the anthropic library to send the request.
  const res = await client.messages.create(req.body.json())

  // Narrow type so that TS doesn't complain below.
  // https://github.com/anthropics/anthropic-sdk-typescript/issues/432
  if (res.content[0].type != "text") {
    return console.error("Unexpected type for content block: ", res.content[0])
  }

  // Parse the LLM response.
  const parsed = b.parse.ExtractResume(res.content[0].text)

  // Fully parsed Resume type.
  console.log(parsed)
}
```
</CodeBlocks>

### [Google Gemini](https://ai.google.dev/gemini-api/docs/quickstart)

Remember that the client is defined in the BAML function (or you can use the
[client registry](./client-registry.mdx)):

```baml BAML {2}
function ExtractResume(resume: string) -> Resume {
  client "google-ai/gemini-1.5-pro-001"
  // Prompt here...
}
```

<CodeBlocks>
```python Python
from google import genai
from baml_client import b

async def run():
  # Initialize the Gemini client.
  client = genai.Client()

  # Get the HTTP request object.
  req = await b.request.ExtractResume("John Doe | Software Engineer | BSc in CS")

  # Get the request body.
  body = req.body.json()

  # Use the gemini library to send the request.
  res = await client.aio.models.generate_content(
    model="gemini-1.5-pro-001",
    contents=body["contents"],
    config={
      "safety_settings": [body["safetySettings"]] # REST API uses camelCase
    }
  )

  # Parse the LLM response.
  parsed = b.parse.ExtractResume(res.text)

  # Fully parsed Resume type.
  print(parsed)
```

```typescript TypeScript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { b } from 'baml_client'

async function run() {
  // Initialize the Gemini client.
  const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
  const model = client.getGenerativeModel({ model: "gemini-1.5-pro-001" })

  // Get the HTTP request object.
  const req = await b.request.ExtractResume("John Doe | Software Engineer | BSc in CS")

  // Use the gemini library to send the request.
  const res = await model.generateContent(req.body.json())

  // Parse the LLM response.
  const parsed = b.parse.ExtractResume(res.response.text())

  // Fully parsed Resume type.
  console.log(parsed)
}
```
</CodeBlocks>

## Type Checking

### Python

The return type of `request.body.json()` is `Any` so you won't get full type
checking in Python when using the SDKs. Here are some workarounds:

**1. Using `typing.cast`**

<Tabs>
  <Tab title="OpenAI" language="openai">
    ```python OpenAI
    import typing
    from openai.types.chat import ChatCompletion

    res = typing.cast(ChatCompletion, await client.chat.completions.create(**req.body.json()))
    ```
  </Tab>

  <Tab title="Anthropic" language="anthropic">
    ```python Anthropic
    import typing
    from anthropic.types import Message

    res = typing.cast(Message, await client.messages.create(**req.body.json()))
    ```
  </Tab>
</Tabs>

**2. Manually setting the arguments**

```python OpenAI
body = req.body.json()
res = await client.chat.completions.create(model=body["model"], messages=body["messages"])
```

This will preserve the type hints for the OpenAI SDK but it doesn't work for
Anthropic. On the other hand, Gemini SDK / REST API is built in such a way that
it basically forces us to use this pattern as seen in the
[example above](#google-gemini).

### TypeScript

TypeScript doesn't have optional parameters like Python, it uses objects instead
so you can just cast to the expected type:

<Tabs>
  <Tab title="OpenAI" language="openai">
    ```typescript OpenAI
    import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';

    const res = await client.chat.completions.create(req.body.json() as ChatCompletionCreateParamsNonStreaming)
    ```
  </Tab>

  <Tab title="Anthropic" language="anthropic">
    ```typescript Anthropic
    import { MessageCreateParamsNonStreaming } from '@anthropic-ai/sdk/resources';

    const res = await client.messages.create(req.body.json() as MessageCreateParamsNonStreaming)
    ```
  </Tab>

  <Tab title="Gemini" language="Gemini">
    ```typescript Gemini
    import { GenerateContentRequest } from '@google/generative-ai';

    const res = await model.generateContent(req.body.json() as GenerateContentRequest)
    ```
  </Tab>
</Tabs>

## Streaming

Stream requests and parsing is also supported. Here's an example using OpenAI
SDK:

<CodeBlocks>
```python Python
import typing
from openai import AsyncOpenAI, AsyncStream
from openai.types.chat import ChatCompletionChunk
from baml_client import b

async def run():
  client = AsyncOpenAI()

  req = await b.stream_request.ExtractResume("John Doe | Software Engineer | BSc in CS")

  stream = typing.cast(
    AsyncStream[ChatCompletionChunk],
    await client.chat.completions.create(**req.body.json())
  )

  llm_response: list[str] = []

  async for chunk in stream:
    if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None:
      llm_response.append(chunk.choices[0].delta.content)
      # You can parse the partial responses as they come in.
      print(b.parse_stream.ExtractResume("".join(llm_response)))
```

```typescript TypeScript
import OpenAI from 'openai'
import { ChatCompletionCreateParamsStreaming } from 'openai/resources';
import { b } from 'baml_client'

async function run() {
  const client = new OpenAI()

  const req = await b.streamRequest.ExtractResume("John Doe | Software Engineer | BSc in CS")

  const stream = await client.chat.completions.create(
    req.body.json() as ChatCompletionCreateParamsStreaming
  )

  let llmResponse: string[] = []

  for await (const chunk of stream) {
    if (chunk.choices.length > 0 && chunk.choices[0].delta.content) {
      llmResponse.push(chunk.choices[0].delta.content)
      // You can parse the partial responses as they come in.
      console.log(b.parseStream.ExtractResume(llmResponse.join('')))
    }
  }
}
```
</CodeBlocks>

## OpenAI Batch API Example

Currently, BAML doesn't support OpenAI's [Batch API](https://platform.openai.com/docs/guides/batch)
out of the box, but you can use the modular API to build the prompts and parse
the responses of batch jobs. Here's an example:

<CodeBlocks>
```python Python
import asyncio
import json
from openai import AsyncOpenAI
from baml_py import HTTPRequest as BamlHttpRequest
from baml_client import b
from baml_client import types

async def run():
  client = AsyncOpenAI()

  # Build the batch requests with BAML.
  john_req, jane_req = await asyncio.gather(
    b.request.ExtractResume("John Doe | Software Engineer | BSc in CS"),
    b.request.ExtractResume("Jane Smith | Data Scientist | PhD in Statistics"),
  )

  # Build the JSONL content.
  jsonl = to_openai_jsonl(john_req) + to_openai_jsonl(jane_req)

  # Create the batch input file.
  batch_input_file = await client.files.create(
    file=jsonl.encode("utf-8"),
    purpose="batch",
  )

  # Create the batch.
  batch = await client.batches.create(
    input_file_id=batch_input_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
    metadata={
      "description": "BAML Modular API Python Batch Example"
    },
  )

  # Wait for the batch to complete (exponential backoff).
  backoff = 2
  attempts = 0
  max_attempts = 5

  while True:
    batch = await client.batches.retrieve(batch.id)
    attempts += 1

    if batch.status == "completed":
        break

    if attempts >= max_attempts:
      try:
        await client.batches.cancel(batch.id)
      finally:
        raise Exception("Batch failed to complete in time")

    await asyncio.sleep(backoff)
    back_off *= 2

  # Retrieve the batch output file.
  output = await client.files.content(batch.output_file_id)

  # You can match the batch results using the BAML request IDs.
  expected = {
    john_req.id: types.Resume(
      name="John Doe",
      experience=["Software Engineer"],
      education=["BSc in CS"]
    ),
    jane_req.id: types.Resume(
      name="Jane Smith",
      experience=["Data Scientist"],
      education=["PhD in Statistics"]
    ),
  }

  resumes = {}

  for line in output.text.splitlines():
    result = json.loads(line)
    llm_response = result["response"]["body"]["choices"][0]["message"]["content"]

    parsed = b.parse.ExtractResume(llm_response)
    resumes[result["custom_id"]] = parsed

  print(resumes)

  # Should be equal.
  assert resumes == expected


def to_openai_jsonl(req: BamlHttpRequest) -> str:
  """ Helper that converts a BAML HTTP request to OpenAI JSONL format. """
  line = json.dumps({
    "custom_id": req.id, # Important for matching the batch results.
    "method": "POST",
    "url": "/v1/chat/completions",
    "body": req.body.json(),
  })

  return f"{line}\n"
```

```typescript TypeScript
import OpenAI from 'openai'
import { HTTPRequest as BamlHttpRequest } from '@boundaryml/baml'
import { Resume } from "baml_client/types"
import { b } from 'baml_client'

async function run() {
  const client = new OpenAI()

  // Build the batch requests with BAML.
  const [johnReq, janeReq] = await Promise.all([
    b.request.ExtractResume("John Doe | Software Engineer | BSc in CS"),
    b.request.ExtractResume("Jane Smith | Data Scientist | PhD in Statistics"),
  ])

  const jsonl = toOpenaiJsonl(johnReq) + toOpenaiJsonl(janeReq)

  // Create batch input file.
  const batchInputFile = await client.files.create({
    file: new File([jsonl], 'batch.jsonl'),
    purpose: 'batch',
  })

  // Create batch.
  let batch = await client.batches.create({
    input_file_id: batchInputFile.id,
    endpoint: '/v1/chat/completions',
    completion_window: '24h',
    metadata: {
      description: 'BAML Modular API TypeScript Batch Example'
    },
  })

  // Wait for the batch to complete (exponential backoff).
  let backoff = 1000 // ms
  let attempts = 0
  const maxAttempts = 30

  while (true) {
    batch = await client.batches.retrieve(batch.id)
    attempts += 1

    if (batch.status === 'completed') {
      break
    }

    if (attempts >= maxAttempts) {
      try {
        await client.batches.cancel(batch.id)
      } finally {
        throw 'Batch failed to complete in time'
      }
    }

    await new Promise(resolve => setTimeout(resolve, backoff))
    backoff *= 2
  }

  // Retrieve the batch output file.
  const output = await client.files.content(batch.output_file_id!)

  const resumes: Record<string, Resume> = {}
  const outputJsonl = await output.text()

  // Process the batch results (skip empty lines).
  for (const line of outputJsonl.split("\n").filter(line => line.trim().length > 0)) {
    const result = JSON.parse(line.trim())
    const llmResponse = result.response.body.choices[0].message.content

    const parsed = b.parse.ExtractResume(llmResponse)
    resumes[result.custom_id] = parsed
  }

  // The resumes object should contain this.
  // With Jest we can compare using `expect(resumes).toEqual(expected)`.
  const expected: Record<string, Resume> = {
    [johnReq.id]: JOHN_DOE_PARSED_RESUME,
    [janeReq.id]: JANE_SMITH_PARSED_RESUME,
  }

  console.log(resumes)
}

// Helper function to convert BAML HTTP request to OpenAI batch JSONL format
function toOpenaiJsonl(req: BamlHttpRequest): string {
  const line = JSON.stringify({
    custom_id: req.id,
    method: 'POST',
    url: '/v1/chat/completions',
    body: req.body.json(),
  })

  return `${line}\n`
}
```
</CodeBlocks>

---
title: Prompt Caching / Message Role Metadata
---

Recall that an LLM request usually looks like this, where it sometimes has metadata in each `message`. In this case, Anthropic has a `cache_control` key.

```curl {3,11} Anthropic Request
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "anthropic-beta: prompt-caching-2024-07-31" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [
       {
        "type": "text", 
        "text": "<the entire contents of Pride and Prejudice>",
        "cache_control": {"type": "ephemeral"}
      },
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'
```


This is nearly the same as this BAML code, minus the `cache_control` metadata:


Let's add the `cache-control` metadata to each of our messages in BAML now.
There's just 2 steps:

<Steps>
### Allow role metadata and header in the client definition
```baml {5-8} main.baml
client<llm> AnthropicClient {
  provider "anthropic"
  options {
    model "claude-3-5-sonnet-20241022"
    allowed_role_metadata ["cache_control"]
    headers {
      "anthropic-beta" "prompt-caching-2024-07-31"
    }
  }
}
```

### Add the metadata to the messages
```baml {2,6} main.baml
function AnalyzeBook(book: string) -> string {
  client<llm> AnthropicClient
  prompt #"
    {{ _.role("user") }}
    {{ book }}
    {{ _.role("user", cache_control={"type": "ephemeral"}) }}
    Analyze the major themes in Pride and Prejudice.
  "#
}
```

</Steps>

We have the "allowed_role_metadata" so that if you swap to other LLM clients, we don't accidentally forward the wrong metadata to the new provider API.


<Tip>
Remember to check the "raw curl" checkbox in the VSCode Playground to see the exact request being sent!
</Tip>

---
title: Reusing Prompt Snippets
---


Writing prompts requires a lot of string manipulation. BAML has a `template_string` to let you combine different string templates together. Under-the-hood they use [jinja](/ref/prompt-syntax/what-is-jinja) to evaluate the string and its inputs.

**Template Strings are functions that always return a string.** They can be used to define reusable parts of a prompt, or to make the prompt more readable by breaking it into smaller parts.

Example
```baml BAML
// Inject a list of "system" or "user" messages into the prompt.
// Note the syntax -- there are no curlies. Just a string block.
template_string PrintMessages(messages: Message[]) #"
  {% for m in messages %}
    {{ _.role(m.role) }}
    {{ m.message }}
  {% endfor %}
"#

function ClassifyConversation(messages: Message[]) -> Category[] {
  client GPT4Turbo
  prompt #"
    Classify this conversation:
    {{ PrintMessages(messages) }}

    Use the following categories:
    {{ ctx.output_format}}
  "#
}
```

In this example we can call the template_string `PrintMessages` to subdivide the prompt into "user" or "system" messages using `_.role()` (see [message roles](/ref/prompt-syntax/role)). This allows us to reuse the logic for printing messages in multiple prompts. 

You can nest as many template strings inside each other and call them however many times you want.

<Warning>
  The BAML linter may give you a warning when you use template strings due to a static analysis limitation. You can ignore this warning. If it renders in the playground, you're good!
</Warning>
Use the playground preview to ensure your template string is being evaluated correctly!

# Extracting Action Items from Meeting Transcripts

In this tutorial, you'll learn how to build a BAML function that automatically extracts structured action items from meeting transcripts. By the end, you'll have a working system that can identify tasks, assignees, priorities, subtasks, and dependencies.

## Prerequisites

- Basic understanding of BAML syntax
- An OpenAI API key configured in your environment

## Step 1: Define the Data Models

First, let's define the data structures for our tasks. Create a new BAML file called `action_items.baml` and add these class definitions:

```baml action_items.baml
class Subtask {
  id int
  name string
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

class Ticket {
  id int
  name string 
  description string
  priority Priority
  assignees string[]
  subtasks Subtask[]
  dependencies int[]
}
```

These models define:
- A `Subtask` class for breaking down larger tasks
- A `Priority` enum for task urgency levels
- A `Ticket` class that represents a complete task with all its metadata

## Step 2: Create the Task Extraction Function

Next, we'll create a function that uses GPT-4 to analyze meeting transcripts and extract tasks:

```baml action_items.baml
function ExtractTasks(transcript: string) -> Ticket[] {
  client "openai/gpt-4"
  prompt #"
    You are an expert at analyzing meeting transcripts and extracting structured action items and tasks.
    Extract all action items, tasks and subtasks from the meeting transcript below.
    For each task:
    - Generate a unique ID
    - Include who is assigned to it
    - Set appropriate priority level
    - Identify subtasks if any
    - Note any dependencies on other tasks

    {{ ctx.output_format }}

    {{ _.role("user") }} {{ transcript }}
  "#
}
```

This function:
- Takes a meeting transcript as input
- Returns an array of `Ticket` objects
- Uses GPT-4 to analyze the transcript
- Includes clear instructions in the prompt for task extraction

## Step 3: Test the Implementation

Let's add test cases to verify our implementation works correctly. Add these test cases to your BAML file:

```baml action_items.baml
test SimpleTranscript {
  functions [ExtractTasks]
  args {
    transcript #"
        Alice: We need to update the website by next week. This is high priority.
        Bob: I can handle that. I'll need Carol's help with the design though.
        Carol: Sure, I can help with the design part.
    "#
  }
}

test ComplexTranscript {
  functions [ExtractTasks]
  args {
    transcript #"
        Alice: Hey team, we have several critical tasks we need to tackle for the upcoming release. First, we need to work on improving the authentication system. It's a top priority.
        Bob: Got it, Alice. I can take the lead on the authentication improvements. Are there any specific areas you want me to focus on?
        Alice: Good question, Bob. We need both a front-end revamp and back-end optimization. So basically, two sub-tasks.
        Carol: I can help with the front-end part of the authentication system.
        Bob: Great, Carol. I'll handle the back-end optimization then.
        Alice: Perfect. Now, after the authentication system is improved, we have to integrate it with our new billing system. That's a medium priority task.
        Carol: Is the new billing system already in place?
        Alice: No, it's actually another task. So it's a dependency for the integration task. Bob, can you also handle the billing system?
        Bob: Sure, but I'll need to complete the back-end optimization of the authentication system first, so it's dependent on that.
        Alice: Understood. Lastly, we also need to update our user documentation to reflect all these changes. It's a low-priority task but still important.
        Carol: I can take that on once the front-end changes for the authentication system are done. So, it would be dependent on that.
        Alice: Sounds like a plan. Let's get these tasks modeled out and get started.
    "#
  }
}
```

These tests provide:
- A simple case with a single task and subtask
- A complex case with multiple tasks, priorities, dependencies, and assignees

This is what you see in the BAML playground:
<img src="../../assets/guide/action-items-simple.png"/>

This is the output from the complex test case: 

``` output.txt
[
  {
    "id": 1,
    "name": "Improve Authentication System",
    "description": "Overhaul the authentication system focusing on both front-end and back-end aspects.",
    "priority": "HIGH",
    "assignees": ["Bob", "Carol"],
    "subtasks": [
      {
        "id": 2,
        "name": "Front-end Revamp"
      },
      {
        "id": 3,
        "name": "Back-end Optimization"
      }
    ],
    "dependencies": []
  },
  {
    "id": 4,
    "name": "Develop Billing System",
    "description": "Create a new billing system which will be integrated with the authentication system.",
    "priority": "MEDIUM",
    "assignees": ["Bob"],
    "subtasks": [],
    "dependencies": [3]
  },
  {
    "id": 5,
    "name": "Integrate Authentication System with Billing System",
    "description": "Integrate the improved authentication system with the new billing system.",
    "priority": "MEDIUM",
    "assignees": ["Bob"],
    "subtasks": [],
    "dependencies": [3, 4]
  },
  {
    "id": 6,
    "name": "Update User Documentation",
    "description": "Update the user documentation to reflect changes in the authentication and billing systems.",
    "priority": "LOW",
    "assignees": ["Carol"],
    "subtasks": [],
    "dependencies": [2, 5]
  }
]
```


## What's Next?

You can enhance this implementation by:
- Adding due dates to the `Ticket` class
- Including status tracking for tasks
- Adding validation for task dependencies
- Implementing custom formatting for the extracted tasks

## Common Issues and Solutions

- If tasks aren't being properly identified, try adjusting the prompt to be more specific
- If priorities aren't being set correctly, consider adding examples in the prompt
- For complex transcripts, you might need to adjust the model parameters for better results

---
title: Chain-of-Thought Prompting
---

Chain-of-thought prompting is a technique that encourages the language model to think step by step, reasoning through the problem before providing an answer. This can improve the quality of the response and make it easier to understand.

<Frame caption="Chain-of-Thought Prompting [Wei et al. (2022)](https://arxiv.org/abs/2201.11903)">
  <img src="../../assets/guide/cot.png" alt="Chain-of-Thought Prompting"/>
</Frame>


There are a few different ways to implement chain-of-thought prompting, especially for structured outputs.

1. Require the model to reason before outputting the structured object.
    - Bonus: Use a `template_string` to embed the reasoning into multiple functions.
2. Require the model to **flexibly** reason before outputting the structured object.
3. Embed reasoning in the structured object.
4. Ask the model to embed reasoning as comments in the structured object.

Let's look at an example of each of these.

<Tip>
  We recommend [Technique 2](#technique-2-allowing-for-flexible-reasoning) for most use cases.
  But each technique has its own trade-offs, so please try them out and see which one works best for your use case.
</Tip>

<Info>
  Since BAML leverages [Schema-Aligned Parsing (SAP)](https://www.boundaryml.com/blog/schema-aligned-parsing) instead of JSON.parse or LLM modification (like constrained generation or structured outputs), we can do all of the above techniques with any language model!
</Info>

## Technique 1: Reasoning before outputting the structured object

In the below example, we use chain of thought prompting to extract information from an email.

```baml {9-17}
function GetOrderInfo(email: Email) -> OrderInfo {
  client "openai/gpt-4o-mini"
  prompt #"
    extract everything from this email.


    {{ ctx.output_format }}

    Before you answer, please explain your reasoning step-by-step. 
    
    For example:
    If we think step by step we can see that ...

    Therefore the output is:
    {
      ... // schema
    }

    {{ _.role('user') }}

    Sender: {{email.from_address}}
    Email Subject: {{email.subject}}
    Email Body: {{email.body}}
  "#
}

class Email {
    subject string
    body string
    from_address string
}


class OrderInfo {
    order_status "ORDERED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
    tracking_number string?
    estimated_arrival_date string?
}

test Test1 {
  functions [GetOrderInfo]
  args {
    email {
      from_address "hello@amazon.com"
      subject "Your Amazon.com order of 'Wood Dowel Rods...' has shipped!"
      body #"
        Hi Sam, your package will arrive:
        Thurs, April 4
        Track your package:
        www.amazon.com/gp/your-account/ship-track?ie=23&orderId123

        On the way:
        Wood Dowel Rods...
        Order #113-7540940
        Ship to:
            Sam
            SEATTLE, WA

        Shipment total:
        $0.00
    "#

    }
  }
}
```


### Reusable Chain-of-Thought Snippets

You may want to reuse the same technique for multiple functions. Consider [template_string](/ref/baml/template-string)!

```baml {1-12, 21}
template_string ChainOfThought(action: string?) #"
    Before you answer, please explain your reasoning step-by-step.
    {% if action %}{{ action }}{% endif %}
    
    For example:
    If we think step by step we can see that ...

    Therefore the output is:
    {
      ... // schema
    }
"#

function GetOrderInfo(email: Email) -> OrderInfo {
  client "openai/gpt-"
  prompt #"
    Extract everything from this email.

    {{ ctx.output_format }}

    {{ ChainOfThought("focus on things related to shipping") }}

    {{ _.role('user') }}

    Sender: {{email.from_address}}
    Email Subject: {{email.subject}}
    Email Body: {{email.body}}
  "#
}

```

## Technique 2: Allowing for flexible reasoning

<Tip>
  This is one we recommend for most use cases.
</Tip>

```baml {9-16}
function GetOrderInfo(email: Email) -> OrderInfo {
  client "openai/gpt-"
  prompt #"
    extract everything from this email.


    {{ ctx.output_format }}

    Outline some relevant information before you answer.
    Example:
    - ...
    - ...
    ...
    {
      ... // schema
    }

    {{ _.role('user') }}

    Sender: {{email.from_address}}
    Email Subject: {{email.subject}}
    Email Body: {{email.body}}
  "#
}
```

The benefit of using `- ...` is that we allow the model to know it needs to output some information, but we don't limit it to a specific format or inject any bias by adding example text that may not be relevant.

Similarly, we use `...` after two `- ...` to indicate that we don't mean to limit the number of items to 2.

<Accordion title="Reuseable snippet">

```baml {1-10, 19}
template_string ChainOfThought() #"
    Outline some relevant information before you answer.
    Example:
    - ...
    - ...
    ...
    {
      ... // schema
    }
"#

function GetOrderInfo(email: Email) -> OrderInfo {
  client "openai/gpt-"
  prompt #"
    extract everything from this email.

    {{ ctx.output_format }}

    {{ ChainOfThought() }}

    {{ _.role('user') }}

    Sender: {{email.from_address}}
    Email Subject: {{email.subject}}
    Email Body: {{email.body}}
  "#
}
```
</Accordion>

## Technique 3: Embed reasoning in the structured object

```baml {2-4}
class OrderInfo {
    clues string[] @description(#"
      relevant quotes from the email related to shipping
    "#)
    order_status "ORDERED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
    tracking_number string?
    estimated_arrival_date string?
}

function GetOrderInfo(email: Email) -> OrderInfo {
  client "openai/gpt-"
  prompt #"
    extract everything from this email.

    {{ ctx.output_format }}

    {{ _.role('user') }}

    Sender: {{email.from_address}}
    Email Subject: {{email.subject}}
    Email Body: {{email.body}}
  "#
}
```

## Technique 4: Ask the model to embed reasoning as comments in the structured object

```baml {3-5}
class OrderInfo {
    order_status "ORDERED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
      @description(#"
        before fields, in comments list out any relevant clues from the email
      "#)
    tracking_number string?
    estimated_arrival_date string?
}

function GetOrderInfo(email: Email) -> OrderInfo {
  client "openai/gpt-"
  prompt #"
    extract everything from this email.

    {{ ctx.output_format }}

    {{ _.role('user') }}

    Sender: {{email.from_address}}
    Email Subject: {{email.subject}}
    Email Body: {{email.body}}
  "#
}
```

---
title: Chat
---

In this guide we'll build a small chatbot that takes in user messages and generates responses.


```baml chat-history.baml
class MyUserMessage {
  role "user" | "assistant"
  content string
}

function ChatWithLLM(messages: MyUserMessage[]) -> string {
  client "openai/gpt-4o"
  prompt #"
    Answer the user's questions based on the chat history:
    {% for message in messages %}
      {{ _.role(message.role) }} 
      {{ message.content }}
    {% endfor %}

    Answer:
  "#
}

test TestName {
  functions [ChatWithLLM]
  args {
    messages [
      {
        role "user"
        content "Hello!"
      }
      {
        role "assistant"
        content "Hi!"
      }
    ]
  }
}

```

#### Code
<CodeGroup>
```python Python
from baml_client import b
from baml_client.types import MyUserMessage

def main():
    messages: list[MyUserMessage] = []
    
    while True:
        content = input("Enter your message (or 'quit' to exit): ")
        if content.lower() == 'quit':
            break
        
        messages.append(MyUserMessage(role="user", content=content))
        
        agent_response = b.ChatWithLLM(messages=messages)
        print(f"AI: {agent_response}")
        print()
        
        # Add the agent's response to the chat history
        messages.append(MyUserMessage(role="assistant", content=agent_response))

if __name__ == "__main__":
    main()
```
```typescript Typescript
import { b, MyUserMessage } from 'baml_client';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const messages: MyUserMessage[] = [];

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {

  while (true) {
    const content = await askQuestion("Enter your message (or 'quit' to exit): ");
    if (content.toLowerCase() === 'quit') {
      break;
    }

    messages.push({ role: "user", content });

    const agentResponse = await b.ChatWithLLM({ messages });
    console.log(`AI: ${agentResponse}`);
    console.log();

    // Add the agent's response to the chat history
    messages.push({ role: "assistant", content: agentResponse });
  }

  rl.close();
}

main();
```
</CodeGroup>

---
title: Classification
---

# Building a Spam Classifier with BAML

In this tutorial, you'll learn how to create a simple but effective spam classifier using BAML and OpenAI's GPT models. By the end, you'll have a working classifier that can distinguish between spam and legitimate messages.

## Prerequisites

- Basic understanding of BAML syntax
- Access to OpenAI API (you'll need an API key)

## Step 1: Define the Classification Schema

First, let's define what our classification output should look like. Create a new file called `spam_classifier.baml` and add the following schema:

```baml
enum MessageType {
  SPAM
  NOT_SPAM
}
```

This schema defines a simple classification with two possible labels: `SPAM` or `NOT_SPAM`.

## Step 2: Create the Classification Function

Next, we'll create a function that uses GPT-4 to classify text. Add this to your `spam_classifier.baml` file:

```baml
function ClassifyText(input: string) -> MessageType {
  client "openai/gpt-4o-mini"
  prompt #"
    Classify the message. 

    {{ ctx.output_format }}

    {{ _.role("user") }} 
    
    {{ input }}
  "#
}
```

Let's break down what this function does:
- Takes an input as a string
- Uses the `gpt-4o-mini` model
- Provides clear guidelines for classification in the prompt
- Returns a MessageType

## Step 3: Test the Classifier

To ensure our classifier works correctly, let's add some test cases:

```baml
test BasicSpamTest {
  functions [ClassifyText]
  args {
    input "Buy cheap watches now! Limited time offer!!!"
  }
}

test NonSpamTest {
  functions [ClassifyText]
  args {
    input "Hey Sarah, can we meet at 3 PM tomorrow to discuss the project?"
  }
}
```

This is what it looks like in the BAML Playground:
<img src="../../assets/guide/classification-1_m.png"/>

## Try it yourself in the Interactive Playground!

Now that you have your classifier set up, try it with your own examples. Here are some messages you can test:

1. "Meeting at 2 PM in the conference room"
2. "CONGRATULATIONS! You've won $1,000,000!!!"
3. "Can you review the document I sent yesterday?"
4. "Make money fast! Work from home!!!"

 <div class="resizer">
<iframe
  class="resized"
  src="https://promptfiddle.com/embed?id=classification"
 
  height="640"
  style="border: none;"
  resize="both"
  overflow="auto"
  msallowfullscreen
></iframe>
</div>

## Next Steps

- Experiment with different prompt templates to improve accuracy
- Add more spam indicators to the classification criteria
- Create a more complex classification schema with confidence scores
- Try using different GPT models to compare performance

# Multi-Label Classification

While the spam classifier demonstrates single-label classification (where each input belongs to exactly one category), many real-world problems require multiple labels. Let's build a support ticket classifier that can assign multiple relevant categories to each ticket.

## Step 1: Define the Label Enum and Schema

Create a new file called `ticket_classifier.baml` and define the possible ticket categories as an enum:

```baml
enum TicketLabel {
  ACCOUNT
  BILLING
  GENERAL_QUERY
}

class TicketClassification {
  labels TicketLabel[]
}
```

Notice how this schema differs from our spam classifier:
- We use an `enum` to define valid labels
- The `labels` field is an array (`TicketLabel[]`), allowing multiple labels per ticket

## Step 2: Create the Multi-Label Classification Function

Add the classification function to your `ticket_classifier.baml` file:

```baml
function ClassifyTicket(ticket: string) -> TicketClassification {
  client "openai/gpt-4o-mini"
  prompt #"
    You are a support agent at a tech company. Analyze the support ticket and select all applicable labels.

    {{ ctx.output_format }}

    {{ _.role("user") }}
    
    {{ ticket }}
  "#
}
```

Key differences from the spam classifier:
- The prompt includes examples showing both single and multiple labels
- Examples demonstrate how labels can overlap
- The model is instructed to consider all applicable labels

## Step 3: Test Multi-Label Classification

Add test cases that cover both single-label and multi-label scenarios:

```baml
test ClassifyTicketSingleLabel {
  functions [ClassifyTicket]
  args {
    ticket "I need help resetting my password"
  }
}

test ClassifyTicketMultiLabel {
  functions [ClassifyTicket]
  args {
    ticket "My account is locked and I can't access my billing information"
  }
}
```

This is what it looks like in the BAML Playground:
<img src="../../assets/guide/classification-2_m.png"/>

## Try it yourself!

Test the multi-label classifier with these examples:

1. "How do I upgrade my subscription plan?"
2. "I forgot my password and need to update my payment method"
3. "What are the features included in the premium plan?"
4. "My account is showing incorrect billing history"

## Tips for Multi-Label Classification

1. **Balanced Examples**: Include examples in your prompt that show both single and multiple labels
2. **Clear Descriptions**: Add descriptive annotations to help the model understand each label
3. **Test Edge Cases**: Include test cases that verify the model can handle:
   - Single label cases
   - Multiple label cases
   - Edge cases where no labels apply

---
title: Reduce Hallucinations
---

We recommend these simple ways to reduce hallucinations:


### 1. Set temperature to 0.0 (especially if extracting data verbatim)
This will make the model less creative and more likely to just extract the data that you want verbatim.
```baml clients.baml
client<llm> MyClient {
  provider openai
  options {
    temperature 0.0
  }
}
```

### 2. Reduce the number of input tokens
Reduce the amount of data you're giving the model to process to reduce confusion.

Prune as much data as possible, or split your prompt into multiple prompts analyzing subsets of the data.

If you're processing `images`, try cropping the parts of the image that you don't need. LLMs can only handle images of certain sizes, so every pixel counts. Make sure you resize images to the model's input size (even if the provider does the resizing for you), so you can gauge how clear the image is at the model's resolution. You'll notice the blurrier the image is, the higher the hallucination rate.

Let us know if you want more tips for processing images, we have some helper prompts we can share with you, or help debug your prompt.



### 2. Use reasoning or reflection prompting
Read our [chain-of-thought guide](/examples/prompt-engineering/chain-of-thought) for more.

### 3. Watch out for contradictions and word associations

Each word you add into the prompt will cause it to associate it with something it saw before in its training data. This is why we have techniques like [symbol tuning](/examples/prompt-engineering/symbol-tuning) to help control this bias.


Let's say you have a prompt that says:
```
Answer in this JSON schema:



But when you answer, add some comments in the JSON indicating your reasoning for the field like this:

Example:
---
{
  // I used the name "John" because it's the name of the person who wrote the prompt
  "name": "John"
}

JSON:
```

The LLM may not write the `// comment` inline, because it's been trained to associate JSON with actual "valid" JSON.

You can get around this with some more coaxing like:
```text {12,13}
Answer in this JSON schema:



But when you answer, add some comments in the JSON indicating your reasoning for the field like this:
---
{
  // I used the name "John" because it's the name of the person who wrote the prompt
  "name": "John"
}

It's ok if this isn't fully valid JSON, 
we will fix it afterwards and remove the comments.

JSON:
```

The LLM made an assumption that you want "JSON" -- which doesn't use comments -- and our instructions were not explicit enough to override that bias originally.

Keep on reading for more tips and tricks! Or reach out in our Discord 

# Building a PII Data Extraction and Scrubbing System with BAML

In this tutorial, you'll learn how to create a robust PII (Personally Identifiable Information) data extraction and scrubbing system using BAML and GPT-4. By the end, you'll have a working system that can identify, extract, and scrub various types of PII from text documents.

## Prerequisites

- Basic understanding of BAML syntax
- Access to OpenAI API (you'll need an API key)

## Step 1: Define the Data Schema

First, let's define what our PII data structure should look like. Create a new file called `pii_extractor.baml` and add the following schema:

```baml pii_extractor.baml
class PIIData {
  index int
  dataType string
  value string
}

class PIIExtraction {
  privateData PIIData[]
  containsSensitivePII bool @description("E.g. SSN")
}
```

This schema defines:
- `PIIData`: A class representing a single piece of PII with its type and value
- `PIIExtraction`: A container class that holds an array of PII data items and a sensitive data flag

## Step 2: Create the Extraction Function

Next, let's create the function that uses GPT-4 to extract PII. Add this to your `pii_extractor.baml` file:

```baml pii_extractor.baml
function ExtractPII(document: string) -> PIIExtraction {
  client "openai/gpt-4o-mini"
  prompt #"
    Extract all personally identifiable information (PII) from the given document. Look for items like:
    - Names
    - Email addresses
    - Phone numbers
    - Addresses
    - Social security numbers
    - Dates of birth
    - Any other personal data

    {{ ctx.output_format }}

    {{ _.role("user") }} 
    
    {{ document }}
  "#
}
```

Let's break down what this function does:
- Takes a `document` input as a string
- Uses the `gpt-4o-mini` model
- Provides clear guidelines for PII extraction in the prompt
- Returns a `PIIExtraction` object containing all found PII data

## Step 3: Test the Extractor

To ensure our PII extractor works correctly, let's add some test cases:

```baml pii_extractor.baml
test BasicPIIExtraction {
  functions [ExtractPII]
  args {
    document #"
      John Doe was born on 01/02/1980. 
      His email is john.doe@email.com and phone is 555-123-4567.
      He lives at 123 Main St, Springfield, IL 62704.
    "#
  }
}

test EmptyDocument {
  functions [ExtractPII]
  args {
    document "This document contains no PII data."
  }
}
```

This is what it looks like in BAML playground after running the test:
<img src="../../assets/guide/pii-scrubber.png"/>


<Tip>
  You can try playing with the functions and tests online at https://www.promptfiddle.com/Pii-data-O4PmJ
</Tip>


## Step 4: Implementing PII Extraction and Scrubbing

Now you can use the PII extractor to both identify and scrub sensitive information from your documents:

```python pii_scrubber.py
from baml_client import b
from baml_client.types import PIIExtraction
from typing import Dict, Tuple

def scrub_document(text: str) -> Tuple[str, Dict[str, str]]:
    # Extract PII from the document
    result = b.ExtractPII(text)
    
    # Create a mapping of real values to scrubbed placeholders
    scrubbed_text = text
    pii_mapping = {}
    
    # Process each PII item and replace with a placeholder
    for pii_item in result.privateData:
        pii_type = pii_item.dataType.upper()
        placeholder = f"[{pii_type}_{pii_item.index}]"
        
        # Store the mapping for reference
        pii_mapping[placeholder] = pii_item.value
        
        # Replace the PII with the placeholder
        scrubbed_text = scrubbed_text.replace(pii_item.value, placeholder)
    
    return scrubbed_text, pii_mapping

def restore_document(scrubbed_text: str, pii_mapping: Dict[str, str]) -> str:
    """Restore the original text using the PII mapping."""
    restored_text = scrubbed_text
    for placeholder, original_value in pii_mapping.items():
        restored_text = restored_text.replace(placeholder, original_value)
    return restored_text

# Example usage
document = """
John Smith works at Tech Corp.
You can reach him at john.smith@techcorp.com
or call 555-0123 during business hours.
His employee ID is TC-12345.
"""

# Scrub the document
scrubbed_text, pii_mapping = scrub_document(document)

print("Original Document:")
print(document)
print("\nScrubbed Document:")
print(scrubbed_text)
print("\nPII Mapping:")
for placeholder, original in pii_mapping.items():
    print(f"{placeholder}: {original}")

# If needed, restore the original document
restored_text = restore_document(scrubbed_text, pii_mapping)
print("\nRestored Document:")
print(restored_text)
```

This implementation provides several key features:
1. **PII Detection**: Uses BAML's ExtractPII function to identify PII
2. **Data Scrubbing**: Replaces PII with descriptive placeholders
3. **Mapping Preservation**: Maintains a mapping of placeholders to original values
4. **Restoration Capability**: Allows restoration of the original text when needed

Example output:
``` output.txt
Original Document:

John Smith works at Tech Corp.
You can reach him at john.smith@techcorp.com
or call 555-0123 during business hours.
His employee ID is TC-12345.


Scrubbed Document:

[NAME_1] works at Tech Corp.
You can reach him at [EMAIL_2]
or call [PHONE_3] during business hours.
His employee ID is [EMPLOYEE ID_4].


PII Mapping:
[NAME_1]: John Smith
[EMAIL_2]: john.smith@techcorp.com
[PHONE_3]: 555-0123
[EMPLOYEE ID_4]: TC-12345

Restored Document:

John Smith works at Tech Corp.
You can reach him at john.smith@techcorp.com
or call 555-0123 during business hours.
His employee ID is TC-12345.
```

## Next Steps

Now that you have a working PII extractor, you can:
- Add more specific PII types to look for
- Implement validation for extracted PII (e.g., email format checking)
- Create a more sophisticated prompt to handle edge cases
- Add error handling for malformed documents
- Integrate with your data privacy compliance system

## Enhanced Security: Using Local Models

For organizations handling sensitive data, using cloud-based LLMs like OpenAI's GPT models might not be suitable due to data privacy concerns. 
BAML supports using local models, which keeps all PII processing within your infrastructure.

In this example, we're going to use a Ollama model. 
For more details on how to use Ollama with BAML, check out [this page](/ref/llm-client-providers/openai-generic-ollama).


1. First, define your local model client in `pii_extractor.baml`:

```baml
// Please ensure you've got ollama set up with llama:3.1 installed
//
// ollama pull llama:3.1
// ollama run llama:3.1
client<llm> SecureLocalLLM {
  provider "openai-generic"
  options {
    base_url "http://localhost:11434/v1"
    model "llama3.1:latest"
    temperature 0 
    default_role "user"
  }
}
```

2. Update the ExtractPII function to use your local model:

```baml
function ExtractPII(document: string) -> PIIExtraction {
  // use a local model instead of openai
  client SecureLocalLLM
  prompt #"
    Extract all personally identifiable information (PII) from the given document. Look for items like:
    - Names
    - Email addresses
    - Phone numbers
    - Addresses
    - Social security numbers
    - Dates of birth
    - Any other personal data

    {{ ctx.output_format }}

    {{ _.role("user") }} 
    
    {{ document }}
  "#
}
```

---
title: Retrieval-Augmented Generation (RAG)
---

RAG is a commonly used technique used to improve the quality of LLM-generated responses by
grounding the model on external sources of knowledge. In this example, we'll use
BAML to manage the prompts for a RAG pipeline.

### Creating BAML functions

The most common way to implement RAG is to use a vector store that contains embeddings of
the data. First, let's define our BAML model for RAG.

#### BAML Code

```baml rag.baml
class Response {
  question string
  answer string
}

function RAG(question: string, context: string) -> Response {
  client "openai/gpt-4o-mini"
  prompt #"
    Answer the question in full sentences using the provided context.
    Do not make up an answer. If the information is not provided in the context, say so clearly.
    
    QUESTION: {{ question }}
    RELEVANT CONTEXT: {{ context }}

    {{ ctx.output_format }}

    RESPONSE:
  "#
}

test TestOne {
  functions [RAG]
  args {
    question "When was SpaceX founded?"
    context #"
      SpaceX is an American spacecraft manufacturer and space transportation company founded by Elon Musk in 2002.
    "#
  }
}

test TestTwo {
  functions [RAG]
  args {
    question "Where is Fiji located?"
    context #"
      Fiji is a country in the South Pacific known for its rugged landscapes, palm-lined beaches, and coral reefs with clear lagoons.
    "#
  }
}

test TestThree {
  functions [RAG]
  args {
    question "What is the primary product of BoundaryML?"
    context #"
      BoundaryML is the company that makes BAML, the best way to get structured outputs with LLMs.
    "#
  }
}

test TestMissingContext{
  functions [RAG]
  args {
    question "Who founded SpaceX?"
    context #"
      BoundaryML is the company that makes BAML, the best way to get structured with LLMs.
    "#
  }
}
```

Note how in the `TestMissingContext` test, the model correctly says that it doesn't know the answer
because it's not provided in the context. The model doesn't make up an answer, because of the way
we've written the prompt.

You can generate the BAML client code for this prompt by running `baml-cli generate`.

### Creating a VectorStore

Next, let's create our own minimal vector store and retriever using `scikit-learn`.

#### Python Code

```py rag.py
# Install scikit-learn and use its TfidfVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class VectorStore:
    """
    Adapted from https://github.com/MadcowD/ell/blob/main/examples/rag/rag.py
    """
    def __init__(self, vectorizer, tfidf_matrix, documents):
        self.vectorizer = vectorizer
        self.tfidf_matrix = tfidf_matrix
        self.documents = documents

    @classmethod
    def from_documents(cls, documents: list[str]) -> "VectorStore":
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(documents)
        return cls(vectorizer, tfidf_matrix, documents)

    def retrieve_with_scores(self, query: str, k: int = 2) -> list[dict]:
        query_vector = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vector, self.tfidf_matrix).flatten()
        top_k_indices = np.argsort(similarities)[-k:][::-1]
        return [
            {"document": self.documents[i], "relevance": float(similarities[i])}
            for i in top_k_indices
        ]

    def retrieve_context(self, query: str, k: int = 2) -> str:
        documents = self.retrieve_with_scores(query, k)
        return "\n".join([item["document"] for item in documents])
```

We can then build our RAG application in Python by calling the BAML client.

```py rag.py
from baml_client import b

# class VectorStore:
# ...

if __name__ == "__main__":
    documents = [
        "SpaceX is an American spacecraft manufacturer and space transportation company founded by Elon Musk in 2002.",
        "Fiji is a country in the South Pacific known for its rugged landscapes, palm-lined beaches, and coral reefs with clear lagoons.",
        "Dunkirk is a 2017 war film depicting the Dunkirk evacuation of World War II, featuring intense aerial combat scenes with Spitfire aircraft.",
        "BoundaryML is the company that makes BAML, the best way to get structured outputs with LLMs."
    ]

    vector_store = VectorStore.from_documents(documents)

    questions = [
        "What is BAML?",
        "Which aircraft was featured in Dunkirk?",
        "When was SpaceX founded?",
        "Where is Fiji located?",
        "What is the capital of Fiji?"
    ]

    for question in questions:
        context = vector_store.retrieve_context(question)
        response = b.RAG(question, context)
        print(response)
        print("-" * 10)
```

When you run the Python script, you should see output like the following:

```
question='What is BAML?' answer='BAML is a product made by BoundaryML, and it is described as the best way to get structured outputs with LLMs.'
----------
question='Which aircraft was featured in Dunkirk?' answer='The aircraft featured in Dunkirk were Spitfire aircraft.'
----------
question='When was SpaceX founded?' answer='SpaceX was founded in 2002.'
----------
question='Where is Fiji located?' answer='Fiji is located in the South Pacific.'
----------
question='What is the capital of Fiji?' answer='The information about the capital of Fiji is not provided in the context.'
----------
```

Once again, in the last question, the model correctly says that it doesn't know the answer because
it's not provided in the context.

That's it! You can now attempt such a RAG workflow with a vector database on a larger dataset.
All you have to do is point BAML to the retriever class you've implemented.

### Creating Citations with LLM

In this advanced section, we'll explore how to enhance our RAG implementation to include citations for the generated responses. This is particularly useful when you need to track the source of information in the generated responses.

First, let's extend our BAML model to support citations. We'll create a new response type and function that explicitly handles citations:

```baml rag.baml
class ResponseWithCitations {
  question string
  answer string
  citations string[]
}

function RAGWithCitations(question: string, context: string) -> ResponseWithCitations {
  client "openai/gpt-4o-mini"
  prompt #"
    Answer the question in full sentences using the provided context. 
    If the statement contains information from the context, put the exact cited quotes in complete sentences in the citations array.
    Do not make up an answer. If the information is not provided in the context, say so clearly.
    
    QUESTION: {{ question }}
    RELEVANT CONTEXT: {{ context }}
    {{ ctx.output_format }}
    RESPONSE:
  "#
}
```

Let's add a test to verify our citation functionality:

```baml rag.baml
test TestCitations {
  functions [RAGWithCitations]
  args {
    question "What can you tell me about SpaceX and its founder?"
    context #"
      SpaceX is an American spacecraft manufacturer and space transportation company founded by Elon Musk in 2002.
      The company has developed several launch vehicles and spacecraft.
      Einstein was born on March 14, 1879. 
    "#
  }
}
```

This test will demonstrate how the model:
1. Provides relevant information about SpaceX and its founder
2. Includes the exact source quotes in the citations array
3. Only uses information that's actually present in the context

To use this enhanced RAG implementation in our Python code, we simply need to update our loop to use the new `RAGWithCitations` function:

```py rag.py
for question in questions:
    context = vector_store.retrieve_context(question)
    response = b.RAGWithCitations(question, context)
    print(response)
    print("-" * 10)
```

When you run this modified code, you'll see responses that include both answers and their supporting citations. For example:

```
question='What is BAML?' answer='BAML is a product made by BoundaryML that provides the best way to get structured outputs with LLMs.' citations=['BoundaryML is the company that makes BAML, the best way to get structured outputs with LLMs.']
----------
question='Which aircraft was featured in Dunkirk?' answer='The aircraft featured in Dunkirk were Spitfire aircraft.' citations=['Dunkirk is a 2017 war film depicting the Dunkirk evacuation of World War II, featuring intense aerial combat scenes with Spitfire aircraft.']
----------
question='When was SpaceX founded?' answer='SpaceX was founded in 2002.' citations=['SpaceX is an American spacecraft manufacturer and space transportation company founded by Elon Musk in 2002.']
----------
question='Where is Fiji located?' answer='Fiji is located in the South Pacific.' citations=['Fiji is a country in the South Pacific.']
----------
question='What is the capital of Fiji?' answer='The capital of Fiji is not provided in the context.' citations=[]
----------
```

Notice how each piece of information in the answer is backed by a specific citation from the source context. This makes the responses more transparent and verifiable, which is especially important in applications where the source of information matters.

### Using Pinecone as Vector Database

Instead of using our custom vector store, we can use Pinecone, a production-ready vector database. Here's how to implement the same RAG pipeline using Pinecone:

First, install the required packages:

```bash
pip install pinecone
```

Now, let's modify our Python code to use Pinecone:

```py rag_pinecone.py
import pinecone as pc
from sentence_transformers import SentenceTransformer
from pinecone import ServerlessSpec
from baml_client import b

# Initialize Pinecone
pc = Pinecone(api_key="YOUR_API_KEY")

class PineconeStore:
    def __init__(self, index_name: str):
        self.index_name = index_name
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Create index if it doesn't exist
        if index_name not in pc.list_indexes().names():
            pc.create_index(
                name=index_name,
                dimension=self.encoder.get_sentence_embedding_dimension(),
                metric='cosine',
                spec=ServerlessSpec(
                    cloud='aws',
                    region='us-east-1'
                )
            )
        self.index = pc.Index(index_name)

    def add_documents(self, documents: list[str], ids: list[str] = None):
        if ids is None:
            ids = [str(i) for i in range(len(documents))]
        
        # Create embeddings
        embeddings = self.encoder.encode(documents)
        
        # Create vector records
        vectors = [(id, emb.tolist(), {"text": doc}) 
                  for id, emb, doc in zip(ids, embeddings, documents)]
        
        # Upsert to Pinecone
        self.index.upsert(vectors=vectors)

    def retrieve_context(self, query: str, k: int = 2) -> str:
        # Create query embedding
        query_embedding = self.encoder.encode(query).tolist()
        
        # Query Pinecone
        results = self.index.query(
            vector=query_embedding,
            top_k=k,
            include_metadata=True
        )
        
        # Extract and join the document texts
        contexts = [match.metadata["text"] for match in results.matches]
        return "\n".join(contexts)

if __name__ == "__main__":
    # Initialize Pinecone store
    vector_store = PineconeStore("baml-rag-demo")
    
    # Sample documents (same as before)
    documents = [
        "SpaceX is an American spacecraft manufacturer and space transportation company founded by Elon Musk in 2002.",
        "Fiji is a country in the South Pacific known for its rugged landscapes, palm-lined beaches, and coral reefs with clear lagoons.",
        "Dunkirk is a 2017 war film depicting the Dunkirk evacuation of World War II, featuring intense aerial combat scenes with Spitfire aircraft.",
        "BoundaryML is the company that makes BAML, the best way to get structured outputs with LLMs."
    ]
    
    # Add documents to Pinecone
    vector_store.add_documents(documents)
    
    # Test questions (same as before)
    questions = [
        "What is BAML?",
        "Which aircraft was featured in Dunkirk?",
        "When was SpaceX founded?",
        "Where is Fiji located?",
        "What is the capital of Fiji?"
    ]

    # Query using the same BAML functions
    for question in questions:
        context = vector_store.retrieve_context(question)
        response = b.RAGWithCitations(question, context)
        print(response)
        print("-" * 10)
```

The key differences when using Pinecone are:

1. Documents are stored in Pinecone's serverless infrastructure on AWS instead of in memory
2. We can persist our vector database across sessions

Here is a snapshot of the entriies in our Pinecone database console:
<img src="../../assets/guide/pinecone-rag-example.png" width="600px" height="auto" />

Note that you'll need to:
1. [Create a Pinecone account](https://www.pinecone.io/)
2. Get your API key from the Pinecone console
3. Replace `YOUR_API_KEY` with your actual Pinecone credentials
4. Make sure you have access to the serverless offering in your Pinecone account

The BAML functions (`RAG` and `RAGWithCitations`) remain exactly the same, demonstrating how BAML cleanly separates the prompt engineering from the implementation details of your vector database.

When you run this code, you'll get the same type of responses as before, but now you're using a production-ready serverless vector database that can scale automatically based on your usage.


---
title: Creating a Classification Function with Symbol Tuning
---

Aliasing field names to abstract symbols like "k1", "k2", etc. can improve classification results. This technique, known as symbol tuning, helps the LLM focus on your descriptions rather than being biased by the enum or property names themselves.

See the paper [Symbol Tuning Improves In-Context Learning in Language Models](https://arxiv.org/abs/2305.08298) for more details.

```baml
enum MyClass {
    Refund @alias("k1")
    @description("Customer wants to refund a product")

    CancelOrder @alias("k2")
    @description("Customer wants to cancel an order")

    TechnicalSupport @alias("k3")
    @description("Customer needs help with a technical issue unrelated to account creation or login")

    AccountIssue @alias("k4")
    @description("Specifically relates to account-login or account-creation")

    Question @alias("k5")
    @description("Customer has a question")
}

function ClassifyMessageWithSymbol(input: string) -> MyClass {
  client GPT4o

  prompt #"
    Classify the following INPUT into ONE
    of the following categories:

    INPUT: {{ input }}

    {{ ctx.output_format }}

    Response:
  "#
}

test Test1 {
  functions [ClassifyMessageWithSymbol]
  args {
    input "I can't access my account using my login credentials. I havent received the promised reset password email. Please help."
  }
}
```

---
title: Tools / Function Calling
---


"Function calling" is a technique for getting an LLM to choose a function to call for you.

The way it works is:
1. You define a task with certain function(s)
2. Ask the LLM to **choose which function to call**
3. **Get the function parameters from the LLM** for the appropriate function it choose
4. **Call the functions** in your code with those parameters

It's common for people to think of "function calling" or "tool use" separately from "structured outputs" (even OpenAI has separate parameters for them), but at BAML, we think it's simpler and more impactful to think of them equivalently. This is because, at the end of the day, you are looking to get something processable back from your LLM. Whether it's extracting data from a document or calling the Weather API, you need a standard representation of that output, which is where BAML lives.

<Frame caption="Baml Control Flow">
  <img src="../../assets/guide/tool-calling.png" alt="Tool-Calling"/>
</Frame>

In BAML, you can get represent a `tool` or a `function` you want to call as a BAML `class`, and make the function output be that class definition.

```baml BAML
class WeatherAPI {
  // we can use literals to denote the name of the tool
  // the field can be named anything we want! "api_name" "tool" "function_name"
  // whatever you feel the LLM would understand best
  api_name "weather_request"
  city string @description("the user's city")
  timeOfDay string @description("As an ISO8601 timestamp")
}

function UseTool(user_message: string) -> WeatherAPI {
  client "openai/gpt-4o-mini"
  prompt #"
    Given a message, extract info.
    {# special macro to print the functions return type. #}
    {{ ctx.output_format }}

    {{ _.role('user') }}
    {{ user_message }}
  "#
}
```
Call the function like this:

<CodeGroup>
```python Python
import asyncio
import datetime
from baml_client import b
from baml_client.types import WeatherAPI

def get_weather(city: str, time_of_day: datetime.date):
    ...

def main():
    weather_info = b.UseTool("What's the weather like in San Francisco?")
    print(weather_info)
    assert isinstance(weather_info, WeatherAPI)
    print(f"City: {weather_info.city}")
    print(f"Time of Day: {weather_info.time_of_day}")
    weather = get_weather(city=weather_info.city, time_of_day=weather_info.timeOfDay)

if __name__ == '__main__':
    main()
```

```typescript TypeScript
import { b } from './baml_client'
import { WeatherAPI } from './baml_client/types'
import assert from 'assert'

const main = async () => {
  const weatherInfo = await b.UseTool("What's the weather like in San Francisco?")
  console.log(weatherInfo)
  // BAML doesn't generate concrete types in TypeScript
  // so we can only validate the interfaces
  assert("city" in weatherInfo)
  console.log(`City: ${weatherInfo.city}`)
  console.log(`Time of Day: ${weatherInfo.timeOfDay}`)
}
```

```ruby Ruby
require_relative "baml_client/client"

$b = Baml.Client

def main
  weather_info = $b.UseTool(user_message: "What's the weather like in San Francisco?")
  puts weather_info
  raise unless weather_info.is_a?(Baml::Types::WeatherAPI)
  puts "City: #{weather_info.city}"
  puts "Time of Day: #{weather_info.timeOfDay}"
end
```
</CodeGroup>

## Choosing multiple Tools

To choose ONE tool out of many, you can use a union:
```baml BAML
function UseTool(user_message: string) -> WeatherAPI | MyOtherAPI {
  .... // same thing
}
```

<Tip>If you use [VSCode Playground](/guide/installation-editors/vs-code-extension), you can see what we inject into the prompt, with full transparency.</Tip>

Call the function like this:

<CodeGroup>
```python Python
import asyncio
from baml_client import b
from baml_client.types import WeatherAPI, MyOtherAPI

async def main():
    tool = b.UseTool("What's the weather like in San Francisco?")
    print(tool)
    
    if isinstance(tool, WeatherAPI):
        print(f"Weather API called:")
        print(f"City: {tool.city}")
        print(f"Time of Day: {tool.timeOfDay}")
    elif isinstance(tool, MyOtherAPI):
        print(f"MyOtherAPI called:")
        # Handle MyOtherAPI specific attributes here

if __name__ == '__main__':
    main()
```

```typescript TypeScript
import { b } from './baml_client'
import { WeatherAPI, MyOtherAPI } from './baml_client/types'

const main = async () => {
  const tool = await b.UseTool("What's the weather like in San Francisco?")
  console.log(tool)
  
  // BAML doesn't generate concrete types in TypeScript
  // We check which tool by checking if certain fields exist
  if ("city" in tool) {
    console.log("Weather API called:")
    console.log(`City: ${tool.city}`)
    console.log(`Time of Day: ${tool.timeOfDay}`)
  } else if ("operation" in tool) {
    console.log("MyOtherAPI called:")
    // Handle MyOtherAPI specific attributes here
  }

  /*
   * Alternatively, we could modify our BAML file as such
   * 
   * class WeatherAPI {
   *   class_name "WeatherAPI"
   *   city string
   *   time string @description("Current time in ISO8601 format")
   * }
   *
   * class MyOtherAPI {
   *   class_name "MyOtherAPI"
   *   operation "add" | "subtract" | "multiply" | "divide"
   *   numbers float[]
   * }
   *
   * Then, in typescript, we could check the class_name to determine which tool to call
   * 
   * if (tool.class_name === "WeatherAPI") {
   *   // Handle WeatherAPI specific attributes here
   * } else if (tool.class_name === "MyOtherAPI") {
   *   // Handle MyOtherAPI specific attributes here
   * }
   */
}

main()
```

```ruby Ruby
require_relative "baml_client/client"

$b = Baml.Client

def main
  tool = $b.UseTool(user_message: "What's the weather like in San Francisco?")
  puts tool
  
  case tool
  when Baml::Types::WeatherAPI
    puts "Weather API called:"
    puts "City: #{tool.city}"
    puts "Time of Day: #{tool.timeOfDay}"
  when Baml::Types::MyOtherAPI
    puts "MyOtherAPI called:"
    # Handle MyOtherAPI specific attributes here
  end
end

main
```
</CodeGroup>

## Choosing N Tools
To choose many tools, you can use a union of a list:
```baml BAML
function UseTool(user_message: string) -> (WeatherAPI | MyOtherAPI)[] {
  client "openai/gpt-4o-mini"
  prompt #"
    Given a message, extract info.
    {# special macro to print the functions return type. #}
    {{ ctx.output_format }}

    {{ _.role('user') }}
    {{ user_message }}
  "#
}
```

Call the function like this:

<CodeGroup>
```python Python
import asyncio
from baml_client import b
from baml_client.types import WeatherAPI, MyOtherAPI

async def main():
    tools = b.UseTool("What's the weather like in San Francisco and New York?")
    print(tools)  
    
    for tool in tools:
        if isinstance(tool, WeatherAPI):
            print(f"Weather API called:")
            print(f"City: {tool.city}")
            print(f"Time of Day: {tool.timeOfDay}")
        elif isinstance(tool, MyOtherAPI):
            print(f"MyOtherAPI called:")
            # Handle MyOtherAPI specific attributes here

if __name__ == '__main__':
    main()
```

```typescript TypeScript
import { b } from './baml_client'
import { WeatherAPI, MyOtherAPI } from './baml_client/types'

const main = async () => {
  const tools = await b.UseTool("What's the weather like in San Francisco and New York?")
  console.log(tools)
  
  tools.forEach(tool => {
    if ("city" in tool) {
      console.log("Weather API called:")
      console.log(`City: ${tool.city}`)
      console.log(`Time of Day: ${tool.timeOfDay}`)
    } else if ("operation" in tool) {
      console.log("MyOtherAPI called:")
      // Handle MyOtherAPI specific attributes here
    }
  })
}

main()
```

```ruby Ruby
require_relative "baml_client/client"

$b = Baml.Client

def main
  tools = $b.UseTool(user_message: "What's the weather like in San Francisco and New York?")
  puts tools
  
  tools.each do |tool|
    case tool
    when Baml::Types::WeatherAPI
      puts "Weather API called:"
      puts "City: #{tool.city}"
      puts "Time of Day: #{tool.timeOfDay}"
    when Baml::Types::MyOtherAPI
      puts "MyOtherAPI called:"
      # Handle MyOtherAPI specific attributes here
    end
  end
end

main
```
</CodeGroup>

## Disambiguating Between Similar Tools

When building functions that can call multiple tools (represented as BAML classes), you might encounter situations where different tools accept arguments with the same name. For instance, consider `GetWeather` and `GetTimezone` classes, both taking a `city: string` argument. How does the system determine whether a user query like "What's the time in London?" corresponds to `GetTimezone` or potentially `GetWeather`?

You can use string literals to solve this problem:

```baml BAML
class GetWeather {
  tool_name "get_weather" @description("Use this tool to get the current weather forecast for a specific city.")
  city string @description("The city for which to get the weather.")
}

class GetTimezone {
  tool_name "get_timezone" @description("Use this tool to find the current timezone of a specific city.")
  city string @description("The city for which to find the timezone.")
}

function ChooseTool(query: string) -> GetWeather | GetTimezone {
  client "openai/gpt-4o"
  prompt #"
    Given the user query, determine the primary intent and select the appropriate tool to call.

    {# special macro to add tool structures + descriptions here #}
    {{ ctx.output_format }} 

    {{ _.role('user') }}
    {{ query }}
  "#
}
```

## Dynamically Generate the tool signature
It might be cumbersome to define schemas in baml and code, so you can define them from code as well. Read more about dynamic types [here](/guide/baml-advanced/dynamic-runtime-types)
```baml BAML
class WeatherAPI {
  @@dynamic // params defined from code
}

function UseTool(user_message: string) -> WeatherAPI {
  client "openai/gpt-4o-mini"
  prompt #"
    Given a message, extract info.
    {# special macro to print the functions return type. #}
    {{ ctx.output_format }}

    {{ _.role('user') }}
    {{ user_message }}
  "#
}
```

Call the function like this:

<CodeGroup>
```python Python
import asyncio
import inspect

from baml_client import b
from baml_client.type_builder import TypeBuilder
from baml_client.types import WeatherAPI

async def get_weather(city: str, time_of_day: str):
    print(f"Getting weather for {city} at {time_of_day}")
    return 42

async def main():
    tb = TypeBuilder()
    type_map = {int: tb.int(), float: tb.float(), str: tb.string()}
    signature = inspect.signature(get_weather)
    for param_name, param in signature.parameters.items():
        tb.WeatherAPI.add_property(param_name, type_map[param.annotation])
    tool = b.UseTool("What's the weather like in San Francisco this afternoon?", { "tb": tb })
    print(tool)
    weather = await get_weather(**tool.model_dump())
    print(weather)

if __name__ == '__main__':
    asyncio.run(main())
```
</CodeGroup>

<Warning>Note that the above approach is not fully generic. Recommended you read: [Dynamic JSON Schema](https://www.boundaryml.com/blog/dynamic-json-schemas)</Warning>

## Function-calling APIs vs Prompting
Injecting your function schemas into the prompt, as BAML does, outperforms function-calling across all benchmarks for major providers ([see our Berkeley FC Benchmark results with BAML](https://www.boundaryml.com/blog/sota-function-calling?q=0)).

Amongst other limitations, function-calling APIs will at times:
1. Return a schema when you don't want any (you want an error)
2. Not work for tools with more than 100 parameters.
3. Use [many more tokens than prompting](https://www.boundaryml.com/blog/type-definition-prompting-baml).

Keep in mind that "JSON mode" is nearly the same thing as "prompting", but it enforces the LLM response is ONLY a JSON blob.
BAML does not use JSON mode since it allows developers to use better prompting techniques like chain-of-thought, to allow the LLM to express its reasoning before printing out the actual schema. BAML's parser can find the json schema(s) out of free-form text for you. Read more about different approaches to structured generation [here](https://www.boundaryml.com/blog/schema-aligned-parsing)

BAML will still support native function-calling APIs in the future (please let us know more about your use-case so we can prioritize accordingly)


## Create an Agent that utilizes these Tools 

We can create an Agent or an "agentic loop" that continuously uses tools in a program simply by adding a while loop in our code. 
In this example, we'll have two tools:
1. An API that queries the weather.
2. An API that does basic calculations on numbers. 

This is what it looks in the BAML file:

``` Rust tools.baml
class WeatherAPI {
  intent "weather_request"
  city string
  time string @description("Current time in ISO8601 format")
}

class CalculatorAPI {
  intent "basic_calculator"
  operation "add" | "subtract" | "multiply" | "divide"
  numbers float[]
}

function SelectTool(message: string) -> WeatherAPI | CalculatorAPI {
  client "openai/gpt-4o"
  prompt #"
    Given a message, extract info.

    {{ ctx.output_format }}

    {{ _.role("user") }} {{ message }}
  "#
}
```

In our agent code, we'll:
1. Implement our APIs
2. Implement our Agent that continuously will use different tools

<CodeGroup>
```python toolAgent.py
from baml_client import b
from baml_client.types import WeatherAPI, CalculatorAPI

def handle_weather(weather: WeatherAPI):
    # Simulate weather API call, but you can implement this with a real API call
    return f"The weather in {weather.city} at {weather.time} is sunny."

def handle_calculator(calc: CalculatorAPI):
    numbers = calc.numbers
    if calc.operation == "add":
        result = sum(numbers)
    elif calc.operation == "subtract":
        result = numbers[0] - sum(numbers[1:])
    elif calc.operation == "multiply":
        result = 1
        for n in numbers:
            result *= n
    elif calc.operation == "divide":
        result = numbers[0]
        for n in numbers[1:]:
            result /= n
    return f"The result is {result}"

def main():
    print("Agent started! Type 'exit' to quit.")
    
    while True:
        # Get user input
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            break

        # Call the BAML function to select tool
        tool_response = b.SelectTool(user_input)

        # Handle the tool response
        if isinstance(tool_response, WeatherAPI):
            result = handle_weather(tool_response)
            print(f"Agent (Weather): {result}")
        
        elif isinstance(tool_response, CalculatorAPI):
            result = handle_calculator(tool_response)
            print(f"Agent (Calculator): {result}")

if __name__ == "__main__":
    main()
```

```typescript toolAgent.ts
import { b } from "@/baml_client";
import { WeatherAPI, CalculatorAPI } from "@/baml-client/types";

function handleWeather(weather: WeatherAPI): string {
  // Simulate weather API call
  return `The weather in ${weather.city} at ${weather.time} is sunny.`;
}

function handleCalculator(calc: CalculatorAPI): string {
  const numbers = calc.numbers;
  let result: number;

  switch (calc.operation) {
    case "add":
      result = numbers.reduce((a, b) => a + b, 0);
      break;
    case "subtract":
      result = numbers.slice(1).reduce((a, b) => a - b, numbers[0]);
      break;
    case "multiply":
      result = numbers.reduce((a, b) => a * b, 1);
      break;
    case "divide":
      result = numbers.slice(1).reduce((a, b) => a / b, numbers[0]);
      break;
    default:
      return "Unknown operation.";
  }

  return `The result is ${result}`;
}

async function main() {
  console.log("Agent started! Type 'exit' to quit.");

  const readline = await import("readline");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    const toolResponse = await b.SelectTool(input);

    switch (toolResponse.intent) {
      case "weather_request":
      const result = handleWeather(toolResponse as WeatherAPI);
      console.log(`Agent (Weather): ${result}`);
    }
    if () {
      const result = handleWeather(toolResponse as WeatherAPI);
      console.log(`Agent (Weather): ${result}`);
    } else if ("numbers" in toolResponse && "operation" in toolResponse) {
      const result = handleCalculator(toolResponse as CalculatorAPI);
      console.log(`Agent (Calculator): ${result}`);
    } else {
      console.log("Agent: Sorry, I couldn't handle that input.");
    }
  });
}

main();

```

</CodeGroup>


We can test this by asking things like:
1. What is the weather in Seattle?
2. What's 5+2?

This is the output:
``` output.txt
Agent started! Type 'exit' to quit.
You: What's the weather in Seattle
Agent (Weather): The weather in Seattle at 2023-10-02T12:00:00Z is sunny.
You: What's 5+2
Agent (Calculator): The result is 7.0
```

---
title: React/Next.js Setup
---

This guide walks you through setting up BAML with React/Next.js, leveraging Server Actions and React Server Components for optimal performance.

## Example Usage

BAML automatically generates a server action and React hook for your BAML functions, with built-in support for both streaming and non-streaming modes. For details on the generated hooks, see [Generated Hooks](/ref/baml_client/react-next-js/use-function-name-hook).

<CodeBlocks>
```baml title="baml_src/prompt.baml"
class Story {
  title string @stream.not_null
  content string @stream.not_null
}

function WriteMeAStory(input: string) -> Story {
  client "openai/gpt-4o"
  prompt #"
    Tell me a story

    {{ ctx.output_format() }}

    {{ _.role("user") }}

    Topic: {{input}}
  "#
}
```

```bash title="Generate BAML client"
npx baml-cli generate

pnpm exec baml-cli generate

yarn baml-cli generate

bun baml-cli generate

deno run --unstable-sloppy-imports -A npm:@boundaryml/baml/baml-cli generate
```

```tsx title="app/components/story-form.tsx" {8,10,15-16}
'use client'

  // ✅ Automatically generates a server action and React hook

import { useWriteMeAStory } from "@/baml_client/react/hooks";

export function StoryForm() {
  const writeMeAStory = useWriteMeAStory();

  return (
    <div>
      <button
        onClick={() => writeMeAStory.mutate("About a cat in a hat")}
        disabled={writeMeAStory.isLoading}>
        {writeMeAStory.isLoading ? 'Generating...' : 'Generate Story'}
      </button>

      <div>
        <h4>{writeMeAStory.data?.title}</h4>
        <p>{writeMeAStory.data?.content}</p>
      </div>

      {writeMeAStory.error && <div>Error: {writeMeAStory.error.message}</div>}
    </div>
  );
}
```
</CodeBlocks>

## Quick Start

Follow the step-by-step instructions below to set up BAML in a new or existing Next.js project.

<Steps>
### Create a New Next.js Project

First, create a new Next.js project with the App Router:

<CodeBlocks>
```bash npm
npx create-next-app@latest my-baml-app
```

```bash pnpm
pnpm create next-app my-baml-app
```

```bash yarn
yarn create next-app my-baml-app
```

```bash bun
bun create next-app my-baml-app
```

```bash deno
deno create next-app my-baml-app
```

</CodeBlocks>

When prompted, make sure to:
- Select **Yes** for "Would you like to use TypeScript?"
- Select **Yes** for "Would you like to use the App Router? (recommended)"
- Configure other options as needed for your project

### Install Dependencies

Next, install BAML and its dependencies:

<CodeBlocks>
```bash npm
npm install @boundaryml/baml @boundaryml/baml-nextjs-plugin
```

```bash pnpm
pnpm add @boundaryml/baml @boundaryml/baml-nextjs-plugin
```

```bash yarn
yarn add @boundaryml/baml @boundaryml/baml-nextjs-plugin
```

```bash bun
bun add @boundaryml/baml @boundaryml/baml-nextjs-plugin
```

```bash deno
deno add @boundaryml/baml @boundaryml/baml-nextjs-plugin
```

</CodeBlocks>

### Configure Next.js

Update your `next.config.mjs`:

<CodeBlocks>
```typescript title="next.config.ts" {1,8}
import { withBaml } from '@boundaryml/baml-nextjs-plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ... existing config
};

export default withBaml()(nextConfig);
```

```javascript title="next.config.mjs" {1,8}
import { withBaml } from '@boundaryml/baml-nextjs-plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ... existing config
};

export default withBaml()(nextConfig);
```

```javascript title="next.config.js" {1,8}
const { withBaml } = require('@boundaryml/baml-nextjs-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config
}

module.exports = withBaml()(nextConfig)
```
</CodeBlocks>

### Initialize BAML

Create a new BAML project in your Next.js application:
<Markdown src="../../../snippets/baml/cli/install/nodejs.mdx" />

This will create a `baml_src` directory with starter code.

### Setup Environment Variables

Setup provider specific API Keys.

```.env .env.local
OPENAI_API_KEY=sk-...
```

<Accordion title='(Optional) BAML Observability'>
To enable observability with BAML, you'll first need to sign up for a [Boundary Studio](https://app.boundaryml.com) account.


```.env .env.local
BOUNDARY_PROJECT_ID=sk-...
BOUNDARY_SECRET=sk-...

OPENAI_API_KEY=sk-...
```

</Accordion>

### Setup BAML Next.js Generator

Update the `baml_src/generators.baml` file to use the React/Next.js generator.

```diff title="baml_src/generators.baml"
generator typescript {
-  output_type "typescript"
+  output_type "typescript/react"
  output_dir "../"
  version "0.76.2"
}
```

### Generate BAML Client

<Markdown src="../../../snippets/baml/cli/generate.mdx" />


 <Note>
      If you need baml_client to be 'ESM' compatible, you can add the following `generator` configuration to your `.baml` file:

      ```baml
      generator typescript {
        ...
        module_format "esm" // the default is "cjs" for CommonJS
      }
      ```
    </Note>

### Generated React Hooks

BAML automatically generates type-safe Next.js server actions and React hooks for your BAML functions.

<CodeBlocks>
```baml title="baml_src/prompt.baml"
class Story {
  title string @stream.not_null
  content string @stream.not_null
}

function WriteMeAStory(input: string) -> Story {
  client "openai/gpt-4o"
  prompt #"
    Tell me a story

    {{ ctx.output_format() }}

    {{ _.role("user") }}

    Topic: {{input}}
  "#
}
```

```tsx title="Non-Streaming Example"
'use client'

import { useWriteMeAStory } from "@/baml_client/react/hooks";
import type { Story } from "@/baml_client/types";

export function StoryForm() {
  const writeMeAStory = useWriteMeAStory({ stream: false });

  return (
    <div>
      <button onClick={() => writeMeAStory.mutate("About a cat in a hat")}>
        {writeMeAStory.isLoading ? 'Generating...' : 'Generate Story'}
      </button>

      {writeMeAStory.data && (
        <div>
          <h4>{writeMeAStory.data.title}</h4>
          <p>{writeMeAStory.data.content}</p>
        </div>
      )}

      {writeMeAStory.error && <div>Error: {writeMeAStory.error.message}</div>}
    </div>
  );
}
```

```tsx title="Streaming Example"
'use client'

import { useWriteMeAStory } from "@/baml_client/react/hooks";
import type { Story } from "@/baml_client/types";

export function StreamingStoryForm() {
  const writeMeAStory = useWriteMeAStory({
    onStreamData: (partial) => {
      // Handle real-time updates
      console.log('Story in progress:', partial);
    },
    onFinalData: (final) => {
      // Handle completed story
      console.log('Story completed:', final);
    }
  });

  return (
    <div>
      <button
        onClick={() => writeMeAStory.mutate("About a cat in a hat")}
        disabled={writeMeAStory.isLoading}>
        {writeMeAStory.isLoading ? 'Generating...' : 'Generate Story'}
      </button>

      {writeMeAStory.data && (
        <div>
          <h4>{writeMeAStory.data.title}</h4>
          <p>{writeMeAStory.data.content}</p>
        </div>
      )}

      {writeMeAStory.error && <div>Error: {writeMeAStory.error.message}</div>}
    </div>
  );
}
```
</CodeBlocks>

### Update Package Scripts

Update your `package.json` scripts:

```json {3,4}
{
  "scripts": {
    "prebuild": "npm run generate",
    "generate": "baml-cli generate",
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
  }
}
```

</Steps>

## Reference Documentation

For complete API documentation of the React/Next.js integration, see:

### Core Concepts
- [Generated Hooks](/ref/baml_client/react-next-js/use-function-name-hook) - Auto-generated hooks for each BAML function

### Hook Configuration
- [HookInput](/ref/baml_client/react-next-js/hook-input) - Configuration options for hooks
- [HookOutput](/ref/baml_client/react-next-js/hook-output) - Return value types and states
- [Error Types](/ref/baml_client/errors/overview) - Error handling and types

## Next Steps

- Check out the [BAML Examples](https://github.com/BoundaryML/baml-examples/tree/main/nextjs-starter) for more use cases

---
title: Building a Chatbot with BAML React Hooks
description: Learn to build a streaming chatbot using BAML React hooks and Next.js
---

In this tutorial, you'll build a real-time streaming chatbot using BAML React hooks. By following along, you'll learn how to:
- Create a BAML function for chat completions
- Use BAML's React hooks for streaming responses
- Build a modern chat interface
- Handle loading states and errors

## Prerequisites

Before starting, ensure you have:
- Completed the [Quick Start Guide](/guide/framework-integration/react-next-js/quick-start)
- A Next.js project with BAML set up
- An OpenAI API key

## Step 1: Define the Chat Function

First, create a new BAML function for the chat completion:

<CodeBlocks>
```baml title="baml_src/chat.baml"
class Message {
  role "user" | "assistant"
  content string
}

function Chat(messages: Message[]) -> string {
  client "openai/gpt-4o-mini"
  prompt #"
    You are a helpful and knowledgeable AI assistant engaging in a conversation.
    Your responses should be:
    - Clear and concise
    - Accurate and informative
    - Natural and conversational in tone
    - Focused on addressing the user's needs

    {{ ctx.output_format }}

    {% for m in messages %}
    {{ _.role(m.role)}}
    {{m.content}}
    {% endfor %}
  "#
}

test TestName {
  functions [Chat]
  args {
    messages [
      {
        role "user"
        content "help me understand Chobani's success"
      }
    ]
  }
}
```
</CodeBlocks>

Generate the BAML client to create the React hooks:

```bash
baml-cli generate
```

## Step 2: Implement the Chat Interface

You can implement the chat interface in two ways:

### Option A: Using the Generated Hook Directly

The simplest approach is to use the generated hook directly:

<CodeBlocks>
```tsx title="app/components/chat-interface.tsx"
'use client'

import { useChat } from "@/baml_client/react/hooks";
import { useState } from "react";

export function ChatInterface() {
  const [input, setInput] = useState("");

  const chat = useChat();

  const handleSubmit = async () => {
    const newMessages = [
      ...chat.data?.messages,
      { role: "user", content: input }
    ];

    setInput("");

    await chat.mutate({ messages: newMessages });
  };

  return (
    <div>
      <div>
        {chat.data?.messages.map((message, i) => (
          <div key={i}>
            {message.content}
          </div>
        ))}
        {chat.isLoading && <div>Generating...</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" disabled={chat.isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}
```
</CodeBlocks>

### Option B: Using a Custom Server Action

Alternatively, you can create a custom server action for more control over the server-side implementation:

<CodeBlocks>
```ts title="app/actions/chat.ts"
'use server'

import { b } from "@/baml_client";
import { Message } from "@/baml_client/types";

export async function streamChat(messages: Message[]) {
  const user = await authUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return b.stream.Chat(messages).toStreamable();
}
```

```tsx title="app/components/chat-interface-with-action.tsx"
'use client'

import { useChat } from "@/baml_client/react/hooks";
import { streamChat } from "../actions/chat";
import { useState } from "react";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async () => {
    const newMessages = [
      ...messages,
      { role: "user", content: input }
    ];
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const stream = await streamChat(newMessages);

      for await (const message of stream) {
        setMessages((prev) => [...prev, message]);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, i) => (
          <div key={i}>
            {message.content}
          </div>
        ))}
        {isLoading && <div>Typing...</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" disabled={isLoading}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
```
</CodeBlocks>

The server action approach is useful when you need to:
- Add custom server-side logic
- Handle authentication
- Add logging or monitoring
- Implement rate limiting
- Add custom error handling

## Next Steps

To enhance your chatbot, you could:
- Add [error handling](/ref/baml_client/errors/overview) for different types of errors
- Add chat history persistence
- Implement different chat models or configurations

For more information, check out:
- [Generated Hooks](/ref/baml_client/react-next-js/use-function-name-hook)
- [HookInput](/ref/baml_client/react-next-js/hook-input)
- [HookOutput](/ref/baml_client/react-next-js/hook-output)
- [Error Handling](/ref/baml_client/errors/overview)

---
slug: guide/cloud/functions/environment-variables
---

_Learn how to use Boundary Functions Environment Variables, which are key-value pairs
configured outside your source code._

Environment variables are key-value pairs, configured outside your source code,
and used to provide secrets for your deployed BAML functions, such as
`ANTHROPIC_API_KEY` and `OPENAI_API_KEY`.

You can set environment variables in the [Boundary
Dashboard](https://dashboard.boundaryml.com/) by going to the left sidebar and
clicking on the cloud icon.

<div class="flex flex-col items-center">
  <img src="/assets/cloud/set-env-vars.png" alt="Boundary Cloud secrets" />
</div>

Changes to environment variables will take effect immediately.

## Limits

See [Limits](/ref/cloud/limits) for more information.

---
slug: guide/cloud/functions/get-started
---

_Learn how to host your BAML code on Boundary Functions and call it over HTTP._

<Info>
  This is a preview feature, available starting with `baml-cli v0.66.0`.
</Info>

<Note>
  The BAML language, compiler, and runtime will always be 100% free and
  open-source: we will always allow you to run BAML functions directly in your
  own backends.
  
  Boundary Functions' goal is to make it even easier to host and run BAML
  functions, by adding support for features like rate limits, telemetry, and
  end-user feedback.
</Note>

Boundary Functions allows you to host your BAML functions on our infrastructure, exposing
one REST API endpoint per BAML function.

<div class="flex flex-col items-center">
  <img src="/assets/cloud/boundary-cloud-diagram.drawio.svg" alt="OpenAPI diagram" />
</div>

This guide will walk you through:

  - creating a Boundary Cloud account,
  - deploying your BAML code to Boundary Functions,
  - setting your API keys, and
  - calling your BAML functions.

Once you've deployed your BAML functions, you can use the [OpenAPI client] to
call them.

[OpenAPI client]: /guide/installation-language/rest-api-other-languages

## Get Started

First, create your account and organization at https://dashboard.boundaryml.com.

Then, log in from your terminal:

```bash
baml-cli login
```

and run this command in your `baml_src/` directory:

```bash
baml-cli deploy
```

This will prompt you to create a new Boundary project, deploy your BAML code to it,
and then point you to the dashboard, where you can set environment variables and
create API keys to use to call your BAML functions.

<div class="flex flex-col items-center">
  <img class="rounded-md px-4 py-2 m-0" src="/assets/cloud/deploy-screenshot.png" alt="Boundary Functions deploy output" />
</div>

Once you've set the environment variables you need (probably `ANTHROPIC_API_KEY`
and/or `OPENAI_API_KEY`), you can call your BAML functions!

If you still have the `ExtractResume` function that your BAML project was created with,
you can use this command to test it out:

```bash
curl https://api2.boundaryml.com/v3/functions/prod/call/ExtractResume \
  -H "Authorization: Bearer $BOUNDARY_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "resume": "
    Grace Hopper
    grace.hopper@example.com

    Experience:
    - Rear Admiral, US Navy
    - Senior Programmer, Eckert-Mauchly Computer Corporation
    - Associate Professor, Vassar College

    Skills:
    - COBOL
    - Compiler development
  "
}
EOF
```

Congratulations! You've gotten your first BAML functions working on Boundary Functions.

## Local development and testing

To test your BAML functions locally, you can use `baml-cli dev`:

```bash
ANTHROPIC_API_KEY=... OPENAI_API_KEY=... baml-cli dev
```

which will allow you to call your functions at `http://localhost:2024/call/<function_name>` instead of
`https://api2.boundaryml.com/v3/functions/prod/call/<function_name>` using the exact same `curl` command:

```bash
curl http://localhost:2024/functions/prod/call/ExtractResume \
  -H "Authorization: Bearer $BOUNDARY_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "resume": "
    Grace Hopper
    grace.hopper@example.com

    Experience:
    - Rear Admiral, US Navy
    - Senior Programmer, Eckert-Mauchly Computer Corporation
    - Associate Professor, Vassar College

    Skills:
    - COBOL
    - Compiler development
  "
}
EOF
```

<div class="flex flex-col items-center">
  <img class="rounded-md px-4 py-2 m-0" src="/assets/cloud/local-function-call.png" alt="Boundary Functions local output" />
</div>

---
slug: guide/cloud/functions/using-openapi
---

_Learn how to use your OpenAPI client to call your functions in Boundary Functions._

<Info>
  This page assumes you've already deployed your BAML code to Boundary Functions. If
  you haven't done that yet, check out the guide for [getting started](/guide/cloud/functions/get-started).
</Info>

<Info>
  This page assumes you're using an OpenAPI-generated BAML client. If you
  haven't done that yet, check out the [OpenAPI quickstart](/docs/get-started/quickstart/openapi).
</Info>

## Create an API key

You can create API keys in the [Boundary
Dashboard](https://dashboard.boundaryml.com/) by going to the left sidebar and
clicking on the key icon.

<div class="flex flex-col items-center">
  <img src="/assets/cloud/api-keys.png" alt="Boundary Functions API keys" />
</div>

Once you've created a new key, update your application code to use it as `BOUNDARY_API_KEY`.

## Update your application code

You also need to update your application code to use `BOUNDARY_ENDPOINT` and
`BOUNDARY_API_KEY`, if set, when constructing the OpenAPI client.

<Markdown src="../../snippets/openapi-howto-rely-on-envvars.mdx" />

## Set your environment variables

You can now set the following environment variables in your application:

```bash
BOUNDARY_API_KEY=...
BOUNDARY_ENDPOINT=https://api2.boundaryml.com/v3/functions/prod/
```

## Call your functions

You should now be able to call your deployed BAML functions using your OpenAPI client!

---
title: What is BAML?
---

The best way to understand BAML and its developer experience is to see it live in a demo (see below).
 

### Demo video
Here we write a BAML function definition, and then call it from a Python script.

<iframe src="https://fast.wistia.net/embed/iframe/5fxpquglde?seo=false&videoFoam=false" title="BAML Demo Video" allow="autoplay; fullscreen" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" msallowfullscreen width="640" height="352"></iframe>
<script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>

### Examples
- [Interactive NextJS app with streaming](https://baml-examples.vercel.app/examples/stream-object)
- [Starter boilerplates for Python, Typescript, Ruby, etc.](https://github.com/boundaryml/baml-examples)

### High-level Developer Flow

<Steps>
### Write a BAML function definition
```baml main.baml
class WeatherAPI {
  city string @description("the user's city")
  timeOfDay string @description("As an ISO8601 timestamp")
}

function UseTool(user_message: string) -> WeatherAPI {
  client "openai/gpt-4o"
  prompt #"
    Extract.... {# we will explain the rest in the guides #}
  "#
}
```
Here you can run tests in the VSCode Playground.

### Generate `baml_client` from those .baml files.
This is auto-generated code with all boilerplate to call the LLM endpoint, parse the output, fix broken JSON, and handle errors.
<img src="/assets/vscode/baml-client.png" />

### Call your function in any language
with type-safety, autocomplete, retry-logic, robust JSON parsing, etc..
<CodeGroup>
```python Python
import asyncio
from baml_client import b
from baml_client.types import WeatherAPI

def main():
    weather_info = b.UseTool("What's the weather like in San Francisco?")
    print(weather_info)
    assert isinstance(weather_info, WeatherAPI)
    print(f"City: {weather_info.city}")
    print(f"Time of Day: {weather_info.timeOfDay}")

if __name__ == '__main__':
    main()
```

```typescript TypeScript
import { b } from './baml_client'
import { WeatherAPI } from './baml_client/types'
import assert from 'assert'

const main = async () => {
  const weatherInfo = await b.UseTool("What's the weather like in San Francisco?")
  console.log(weatherInfo)
  assert(weatherInfo instanceof WeatherAPI)
  console.log(`City: ${weatherInfo.city}`)
  console.log(`Time of Day: ${weatherInfo.timeOfDay}`)
}
```

```ruby Ruby
require_relative "baml_client/client"

$b = Baml.Client

def main
  weather_info = $b.UseTool(user_message: "What's the weather like in San Francisco?")
  puts weather_info
  raise unless weather_info.is_a?(Baml::Types::WeatherAPI)
  puts "City: #{weather_info.city}"
  puts "Time of Day: #{weather_info.timeOfDay}"
end
```

```python Other Languages
# read the installation guide for other languages!
```
</CodeGroup>
</Steps>

Continue on to the [Installation Guides](/guide/installation-language) for your language to setup BAML in a few minutes!

You don't need to migrate 100% of your LLM code to BAML in one go! It works along-side any existing LLM framework.

---
title: What is baml_client?
---

**baml_client** is the code that gets generated from your BAML files that transforms your BAML prompts into the same equivalent function in your language, with validated type-safe outputs.
<img src="/assets/vscode/baml-client.png" />
```python Python
from baml_client import b
resume_info = b.ExtractResume("....some text...")
```

This has all the boilerplate to:
1. call the LLM endpoint with the right parameters,
2. parse the output,
3. fix broken JSON (if any)
4. return the result in a nice typed object.
5. handle errors

In Python, your BAML types get converted to Pydantic models. In Typescript, they get converted to TypeScript types, and so on. **BAML acts like a universal type system that can be used in any language**.



### Generating baml_client

 Refer to the **[Installation](/guide/installation-language/python)** guides for how to set this up for your language, and how to generate it.

 But at a high-level, you just include a [generator block](/ref/baml/generator) in any of your BAML files.

<CodeBlocks>

```baml Python
generator target {
    // Valid values: "python/pydantic", "typescript", "ruby/sorbet"
    output_type "python/pydantic"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // What interface you prefer to use for the generated code (sync/async)
    // Both are generated regardless of the choice, just modifies what is exported
    // at the top level
    default_client_mode "sync"

    // Version of runtime to generate code for (should match installed baml-py version)
    version "0.54.0"
}
```

```baml TypeScript
generator target {
    // Valid values: "python/pydantic", "typescript", "ruby/sorbet"
    output_type "typescript"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // What interface you prefer to use for the generated code (sync/async)
    // Both are generated regardless of the choice, just modifies what is exported
    // at the top level
    default_client_mode "async"

    // Version of runtime to generate code for (should match the package @boundaryml/baml version)
    version "0.54.0"
}
```

```baml Ruby (beta)
generator target {
    // Valid values: "python/pydantic", "typescript", "ruby/sorbet"
    output_type "ruby/sorbet"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // Version of runtime to generate code for (should match installed `baml` package version)
    version "0.54.0"
}
```

```baml OpenAPI
generator target {
    // Valid values: "python/pydantic", "typescript", "ruby/sorbet", "rest/openapi"
    output_type "rest/openapi"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // Version of runtime to generate code for (should match installed `baml` package version)
    version "0.54.0"

    // 'baml-cli generate' will run this after generating openapi.yaml, to generate your OpenAPI client
    // This command will be run from within $output_dir
    on_generate "npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g OPENAPI_CLIENT_TYPE -o ."
}
```
</CodeBlocks>

The `baml_client` transforms a BAML function into the same equivalent function in your language,

---
title: What is baml_src?
---

**baml_src** is where you keep all your BAML files, and where all the prompt-related code lives. It must be named `baml_src` for our tooling to pick it up, but it can live wherever you want.

It helps keep your project organized, and makes it easy to separate prompt engineering from the rest of your code.

<img src="/assets/vscode/baml-client.png" />


Some things to note:
1. All declarations within this directory are accessible across all files contained in the `baml_src` folder.
2. You can have multiple files, and even nest subdirectories.

You don't need to worry about including this directory when deploying your code. See: [Deploying](/guide/development/deploying/aws)

The `@alias` attribute in BAML is used to rename fields or values for better understanding by the LLM, while keeping the original name in your code. This is particularly useful for prompt engineering, as it allows you to provide a more intuitive name for the LLM without altering your existing codebase.

## Prompt Impact (class)

### Without `@alias`

```baml BAML
class MyClass {
  property1 string
}
```

**ctx.output_format:**

```
{
  property1: string
}
```

### With `@alias`

```baml BAML
class MyClass {
  property1 string @alias("name")
}
```

**ctx.output_format:**

```
{
  name: string
}
```

## Prompt Impact (enum)

```baml BAML
enum MyEnum {
  Value1 
  // Note that @@alias is applied to the enum itself, not the value
  @@alias("My Name")
}
```

**ctx.output_format:**

```
My Name
---
Value1
```

## Prompt Impact (enum value)

```baml BAML
enum MyEnum {
  Value1 @alias("Something")
}
```

**ctx.output_format:**

```
MyEnum
---
Something
```

The `@assert` attribute in BAML is used for strict validations. If a type fails an `@assert` validation, it will not be returned in the response, and an exception will be raised if it's part of the top-level type.

## Usage

Asserts can be named or unnamed.

### Field Assertion

```baml BAML
class Foo {
  // @assert will be applied to the field with the name "bar"
  bar int @assert(between_0_and_10, {{ this > 0 and this < 10 }})
}
```

```baml BAML
class Foo {
  // @assert will be applied to the field with no name
  bar int @assert({{ this > 0 and this < 10 }})
}
```

```baml BAML
class MyClass {
  // @assert will be applied to each element in the array
  my_field (string @assert(is_valid_email, {{ this|regex_match("@") }}))[]
}
```

### Parameter Assertion

Asserts can also be applied to parameters.

```baml BAML
function MyFunction(x: int @assert(between_0_and_10, {{ this > 0 and this < 10 }})) {
  client "openai/gpt-4o"
  prompt #"Hello, world!"#
}
```

### Block Assertion

Asserts can be used in a block definition, referencing fields within the block.

```baml BAML
class Foo {
  bar int
  baz string
  @@assert(baz_length_limit, {{ this.baz|length < this.bar }})
}
```

See [Jinja in Attributes](/ref/attributes/jinja-in-attributes) for a longer description of the Jinja syntax
available in asserts.

In BAML, attributes are used to provide additional metadata or behavior to fields and types. They can be applied at different levels, such as field-level or block-level, depending on their intended use.

## Field-Level Attributes

Field-level attributes are applied directly to individual fields within a class or enum. They modify the behavior or metadata of that specific field.

### Examples of Field-Level Attributes

- **`@alias`**: Renames a field for better understanding by the LLM.
- **`@description`**: Provides additional context to a field.
- **`@skip`**: Excludes a field from prompts or parsing.
- **`@assert`**: Applies strict validation to a field.
- **`@check`**: Adds non-exception-raising validation to a field.

```baml BAML
class MyClass {
  property1 string @alias("name") @description("The name of the object")
  age int? @check(positive, {{ this > 0 }})
}
```

## Block-Level Attributes

Block-level attributes are applied to an entire class or enum, affecting all fields or values within that block. They are used to modify the behavior or metadata of the entire block.

### Examples of Block-Level Attributes

- **`@@dynamic`**: Allows dynamic modification of fields or values at runtime.

```baml BAML
class MyClass {
  property1 string
  property2 int?

  @@dynamic // allows adding fields dynamically at runtime
}
```

## Key Differences

- **Scope**: Field-level attributes affect individual fields, while block-level attributes affect the entire class or enum.
- **Usage**: Field-level attributes are used for specific field modifications, whereas block-level attributes are used for broader modifications affecting the whole block.

Understanding the distinction between these types of attributes is crucial for effectively using BAML to define and manipulate data structures.

For more detailed information on each attribute, refer to the specific attribute pages in this section. 

The `@check` attribute in BAML adds validations without raising exceptions if they fail. This allows the validations to be inspected at runtime.

## Usage

### Field Check

```baml BAML
class Foo {
  bar int @check(less_than_zero, {{ this < 0 }})
}
```

### Block check

```baml
class Bar {
  baz int
  quux string
  @@check(quux_limit, {{ this.quux|length < this.baz }})
}
```

See [Jinja in Attributes](/ref/attributes/jinja-in-attributes) for a longer description of the Jinja syntax
available in checks.

## Benefits

- **Non-Intrusive Validation**: Allows for validation checks without interrupting the flow of data processing.
- **Runtime Inspection**: Enables inspection of validation results at runtime.

See more in [validations guide](/guide/baml-advanced/checks-and-asserts).

The `@description` attribute in BAML provides additional context to fields or values in prompts. This can help the LLM understand the intended use or meaning of a field or value.

## Prompt Impact

### Without `@description`

```baml BAML
class MyClass {
  property1 string
}
```

**ctx.output_format:**

```
{
  property1: string
}
```

### With `@description`

```baml BAML
class MyClass {
  property1 string @description("The name of the object")
}
```

**ctx.output_format:**

```
{
  // The name of the object
  property1: string
}
```

## Prompt Impact (enum - value)

### Without `@description`

```baml BAML
enum MyEnum {
  Value1
  Value2
}
```

**ctx.output_format:**

```
MyEnum
---
Value1
Value2
```

### With `@description`

```baml BAML
enum MyEnum {
  Value1 @description("The first value")
  Value2 @description("The second value")
}
```

**ctx.output_format:**

```
MyEnum
---
Value1 // The first value
Value2 // The second value
```

## Prompt Impact (enum)

```baml BAML
enum MyEnum {
  Value1
  Value2

  @@description("This enum represents status codes")
}
```

**ctx.output_format:**

```
MyEnum: This enum represents status codes
---
Value1
Value2
```

The `@@dynamic` attribute in BAML allows for the dynamic modification of fields or values at runtime. This is particularly useful when you need to adapt the structure of your data models based on runtime conditions or external inputs.

## Usage

### Dynamic Classes

The `@@dynamic` attribute can be applied to classes, enabling the addition of fields dynamically during runtime.

```baml BAML
class MyClass {
  property1 string
  property2 int?

  @@dynamic // allows adding fields dynamically at runtime
}
```

### Dynamic Enums

Similarly, the `@@dynamic` attribute can be applied to enums, allowing for the modification of enum values at runtime.

```baml BAML
enum MyEnum {
  Value1
  Value2

  @@dynamic // allows modifying enum values dynamically at runtime
}
```

## Using `@@dynamic` with TypeBuilder

To modify dynamic types at runtime, you can use the `TypeBuilder` from the `baml_client`. Below are examples for Python, TypeScript, and Ruby.

Read more about the `TypeBuilder` in the [TypeBuilder](/ref/baml_client/type-builder#type-builders) section.

### Python Example

```python
from baml_client.type_builder import TypeBuilder
from baml_client import b

async def run():
  tb = TypeBuilder()
  tb.MyClass.add_property('email', tb.string())
  tb.MyClass.add_property('address', tb.string()).description("The user's address")
  res = await b.DynamicUserCreator("some user info", { "tb": tb })
  # Now res can have email and address fields
  print(res)
```

### TypeScript Example

```typescript
import TypeBuilder from '../baml_client/type_builder'
import { b } from '../baml_client'

async function run() {
  const tb = new TypeBuilder()
  tb.MyClass.addProperty('email', tb.string())
  tb.MyClass.addProperty('address', tb.string()).description("The user's address")
  const res = await b.DynamicUserCreator("some user info", { tb: tb })
  // Now res can have email and address fields
  console.log(res)
}
```
### Ruby Example

```ruby
require_relative 'baml_client/client'

def run
  tb = Baml::TypeBuilder.new
  tb.MyClass.add_property('email', tb.string)
  tb.MyClass.add_property('address', tb.string).description("The user's address")
  
  res = Baml::Client.dynamic_user_creator(input: "some user info", baml_options: {tb: tb})
  # Now res can have email and address fields
  puts res
end
```

## Testing Dynamic Types

Dynamic classes and enums can be modified in tests using the `type_builder` and
`dynamic` blocks. All properties added in the `dynamic` block will be available
during the test execution.

<Markdown src="../../../snippets/dynamic-class-test.mdx" />

`@check` and `@assert` use [Jinja](/ref/prompt-syntax/what-is-jinja) syntax to specify the invariants
(properties that should always hold true) of a type.

### Checks and Asserts

This example demonstrates [@assert](/ref/attributes/assert) and [@check](/ref/attributes/check) on both class fields
and the class block itself, and it shows a few examples of Jinja syntax.

```baml BAML
class Student {
    first_name string @assert( {{ this|length > 0 }})
    last_name string @assert( {{ this|length > 0 }})
    age int @check(old_enough, {{ this > 5 }}) @check(u8, {{ this|abs < 255 }})
    concentration string @assert( {{ this.regex_match("[Math|Science]")}})
    @@check(age_threshold, {{ this.concentration != "calculus" or this.age > 12 }})
}
```

### `this` keyword

Inside a Jinja expression, `this` refers to the value of a class field, if the
`@assert` or `@check` is applied to a class field, and it applies to the whole
object if it is applied to the whole type with `@@assert()` or `@@check()`.

### Filters

In Jinja, functions are called "filters", and they are applied to arguments
by writing `some_argument|some_filter`. Filters can be applied one after the
other by chaining them with additional `|`s.

 -  `abs`: Absolote value.
 -  `capitalize`: Make the first letter uppercase
 -  `escape`: Replace special HTML characters with their escaped counterparts
 -  `first`: First item of a list
 -  `last`: Last item of a list
 -  `default(x)`: Returns `x` when applied to something undefined.
 -  `float`: Convert to a float, or 0.0 if conversion fails
 -  `int`: Convert to an int, or 0 if conversion fails
 -  `join`: Concatenate a list of strings
 -  `length`: List length
 -  `lower`: Make the string lowercase
 -  `upper`: Make the string uppercase
 -  `map(filter)`: Apply a filter to each item in a list
 -  `max`: Maximum of a list of numbers or Booleans
 -  `min`: Minimum of a list of numbers or Booleans
 -  `regex_match("regex")`: Return true if argument matches the regex
 -  `reject("test")`: Filter out items that fail the test
 -  `reverse`: Reverse a list or string
 -  `round`: Round a float to the nearest int
 -  `select("test_name")`: Retain the values of a list passing `test_name`
 -  `sum`: Sum of a list of numbers
 -  `title`: Convert a string to "Title Case"
 -  `trim`: Remove leading and trailing whitespace from a string
 -  `unique`: Remove duplicate entries in a list

 ### Common Patterns

#### Test that a substring appears inside some string

 ```baml BAML
 function GenerateStory(subject: string) -> string {
   client GPT4
   prompt #"Write a story about {{ subject }}"#
 }

 test HorseStory {
    functions [GenerateStory]
    args {
        subject "Equestrian team coming-of-age story"
    }
    @@assert( {{ this|lower|regex_match("horse") }} )
 }
 ```

 We use the `lower` filter to make the whole story lowercase, and pass
 the result to `regex_match()` to search for an occurrance of "horse".


#### Test that a string is an exact match

```baml BAML
class Person {
    first_name string
    last_name string
}

function ExtractPerson(description: string) -> Person {
    client GPT4
    prompt #"
      Extract a Person from the description {{ description }}.
      {{ ctx.output_format }}
    "#
}

test ExtractJohnDoe {
    functions [ExtractPerson]
    args {
        description "John Doe is a 5'6\" man riding a stolen horse."
    }
    @@assert( {{ this.first_name|regex_match("^John$") }} )
    @@assert( {{ this.last_name == "Doe" }} )
}
```

We can use `regex_match` with special control characters indicating
the beginning and end of a string, as in the first `@@assert`, or
simply check equality with a literal string as in the second `@@assert`.

#### Test that item prices add up to a total

```baml BAML
class Receipt {
    establishment string
    items Item[]
    tax_cents int
    total_cents int
}

class Item {
    name string
    price_cents int
}

function ExtractReceipt(text_receipt: string) -> Receipt {
    client GPT4
    prompt #"
      Extract the details of this receipt: {{ text_receipt }}
      {{ ctx.output_format }}
    "#
}

test SmallReceipt {
    functions [ExtractReceipt]
    args {
        text_receipt "Nutty Squirrel. Affogato: $8.50. Kids cone: $6.50. Tax: $1. Total: $16.00"
    }

    @@assert( {{ this.items|map(attribute="price_cents")|sum + this.tax_cents == this.total_cents }} )
}
```

To check that the numbers in our `Receipt` add up, we first
`map` over the items to get the price of each item, then sum
the list of prices, and check the sum of the items and the sales
tax against the receipt total.

The `@skip` attribute in BAML is used to exclude certain fields or values from being included in prompts or parsed responses. This can be useful when certain data is not relevant for the LLM's processing.

## Prompt Impact

### Without `@skip`

```baml BAML
enum MyEnum {
  Value1
  Value2
}
```

**ctx.output_format:**

```
MyEnum
---
Value1
Value2
```

### With `@skip`

```baml BAML
enum MyEnum {
  Value1
  Value2 @skip
}
```

**ctx.output_format:**

```
MyEnum
---
Value1
```
---
title: fallback
---


You can use the `fallback` provider to add more resilience to your application.

A fallback will attempt to use the first client, and if it fails, it will try the second client, and so on.

<Tip>You can nest fallbacks inside of other fallbacks.</Tip>

```baml BAML
client<llm> SuperDuperClient {
  provider fallback
  options {
    strategy [
      ClientA
      ClientB
      ClientC
    ]
  }
}
```

## Options

<ParamField path="strategy" type="List[string]" required>
  The list of client names to try in order. Cannot be empty.
</ParamField>

## retry_policy

Like any other client, you can specify a retry policy for the fallback client. See [retry_policy](retry-policy) for more information.

The retry policy will test the fallback itself, after the entire strategy has failed.

```baml BAML
client<llm> SuperDuperClient {
  provider fallback
  retry_policy MyRetryPolicy
  options {
    strategy [
      ClientA
      ClientB
      ClientC
    ]
  }
}
```

## Nesting multiple fallbacks

You can nest multiple fallbacks inside of each other. The fallbacks will just chain as you would expect.

```baml BAML
client<llm> SuperDuperClient {
  provider fallback
  options {
    strategy [
      ClientA
      ClientB
      ClientC
    ]
  }
}

client<llm> MegaClient {
  provider fallback
  options {
    strategy [
      SuperDuperClient
      ClientD
    ]
  }
}
```
---
title: retry_policy
---


A retry policy can be attached to any `client<llm>` and will attempt to retry requests that fail due to a network error.

```baml BAML
retry_policy MyPolicyName {
  max_retries 3
}
```

Usage:
```baml BAML
client<llm> MyClient {
  provider anthropic
  retry_policy MyPolicyName
  options {
    model "claude-3-sonnet-20240229"
    api_key env.ANTHROPIC_API_KEY
  }
}
```

## Fields
<ParamField
  path="max_retries"
  type="int"
  required
>
  Number of **additional** retries to attempt after the initial request fails.
</ParamField>

<ParamField
  path="strategy"
  type="Strategy"
>
  The strategy to use for retrying requests. Default is `constant_delay(delay_ms=200)`.

| Strategy | Docs | Notes |
| --- | --- | --- |
| `constant_delay` | [Docs](#constant-delay) | |
| `exponential_backoff` | [Docs](#exponential-backoff) | |

Example:
```baml BAML
retry_policy MyPolicyName {
  max_retries 3
  strategy {
    type constant_delay
    delay_ms 200
  }
}
```

</ParamField>

## Strategies

### constant_delay
<ParamField path="type" type="constant_delay" required>
  Configures to the constant delay strategy.
</ParamField>

<ParamField path="delay_ms" type="int">
  The delay in milliseconds to wait between retries. **Default: 200**
</ParamField>


### exponential_backoff
<ParamField path="type" type="exponential_backoff" required>
  Configures to the exponential backoff strategy.
</ParamField>

<ParamField path="delay_ms" type="int">
  The initial delay in milliseconds to wait between retries. **Default: 200**
</ParamField>

<ParamField path="multiplier" type="float">
  The multiplier to apply to the delay after each retry. **Default: 1.5**
</ParamField>

<ParamField path="max_delay_ms" type="int">
  The maximum delay in milliseconds to wait between retries. **Default: 10000**
</ParamField>

---
title: round-robin
---


The `round_robin` provider allows you to distribute requests across multiple clients in a round-robin fashion. After each call, the next client in the list will be used.

```baml BAML
client<llm> MyClient {
  provider round-robin
  options {
    strategy [
      ClientA
      ClientB
      ClientC
    ]
  }
}
```

## Options

<ParamField path="strategy" type="List[string]" required>
  The list of client names to try in order. Cannot be empty.
</ParamField>

<ParamField  path="start" type="int">
  The index of the client to start with.

  **Default is `random(0, len(strategy))`**

  In the [BAML Playground](/docs/get-started/quickstart/editors-vscode), Default is `0`.
</ParamField>

## retry_policy

When using a retry_policy with a round-robin client, it will rotate the strategy list after each retry.

```baml BAML
client<llm> MyClient {
  provider round-robin
  retry_policy MyRetryPolicy
  options {
    strategy [
      ClientA
      ClientB
      ClientC
    ]
  }
}
```

## Nesting multiple round-robin clients

You can nest multiple round-robin clients inside of each other. The round-robin as you would expect.

```baml BAML
client<llm> MyClient {
  provider round-robin
  options {
    strategy [
      ClientA
      ClientB
      ClientC
    ]
  }
}

client<llm> MegaClient {
  provider round-robin
  options {
    strategy [
      MyClient
      ClientD
      ClientE
    ]
  }
}

// Calling MegaClient will call:
// MyClient(ClientA)
// ClientD
// ClientE
// MyClient(ClientB)
// etc.
```

---
---

Use `{# ... #}` inside the `prompt` to add comments

---
title: Conditionals
---

Use conditional statements to control the flow and output of your templates based on conditions:

```jinja
function MyFunc(user: User) -> string {
  prompt #"
    {% if user.is_active %}
      Welcome back, {{ user.name }}!
    {% else %}
      Please activate your account.
    {% endif %}
  "#
}
```
---
title: ctx (accessing metadata)
---


If you try rendering `{{ ctx }}` into the prompt (literally just write that out!), you'll see all the metadata we inject to run this prompt within the playground preview.

In the earlier tutorial we mentioned `ctx.output_format`, which contains the schema, but you can also access client information:


## Usecase: Conditionally render based on client provider

In this example, we render the list of messages in XML tags if the provider is Anthropic (as they recommend using them as delimiters). See also  [template_string](/ref/baml/template-string) as it's used in here.

```baml
template_string RenderConditionally(messages: Message[]) #"
  {% for message in messages %}
    {%if ctx.client.provider == "anthropic" %}
      <Message>{{ message.user_name }}: {{ message.content }}</Message>
    {% else %}
      {{ message.user_name }}: {{ message.content }}
    {% endif %}
  {% endfor %}
"#

function MyFuncWithGPT4(messages: Message[]) -> string {
  client GPT4o
  prompt #"
    {{ RenderConditionally(messages)}}
  "#
}

function MyFuncWithAnthropic(messages: Message[]) -> string {
  client Claude35
  prompt #"
    {{ RenderConditionally(messages )}}
  #"
}
```

---
title: Loops
---

Here's how you can iterate over a list of items, accessing each item's attributes:

```jinja
function MyFunc(messages: Message[]) -> string {
  prompt #"
    {% for message in messages %}
      {{ message.user_name }}: {{ message.content }}
    {% endfor %}
  "#
}
```

## loop

Jinja provides a `loop` object that can be used to access information about the loop. Here are some of the attributes of the `loop` object:


| Variable         | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| loop.index       | The current iteration of the loop. (1 indexed)                              |
| loop.index0      | The current iteration of the loop. (0 indexed)                              |
| loop.revindex    | The number of iterations from the end of the loop (1 indexed)               |
| loop.revindex0   | The number of iterations from the end of the loop (0 indexed)               |
| loop.first       | True if first iteration.                                                    |
| loop.last        | True if last iteration.                                                     |
| loop.length      | The number of items in the sequence.                                        |
| loop.cycle       | A helper function to cycle between a list of sequences. See the explanation below. |
| loop.depth       | Indicates how deep in a recursive loop the rendering currently is. Starts at level 1 |
| loop.depth0      | Indicates how deep in a recursive loop the rendering currently is. Starts at level 0 |
| loop.previtem    | The item from the previous iteration of the loop. Undefined during the first iteration. |
| loop.nextitem    | The item from the following iteration of the loop. Undefined during the last iteration. |
| loop.changed(*val) | True if previously called with a different value (or not called at all).  |

```jinja2
prompt #"
  {% for item in items %}
    {{ loop.index }}: {{ item }}
  {% endfor %}
"#
```

---
title: ctx.output_format
---


`{{ ctx.output_format }}` is used within a prompt template (or in any template_string) to print out the function's output schema into the prompt. It describes to the LLM how to generate a structure BAML can parse (usually JSON).

Here's an example of a function with `{{ ctx.output_format }}`, and how it gets rendered by BAML before sending it to the LLM.

**BAML Prompt**

```baml
class Resume {
  name string
  education Education[]
}
function ExtractResume(resume_text: string) -> Resume {
  prompt #"
    Extract this resume:
    ---
    {{ resume_text }}
    ---

    {{ ctx.output_format }}
  "#
}
```

**Rendered prompt**

```text
Extract this resume
---
Aaron V.
Bachelors CS, 2015
UT Austin
---

Answer in JSON using this schema: 
{
  name: string
  education: [
    {
      school: string
      graduation_year: string
    }
  ]
}
```

## Controlling the output_format

`ctx.output_format` can also be called as a function with parameters to customize how the schema is printed, like this:
```text

{{ ctx.output_format(prefix="If you use this schema correctly and I'll tip $400:\n", always_hoist_enums=true)}}
```

Here's the parameters:
<ParamField path="prefix" type="string">
The prefix instruction to use before printing out the schema. 

```text
Answer in this schema correctly I'll tip $400:
{
  ...
}
```
BAML's default prefix varies based on the function's return type.

| Fuction return type | Default Prefix |
| --- | --- |
| Primitive (String) |  |
| Primitive (Int) | `Answer as an ` |
| Primitive (Other) | `Answer as a ` |
| Enum | `Answer with any of the categories:\n` |
| Class | `Answer in JSON using this schema:\n` |
| List | `Answer with a JSON Array using this schema:\n` |
| Union | `Answer in JSON using any of these schemas:\n` |
| Optional | `Answer in JSON using this schema:\n` |

</ParamField>

<ParamField path="always_hoist_enums" type="boolean" > 
Whether to inline the enum definitions in the schema, or print them above. **Default: false**

Note that setting this to `false` means BAML will use heuristics internally to determine
whether or not to hoist. `false` does not mean "never hoist".


**Inlined**
```

Answer in this json schema:
{
  categories: "ONE" | "TWO" | "THREE"
}
```

**hoisted**
```
MyCategory
---
ONE
TWO
THREE

Answer in this json schema:
{
  categories: MyCategory
}
```

<Warning>BAML will always hoist if you add a [description](/docs/snippets/enum#aliases-descriptions) to any of the enum values.</Warning>

</ParamField>

<ParamField path="or_splitter" type="string" >

**Default: ` or `**

If a type is a union like `string | int` or an optional like `string?`, this indicates how it's rendered. 


BAML renders it as `property: string or null` as we have observed some LLMs have trouble identifying what `property: string | null` means (and are better with plain english).

You can always set it to ` | ` or something else for a specific model you use.
</ParamField>

<ParamField path="hoist_classes" type="'auto' | bool | list[string]">

**Default: `"auto"`**

<Info>
Requires BAML Version 0.89+
</Info>

Controls which classes are hoisted in the prompt. Recursive classes are
**always** hoisted because they need to be referenced by name.

Let's use this as an example to visualize the different options:

```baml
class Example {
  a string
  b string
  c NestedClass
  d Node
}

class NestedClass {
  m int
  n int
}

class Node {
  data int
  next Node?
}

function UseExample() -> Example {
  client GPT4
  prompt #"{{ctx.output_format}}"#
}
```

**"auto"**

Only recursive classes are hoisted:

```baml
Node {
  data: int,
  next: Node or null
}

Answer in JSON using this schema:
{
  a: string,
  b: string,
  c: {
    m: int,
    n: int,
  },
  d: Node,
}
```

**false**

Same as `"auto"`.

**true**

Hoist all classes.

```baml
Node {
  data: int,
  next: Node or null
}

Example {
  a: string,
  b: string,
  c: NestedClass,
  d: Node,
}

NestedClass {
  m: int,
  n: int,
}

Answer in JSON using this schema: Example
```

**list[string]**

Hoist only recursive classes and the classes specified in the list. For example
`ctx.output_format(hoist_classes=["NestedClass"])` will hoist `NestedClass`.

```baml
Node {
  data: int,
  next: Node or null
}

NestedClass {
  m: int,
  n: int,
}

Answer in JSON using this schema:
{
  a: string,
  b: string,
  c: NestedClass,
  d: Node,
}
```

</ParamField>

<ParamField path="hoisted_class_prefix" type="string"> 
Prefix of hoisted classes in the prompt. **Default: `<none>`**

This parameter controls the prefix used for hoisted classes as well as the word
used in the render message to refer to the output type, which defaults to
`"schema"`:

```
Answer in JSON using this schema:
```

See examples below.

**Recursive BAML Prompt Example**

```baml
class Node {
  data int
  next Node?
}

class LinkedList {
  head Node?
  len int
}

function BuildLinkedList(input: int[]) -> LinkedList {
  prompt #"
    Build a linked list from the input array of integers.

    INPUT: {{ input }}

    {{ ctx.output_format }}    
  "#
}
```

**Default `hoisted_class_prefix` (none)**

```
Node {
  data: int,
  next: Node or null
}

Answer in JSON using this schema:
{
  head: Node or null,
  len: int
}
```

**Custom Prefix: `hoisted_class_prefix="interface"`**

```
interface Node {
  data: int,
  next: Node or null
}

Answer in JSON using this interface:
{
  head: Node or null,
  len: int
}
```
</ParamField>

## Why BAML doesn't use JSON schema format in prompts
BAML uses "type definitions" or "jsonish" format instead of the long-winded json-schema format.
The tl;dr is that json schemas are
1. 4x more inefficient than "type definitions".
2. very unreadable by humans (and hence models)
3. perform worse than type definitions (especially on deeper nested objects or smaller models)

Read our [full article on json schema vs type definitions](https://www.boundaryml.com/blog/type-definition-prompting-baml)

---
title: _.role
---


BAML prompts are compiled into a `messages` array (or equivalent) that most LLM providers use:

BAML Prompt -> `[{ role: "user": content: "hi there"}, { role: "assistant", ...}]`

By default, BAML puts everything into a single message with the `system` role if available (or whichever one is best for the provider you have selected). 
When in doubt, the playground always shows you the current role for each message.

To specify a role explicitly, add the `{{ _.role("user")}}` syntax to the prompt
```rust
prompt #"
  {{ _.role("system") }} Everything after
  this element will be a system prompt!

  {{ _.role("user")}} 
  And everything after this
  will be a user role
"#
```
Try it out in [PromptFiddle](https://www.promptfiddle.com)

<Note>
  BAML may change the default role to `user` if using specific APIs that only support user prompts, like when using prompts with images.
</Note>

We use `_` as the prefix of `_.role()` since we plan on adding more helpers here in the future.

## Example -- Using `_.role()` in for-loops

Here's how you can inject a list of user/assistant messages and mark each as a user or assistant role:

```rust BAML
class Message {
  role string
  message string
}

function ChatWithAgent(input: Message[]) -> string {
  client GPT4o
  prompt #"
    {% for m in messages %}
      {{ _.role(m.role) }}
      {{ m.message }}
    {% endfor %}
  "#
}
```

```rust BAML
function ChatMessages(messages: string[]) -> string {
  client GPT4o
  prompt #"
    {% for m in messages %}
      {{ _.role("user" if loop.index % 2 == 1 else "assistant") }}
      {{ m }}
    {% endfor %}
  "#
}
```

## Example -- Using `_.role()` in a template string

```baml BAML
template_string YouAreA(name: string, job: string) #"
  {{ _.role("system") }} 
  You are an expert {{ name }}. {{ job }}

  {{ ctx.output_format }}
  {{ _.role("user") }}
"#

function CheckJobPosting(post: string) -> bool {
  client GPT4o
  prompt #"
    {{ YouAreA("hr admin", "You're role is to ensure every job posting is bias free.") }}

    {{ post }}
  "#
}
```
---
title: Variables
---


See [template_string](/ref/baml/template-string) to learn how to add variables in .baml files

---
title: What is Jinja / Cookbook
---


BAML Prompt strings are essentially [Minijinja](https://docs.rs/minijinja/latest/minijinja/filters/index.html#functions) templates, which offer the ability to express logic and data manipulation within strings. Jinja is a very popular and mature templating language amongst Python developers, so Github Copilot or another LLM can already help you write most of the logic you want.

## Jinja Cookbook

When in doubt -- use the BAML VSCode Playground preview. It will show you the fully rendered prompt, even when it has complex logic.

### Basic Syntax 

- `{% ... %}`: Use for executing statements such as for-loops or conditionals.
- `{{ ... }}`: Use for outputting expressions or variables.
- `{# ... #}`: Use for comments within the template, which will not be rendered.

### Loops / Iterating Over Lists

Here's how you can iterate over a list of items, accessing each item's attributes:

```jinja Jinja
function MyFunc(messages: Message[]) -> string {
  prompt #"
    {% for message in messages %}
      {{ message.user_name }}: {{ message.content }}
    {% endfor %}
  "#
}
```

### Conditional Statements

Use conditional statements to control the flow and output of your templates based on conditions:

```jinja Jinja
function MyFunc(user: User) -> string {
  prompt #"
    {% if user.is_active %}
      Welcome back, {{ user.name }}!
    {% else %}
      Please activate your account.
    {% endif %}
  "#
}
```

### Setting Variables

You can define and use variables within your templates to simplify expressions or manage data:

```jinja
function MyFunc(items: Item[]) -> string {
  prompt #"
    {% set total_price = 0 %}
    {% for item in items %}
      {% set total_price = total_price + item.price %}
    {% endfor %}
    Total price: {{ total_price }}
  "#
}
```

### Including other Templates

To promote reusability, you can include other templates within a template. See [template strings](/ref/baml/template-string):

```baml
template_string PrintUserInfo(arg1: string, arg2: User) #"
  {{ arg1 }}
  The user's name is: {{ arg2.name }}
"#

function MyFunc(arg1: string, user: User) -> string {
  prompt #"
    Here is the user info:
    {{ PrintUserInfo(arg1, user) }}
  "#
}
```

### Built-in filters
See [jinja docs](https://jinja.palletsprojects.com/en/3.1.x/templates/#list-of-builtin-filters)

Allow you to store and manipulate collections of data. They can be declared in a concise and readable manner, supporting both single-line and multi-line formats.

## Syntax

To declare an array in a BAML file, you can use the following syntax:

```baml
{
  key1 [value1, value2, value3],
  key2 [
    value1,
    value2,
    value3
  ],
  key3 [
    {
      subkey1 "valueA",
      subkey2 "valueB"
    },
    {
      subkey1 "valueC",
      subkey2 "valueD"
    }
  ]
}
```

### Key Points:
- **Commas**: Optional for multi-line arrays, but recommended for clarity.
- **Nested Arrays**: Supported, allowing complex data structures.
- **Key-Value Pairs**: Arrays can contain objects with key-value pairs.

## Usage Examples

### Example 1: Simple Array

```baml
function DescriptionGame(items: string[]) -> string {
    client "openai/gpt-4o-mini"
    prompt #"
        What 3 words best describe all of these: {{ items }}.
    "#
}

test FruitList {
    functions [DescriptionGame]
    args { items ["apple", "banana", "cherry"] }
}
```

### Example 2: Multi-line Array

```baml
test CityDescription {
    functions [DescriptionGame]
    args { items [
            "New York",
            "Los Angeles",
            "Chicago"
        ]
    }
}
```
`true` or `false`

## Usage

```baml
function CreateStory(long: bool) -> string {
    client "openai/gpt-4o-mini"
    prompt #"
        Write a story that is {{ "10 paragraphs" if long else "1 paragraph" }} long.
    "#
}

test LongStory {
    functions [CreateStory]
    args { long true }
}

test ShortStory {
    functions [CreateStory]
    args { long false }
}
```

Classes consist of a name, a list of properties, and their [types](class).
In the context of LLMs, classes describe the type of the variables you can inject into prompts and extract out from the response.

<Warning>
  Note properties have no `:`
</Warning>

<CodeBlocks>
```baml Baml
class Foo {
  property1 string
  property2 int?
  property3 Bar[]
  property4 MyEnum
}
```

```python Python Equivalent
from pydantic import BaseModel
from path.to.bar import Bar
from path.to.my_enum import MyEnum

class Foo(BaseModel):
  property1: str
  property2: Optional[int]= None
  property3: List[Bar]
  property4: MyEnum
```

```typescript Typescript Equivalent
import z from "zod";
import { BarZod } from "./path/to/bar";
import { MyEnumZod } from "./path/to/my_enum";

const FooZod = z.object({
  property1: z.string(),
  property2: z.number().int().nullable().optional(),
  property3: z.array(BarZod),
  property4: MyEnumZod,
});

type Foo = z.infer<typeof FooZod>;
```

</CodeBlocks>

## Field Attributes

When prompt engineering, you can also alias values and add descriptions.

<ParamField
  path="@alias"
  type="string"
>
Aliasing renames the field for the llm to potentially "understand" your value better, while keeping the original name in your code, so you don't need to change your downstream code everytime.

This will also be used for parsing the output of the LLM back into the original object.
</ParamField>

<ParamField
  path="@description"
  type="string"
>
This adds some additional context to the field in the prompt.
</ParamField>


```baml BAML
class MyClass {
  property1 string @alias("name") @description("The name of the object")
  age int? @description("The age of the object")
}
```

## Class Attributes

<ParamField
  path="@@dynamic"
>
If set, will allow you to add fields to the class dynamically at runtime (in your python/ts/etc code). See [dynamic classes](/guide/baml-advanced/dynamic-runtime-types) for more information.
</ParamField>


```baml BAML
class MyClass {
  property1 string
  property2 int?

  @@dynamic // allows me to later propert3 float[] at runtime
}
```

## Syntax

Classes may have any number of properties.
Property names must follow these rules:
- Must start with a letter
- Must contain only letters, numbers, and underscores
- Must be unique within the class
- classes can be recursively defined!

The type of a property can be any [supported type](/ref/baml/types)

### Default values

- Not yet supported. For optional properties, the default value is `None` in python.

### Dynamic classes

See [Dynamic Types](/guide/baml-advanced/dynamic-runtime-types).

## Inheritance

Never supported. Like rust, we take the stance that [composition is better than inheritance](https://www.digitalocean.com/community/tutorials/composition-vs-inheritance).

---
title: LLM Clients (client<llm>)
---

Clients are used to configure how LLMs are called, like so:

```rust BAML
function MakeHaiku(topic: string) -> string {
  client "openai/gpt-4o"
  prompt #"
    Write a haiku about {{ topic }}.
  "#
}
```

`<provider>/<model>` shorthand for the Named Client version of `MyClient`:

```rust BAML
client<llm> MyClient {
  provider "openai"
  options {
    model "gpt-4o"
    // api_key defaults to env.OPENAI_API_KEY
  }
}

function MakeHaiku(topic: string) -> string {
  client MyClient
  prompt #"
    Write a haiku about {{ topic }}.
  "#
}
```

Consult the [provider documentation](#fields) for a list of supported providers
and models, and the default options.

If you want to override options like `api_key` to use a different environment
variable, or you want to point `base_url` to a different endpoint, you should use
the latter form.

<Tip>
If you want to specify which client to use at runtime, in your Python/TS/Ruby code,
you can use the [client registry](/ref/baml_client/client-registry) to do so.

This can come in handy if you're trying to, say, send 10% of your requests to a
different model.
</Tip>

## Fields

<Markdown src="/snippets/client-constructor.mdx" />

<ParamField path="retry_policy">
  The name of the retry policy. See [Retry
  Policy](/ref/llm-client-strategies/retry-policy).
</ParamField>

## Single line / trailing comments

Denoted by `//`.

```baml
// hello there!
foo // this is a trailing comment
```

## Docstrings

To add a docstring to any block, use `///`.

```baml
/// This is a docstring for a class
class Foo {
    /// This is a docstring for a property
    property1 string
}
```

Docstrings in BAML code will be carried through to generated types.
They are not forwarded to the LLM through prompts.

{/* ## Multiline comments

Multiline comments are denoted via `{//` and `//}`.

```baml
{//
    this is a multiline comment
    foo
    bar
//}
``` */}
 
## Comments in block strings

See [Block Strings](/ref/baml/general-baml-syntax/string#block-strings) for more information.

```jinja
#"
    My string. {#
        This is a comment
    #}
    hi!
"#
```
Enums are useful for classification tasks. BAML has helper functions that can help you serialize an enum into your prompt in a neatly formatted list (more on that later).

To define your own custom enum in BAML:

<CodeBlocks>
```baml BAML
enum MyEnum {
  Value1
  Value2
  Value3
}
```

```python Python Equivalent
from enum import StrEnum

class MyEnum(StrEnum):
  Value1 = "Value1"
  Value2 = "Value2"
  Value3 = "Value3"
```

```typescript Typescript Equivalent
enum MyEnum {
  Value1 = "Value1",
  Value2 = "Value2",
  Value3 = "Value3",
}
```

</CodeBlocks>

- You may have as many values as you'd like.
- Values may not be duplicated or empty.
- Values may not contain spaces or special characters and must not start with a number.

## Enum Attributes

<ParamField
  path="@@alias"
  type="string"
>
This is the name of the enum rendered in the prompt.
</ParamField>


<ParamField
  path="@@dynamic"
>
If set, will allow you to add/remove/modify values to the enum dynamically at runtime (in your python/ts/etc code). See [dynamic enums](/guide/baml-advanced/dynamic-runtime-types) for more information.
</ParamField>


```baml BAML
enum MyEnum {
  Value1
  Value2
  Value3

  @@alias("My Custom Enum")
  @@dynamic // allows me to later skip Value2 at runtime
}
```

## Value Attributes

When prompt engineering, you can also alias values and add descriptions, or even skip them.

<ParamField
  path="@alias"
  type="string"
>
Aliasing renames the values for the llm to potentially "understand" your value better, while keeping the original name in your code, so you don't need to change your downstream code everytime.

This will also be used for parsing the output of the LLM back into the enum.
</ParamField>

<ParamField
  path="@description"
  type="string"
>
This adds some additional context to the value in the prompt.
</ParamField>

<ParamField
  path="@skip"
>
Skip this value in the prompt and during parsing.
</ParamField>


```baml BAML
enum MyEnum {
  Value1 @alias("complete_summary") @description("Answer in 2 sentences")
  Value2
  Value3 @skip
  Value4 @description(#"
    This is a long description that spans multiple lines.
    It can be useful for providing more context to the value.
  "#)
}
```


See more in [prompt syntax docs](/ref/prompt-syntax/what-is-jinja)

To set a value to an environment variable, use the following syntax:

```baml
env.YOUR_VARIABLE_NAME
```

<Warning>Environment variables with spaces in their names are not supported.</Warning>

### Example

Using an environment variable for API key:

```baml
client<llm> MyCustomClient {
    provider "openai"
    options {
        model "gpt-4o-mini"
        // Set the API key using an environment variable
        api_key env.MY_SUPER_SECRET_API_KEY
    }
}
```

<Markdown src="/snippets/setting-env-vars.mdx" />

## Error Handling
Errors for unset environment variables are only thrown when the variable is accessed. If your BAML project has 15 environment variables and 1 is used for the function you are calling, only that one environment variable will be checked for existence.

Functions in BAML define the contract between your application and AI models, providing type-safe interfaces for AI operations.

## Overview

A BAML function consists of:
- Input parameters with explicit types
- A return type specification
- An [LLM client](client-llm)
- A prompt (as a [block string](general-baml-syntax/string#block-strings))

```baml
function FunctionName(param: Type) -> ReturnType {
    client ModelName
    prompt #"
        Template content
    "#
}
```

## Function Declaration

### Syntax

```baml
function name(parameters) -> return_type {
    client llm_specification
    prompt block_string_specification
}
```

### Parameters

- `name`: The function identifier (must start with a capital letter!)
- `parameters`: One or more typed parameters (e.g., `text: string`, `data: CustomType`)
- `return_type`: The type that the function guarantees to return (e.g., `string | MyType`)
- `llm_specification`: The LLM to use (e.g., `"openai/gpt-4o-mini"`, `GPT4Turbo`, `Claude2`)
- `block_string_specification`: The prompt template using Jinja syntax

## Type System

Functions leverage BAML's strong type system, supporting:

### Built-in Types
- `string`: Text data
- `int`: Integer numbers
- `float`: Decimal numbers
- `bool`: True/false values
- `array`: Denoted with `[]` suffix (e.g., `string[]`)
- `map`: Key-value pairs (e.g., `map<string, int>`)
- `literal`: Specific values (e.g., `"red" | "green" | "blue"`)
- [See all](types)

### Custom Types

Custom types can be defined using class declarations:

```baml
class CustomType {
    field1 string
    field2 int
    nested NestedType
}

function ProcessCustomType(data: CustomType) -> ResultType {
    // ...
}
```

## Prompt Templates

### Jinja Syntax

BAML uses Jinja templating for dynamic prompt generation:

```baml
prompt #"
    Input data: {{ input_data }}
    
    {% if condition %}
        Conditional content
    {% endif %}
    
    {{ ctx.output_format }}
"#
```

### Special Variables

- `ctx.output_format`: Automatically generates format instructions based on return type
- `ctx.client`: Selected client and model name
- `_.role`: Define the role of the message chunk

## Error Handling

Functions automatically handle common AI model errors and provide type validation:

- JSON parsing errors are automatically corrected
- Type mismatches are detected and reported
- Network and rate limit errors are propagated to the caller

## Usage Examples

### Basic Function

```baml
function ExtractEmail(text: string) -> string {
    client GPT4Turbo
    prompt #"
        Extract the email address from the following text:
        {{ text }}
        
        {{ ctx.output_format }}
    "#
}
```

### Complex Types

```baml
class Person {
    name string
    age int
    contacts Contact[]
}

class Contact {
    type "email" | "phone"
    value string
}

function ParsePerson(data: string) -> Person {
    client "openai/gpt-4o"
    prompt #"
        {{ ctx.output_format }}
        
        {{ _.role('user') }}
        {{ data }}
    "#
}
```

## `baml_client` Integration

<CodeBlocks>

```python Python
from baml_client import b
from baml_client.types import Person

async def process() -> Person:
    result = b.ParsePerson("John Doe, 30 years old...")
    print(result.name)  # Type-safe access
    return result
```


```typescript TypeScript
import { b } from 'baml-client';
import { Person } from 'baml-client/types';

async function process(): Promise<Person> {
    const result = await b.ParsePerson("John Doe, 30 years old...");
    console.log(result.name);  // Type-safe access
    return result;
}
```

</CodeBlocks>



Numerical values as denoted more specifically in BAML.

| Value | Description |
| --- | --- |
| `int` | Integer |
| `float` | Floating point number |


We support implicit casting of int -> float, but if you need something to explicitly be a float, use `0.0` instead of `0`.


## Usage


```baml
function DescribeCircle(radius: int | float, pi: float?) -> string {
    client "openai/gpt-4o-mini"
    prompt #"
        Describe a circle with a radius of {{ radius }} units.
        Include the area of the circle using pi as {{ pi or 3.14159 }}.
        
        What are some properties of the circle?
    "#
}

test CircleDescription {
    functions [DescribeCircle]
    // will be cast to int
    args { radius 5 }
}

test CircleDescription2 {
    functions [DescribeCircle]
    // will be cast to float
    args { 
        radius 5.0 
        pi 3.14
    }
}
```
Map values (AKA Dictionaries) allow you to store key-value pairs.

<Tip>Most of BAML (clients, tests, classes, etc) is represented as a map.</Tip>

## Syntax

To declare a map in a BAML file, you can use the following syntax:

```baml
{
  key1 value1,
  key2 {
    nestedKey1 nestedValue1,
    nestedKey2 nestedValue2
  }
}
```

### Key Points:
- **Colons**: Not used in BAML maps; keys and values are separated by spaces.
- **Value Types**: Maps can contain unquoted or quoted strings, booleans, numbers, and nested maps as values.
- **Classes**: Classes in BAML are represented as maps with keys and values.

## Usage Examples

### Example 1: Simple Map

```baml

class Person {
    name string
    age int
    isEmployed bool
}

function DescribePerson(person: Person) -> string {
    client "openai/gpt-4o-mini"
    prompt #"
        Describe the person with the following details: {{ person }}.
    "#
}

test PersonDescription {
    functions [DescribePerson]
    args { 
        person {
            name "John Doe",
            age 30,
            isEmployed true
        }
    }
}
```

### Example 2: Nested Map

```baml

class Company {
    name string
    location map<string, string>
    employeeCount int
}

function DescribeCompany(company: Company) -> string {
    client "openai/gpt-4o-mini"
    prompt #"
        Describe the company with the following details: {{ company }}.
    "#
}

test CompanyDescription {
    functions [DescribeCompany]
    args { 
        company {
            name "TechCorp",
            location {
                city "San Francisco",
                state "California"
            },
            employeeCount 500
        }
    }
}
```

### Example 3: Map with Multiline String

```baml
class Project {
    title string
    description string
}

function DescribeProject(project: Project) -> string {
    client "openai/gpt-4o-mini"
    prompt #"
        Describe the project with the following details: {{ project }}.
    "#
}

test ProjectDescription {
    functions [DescribeProject]
    args { 
        project {
            title "AI Research",
            description #"
                This project focuses on developing
                advanced AI algorithms to improve
                machine learning capabilities.
            "#
        }
    }
}
```
---
title: Image / Audio
---

Media values as denoted more specifically in BAML.

| Baml Type |
| --- |
| `image` |
| `audio` |

Both `image` and `audio` values values can be:

- A URL
- A base64 encoded string
- A file path

For usage in Python / Typescript / etc, see [baml_client > media](/ref/baml_client/media).

## Usage as a URL

```baml {2,13-15,22-25,32-34}
// Pass in an image type
function DescribeImage(image: image) -> string {
    client "openai/gpt-4o-mini"
    prompt #"
        Describe the image.
        {{ image }}
    "#
}

test ImageDescriptionFromURL {
    functions [DescribeImage]
    args {
        image {
            url "https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png"
        }
    }
}

test ImageDescriptionFromBase64 {
    functions [DescribeImage]
    args { 
        image {
            media_type "image/png"
            base64 "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x/AAzmH+UlvRkwAAAAASUVORK5CYII="
        }
    }
}

test ImageDescriptionFromFile {
    functions [DescribeImage]
    args {
        image {
            file "./shrek.png"
        }
    }
}

BAML treats templatized strings as first-class citizens.

## Quoted Strings

These is a valid **inline string**, which is surrounded by double quotes. They behave like regular strings in most programming languages, and can be escaped with a backslash.

<Tip>These cannot have template variables or expressions inside them. Use a block string for that.</Tip>


```rust
"Hello World"

"\n"
```

## Unquoted Strings

BAML also supports simple **unquoted in-line** strings. The string below is valid! These are useful for simple strings such as configuration options.

```rust
Hello World
```

Unquoted strings **may not** have any of the following since they are reserved characters (note this may change in the future):

- Quotes "double" or 'single'
- At-signs @
- Curlies {}
- hashtags #
- Parentheses ()
- Brackets []
- commas ,
- newlines

When in doubt, use a quoted string or a block string, but the VSCode extension will warn you if there is a parsing issue.

## Block Strings

If a string is on multiple lines, it must be surrounded by #" and "#. This is called a **block string**.

```rust
#"
Hello
World
"#
```

Block strings are automatically dedented and stripped of the first and last newline. This means that the following will render the same thing as above

```rust
#"
    Hello
    World
"#
```

When used for templating, block strings can contain expressions and variables using [Jinja](https://jinja.palletsprojects.com/en/3.0.x/templates/) syntax.

```rust
template_string Greeting(name: string) #"
  Hello {{ name }}!
"#
```

### Escape Characters

Escaped characters are injected as is into the string.

```rust
#"\n"#
```

This will render as `\\n` in the output.

### Adding a `"#`
To include a `"#` in a block string, you can prefix it with a different count of `#`.


```baml
###"
  #"Hello"#
"###
```

This will render as `#"Hello"#`.


Writing prompts requires a lot of string manipulation. BAML has a `template_string` to let you combine different string templates together. Under-the-hood they use [jinja](/ref/prompt-syntax/what-is-jinja) to evaluate the string and its inputs.

Think of template strings as functions that have variables, and return a string. They can be used to define reusable parts of a prompt, or to make the prompt more readable by breaking it into smaller parts.

Example
```baml BAML
// Inject a list of "system" or "user" messages into the prompt.
template_string PrintMessages(messages: Message[]) #"
  {% for m in messages %}
    {{ _.role(m.role) }}
    {{ m.message }}
  {% endfor %}
"#

function ClassifyConversation(messages: Message[]) -> Category[] {
  client GPT4Turbo
  prompt #"
    Classify this conversation:
    {{ PrintMessages(messages) }}

    Use the following categories:
    {{ ctx.output_format}}
  "#
}
```

In this example we can call the template_string `PrintMessages` to subdivide the prompt into "user" or "system" messages using `_.role()` (see [message roles](/ref/prompt-syntax/role)). This allows us to reuse the logic for printing messages in multiple prompts. 

You can nest as many template strings inside each other and call them however many times you want.

<Warning>
  The BAML linter may give you a warning when you use template strings due to a static analysis limitation. You can ignore this warning. If it renders in the playground, you're good!
</Warning>
Use the playground preview to ensure your template string is being evaluated correctly!

Tests are first-class citizens in BAML, designed to make testing AI functions straightforward and robust. BAML tests can be written anywhere in your codebase and run with minimal setup.

## Overview

A BAML test consists of:
- Test name and metadata
- Functions under test
- Input arguments
- Optional testing configuration
- Optional assertions
- Optional type builders

```baml
test TestName {
    functions [FunctionName]
    args {
        paramName "value"
    }
}
```

## Test Declaration

### Basic Syntax

```baml
test name {
    functions [function_list]
    args {
        parameter_assignments
    }
}
```

### Optional Features

```baml {3-11, 15, 16}
test name {
    functions [function_list]
    type_builder {
        class NewType {
            // Props
        }
        dynamic class ExistingDynamicType {
            new_prop NewType
            // Inject Props Here
        }
    }
    args {
        parameter_assignments
    }
    @@check( check_length, {{ this.prop|length > 0 }} )
    @@assert( {{ this.prop|length < 255 }})
}
```

### Components

- `name`: Test identifier (unique per function)
- `functions`: List of functions to test
- `args`: Input parameters for the test case
- `type_builder`: Block used to inject values into dynamic types
- `@@check`: Conditional check for test validity
- `@@assert`: Assertion for test result

## Input Types

### Basic Types

Simple values are provided directly:

```baml
test SimpleTest {
    functions [ClassifyMessage]
    args {
        input "Can't access my account"
    }
}
```

### Complex Objects

Objects are specified using nested structures:

```baml
test ComplexTest {
    functions [ProcessMessage]
    args {
        message {
            user "john_doe"
            content "Hello world"
            metadata {
                timestamp 1234567890
                priority "high"
            }
        }
    }
}
```

### Arrays

Arrays use bracket notation:

```baml
test ArrayTest {
    functions [BatchProcess]
    args {
        messages [
            {
                user "user1"
                content "Message 1"
            }
            {
                user "user2"
                content "Message 2"
            }
        ]
    }
}
```

## Media Inputs

### Images

Images can be specified using three methods:

1. **File Reference**
```baml {4-6}
test ImageFileTest {
    functions [AnalyzeImage]
    args {
        param {
            file "../images/test.png"
        }
    }
}
```

2. **URL Reference**
```baml {4-6}
test ImageUrlTest {
    functions [AnalyzeImage]
    args {
        param {
            url "https://example.com/image.jpg"
        }
    }
}
```

3. **Base64 Data**
```baml {4-7}
test ImageBase64Test {
    functions [AnalyzeImage]
    args {
        param {
            base64 "a41f..."
            media_type "image/png"
        }
    }
}
```

### Audio

Similar to images, audio can be specified in three ways:

1. **File Reference**
```baml
test AudioFileTest {
    functions [TranscribeAudio]
    args {
        audio {
            file "../audio/sample.mp3"
        }
    }
}
```

2. **URL Reference**
```baml
test AudioUrlTest {
    functions [TranscribeAudio]
    args {
        audio {
            url "https://example.com/audio.mp3"
        }
    }
}
```

3. **Base64 Data**
```baml
test AudioBase64Test {
    functions [TranscribeAudio]
    args {
        audio {
            base64 "..."
            media_type "audio/mp3"
        }
    }
}
```

## Multi-line Strings

For long text inputs, use the block string syntax:

```baml
test LongTextTest {
    functions [AnalyzeText]
    args {
        content #"
            This is a multi-line
            text input that preserves
            formatting and whitespace
        "#
    }
}
```

## Testing Multiple Functions

This requires each function to have the exact same parameters:

```baml
test EndToEndFlow {
    functions [
        ExtractInfo
        ProcessInfo
        ValidateResult
    ]
    args {
        input "test data"
    }
}
```

## Testing Dynamic Types

Dynamic types can be tested using `type_builder` and `dynamic` blocks:

<Markdown src="../../snippets/dynamic-class-test.mdx" />

## Integration with Development Tools

### VSCode Integration

- Tests can be run directly from the BAML playground
- Real-time syntax validation
- Test result visualization




Here's a list of all the types that can be represented in BAML:

## Primitive Types
* `bool`
* `int`
* `float`
* `string`
* `null`

## Literal Types
<Info>
  This feature was added in: v0.61.0.
</Info>

The primitive types `string`, `int` and `bool` can be constrained to a specific value.
For example, you can use literal values as return types:

```rust
function ClassifyIssue(issue_description: string) -> "bug" | "enhancement" {
  client GPT4Turbo
  prompt #"
    Classify the issue based on the following description:
    {{ ctx.output_format }}

    {{ _.role("user")}}
    {{ issue_description }}
  "#
}
```

See [Union(|)](#union-) for more details.


## Multimodal Types
See [calling a function with multimodal types](/guide/baml-basics/multi-modal)
and [testing image inputs](/guide/baml-basics/testing-functions#test-image-inputs-in-the-playground)

<Accordion title="Implementation details: runtime and security considerations">
  BAML's multimodal types are designed for ease of use: we have deliberately made it
  easy for you to construct a `image` or `audio` instance from a URL. Under the
  hood, depending on the model you're using, BAML may need to download the image
  and transcode it (usually as base64) for the model to consume.

  This ease-of-use does come with some tradeoffs; namely, if you construct
  an `image` or `audio` instance using untrusted user input, you may be exposing
  yourself to [server-side request forgery (SSRF) attacks][ssrf]. Attackers may be
  able to fetch files on your internal network, on external networks using your
  application's identity, or simply excessively drive up your cloud network
  bandwidth bill.

  To prevent this, we recommend only using URLs from trusted sources/users or
  validating them using allowlists or denylists.

[ssrf]: https://portswigger.net/web-security/ssrf
</Accordion>

### `image`

You can use an image like this for models that support them:

```rust
function DescribeImage(myImg: image) -> string {
  client GPT4Turbo
  prompt #"
    {{ _.role("user")}}
    Describe the image in four words:
    {{ myImg }}
  "#
}
```

You cannot name a variable `image` at the moment as it is a reserved keyword.

Calling a function with an image type:

<CodeBlocks>
```python Python
from baml_py import Image
from baml_client import b

async def test_image_input():
  # from URL
  res = await b.TestImageInput(
    img=Image.from_url("https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png")
  )

  # Base64 image
  image_b64 = "iVBORw0K...."
  res = await b.TestImageInput(
    img=Image.from_base64("image/png", image_b64)
  )
```

```typescript TypeScript
import { b } from '../baml_client'
import { Image } from "@boundaryml/baml"
...

  // URL
  let res = await b.TestImageInput(
    Image.fromUrl('https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png'),
  )

  // Base64
  let res = await b.TestImageInput(
    Image.fromBase64('image/png', image_b64),
  )
```

```ruby Ruby
require_relative "baml_client/client"

b = Baml.Client
Image = Baml::Image

def test_image_input
  # from URL
  res = b.TestImageInput(
    img: Image.from_url("https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png")
  )

  # Base64 image
  image_b64 = "iVBORw0K...."
  res = b.TestImageInput(
    img: Image.from_base64("image/png", image_b64)
  )
end
```
</CodeBlocks>

<Accordion title="Pydantic compatibility">
If using Pydantic, the following are valid ways to construct the `Image` type.

```json
{
  "url": "https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png"
}
```

```json
{
  "url": "https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png",
  "media_type": "image/png"
}
```

```json
{
  "base64": "iVBORw0K....",
}
```

```json
{
  "base64": "iVBORw0K....",
  "media_type": "image/png"
}
```
</Accordion>

### `audio`

Example
```rust
function DescribeSound(myAudio: audio) -> string {
  client GPT4Turbo
  prompt #"
    {{ _.role("user")}}
    Describe the audio in four words:
    {{ myAudio }}
  "#
}
```
Calling functions that have `audio` types.

<CodeBlocks>
```python Python
from baml_py import Audio
from baml_client import b

async def run():
  # from URL
  res = await b.TestAudioInput(
      audio=Audio.from_url(
          "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg"
      )
  )

  # Base64
  b64 = "iVBORw0K...."
  res = await b.TestAudioInput(
    audio=Audio.from_base64("audio/ogg", b64)
  )
```

```typescript TypeScript
import { b } from '../baml_client'
import { Audio } from "@boundaryml/baml"
...

  // URL
  let res = await b.TestAudioInput(
    Audio.fromUrl('https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg'),
  )

  // Base64
  const audio_base64 = ".."
  let res = await b.TestAudioInput(
    Audio.fromBase64('audio/ogg', audio_base64),
  )
  
```

```ruby Ruby
require_relative "baml_client/client"

b = Baml.Client
Audio = Baml::Audio

def test_audio_input
  # from URL
  res = b.TestAudioInput(
      audio: Audio.from_url(
          "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg"
      )
  )

  # Base64 image
  audio_b64 = "iVBORw0K...."
  res = b.TestAudioInput(
    audio: Audio.from_base64("audio/mp3", audio_b64)
  )
end
```
</CodeBlocks>

## Composite/Structured Types

### enum

**See also:** [Enum](/docs/snippets/enum)

A user-defined type consisting of a set of named constants.
Use it when you need a model to choose from a known set of values, like in classification problems

```baml
enum Name {
  Value1
  Value2 @description("My optional description annotation")
}
```

If you need to add new variants, because they need to be loaded from a file or fetched dynamically
from a database, you can do this with [Dynamic Types](/guide/baml-advanced/dynamic-runtime-types).

### class

**See also:** [Class](/docs/snippets/class)

Classes are for user-defined complex data structures.

Use when you need an LLM to call another function (e.g. OpenAI's function calling), you can model the function's parameters as a class. You can also get models to return complex structured data by using a class.

**Example:**

Note that properties have no `:`
```baml
class Car {
  model string
  year int @description("Year of manufacture")
}
```

If you need to add fields to a class because some properties of your class are only
known at runtime, you can do this with [Dynamic Types](/docs/calling-baml/dynamic-types).

### Optional (?)

A type that represents a value that might or might not be present.

Useful when a variable might not have a value and you want to explicitly handle its absence.

**Syntax:** `Type?`

**Example:** `int?` or `(MyClass | int)?`

### Union (|)

A type that can hold one of several specified types.

This can be helpful with **function calling**, where you want to return different types of data depending on which function should be called.

**Syntax:** `Type1 | Type2`

**Example:** `int | string` or `(int | string) | MyClass` or `string | MyClass | int[]`

<Warning>
  Order is important. `int | string` is not the same as `string | int`.

  For example, if you have a `"1"` string, it will be parsed as an `int` if
  you use `int | string`, but as a `string` if you use `string | int`.
</Warning>

### List/Array ([])

A collection of elements of the same type.

**Syntax:** `Type[]`

**Example:** `string[]` or `(int | string)[]` or `int[][]`

<Tip>
  * Array types can be nested to create multi-dimensional arrays
  * An array type cannot be optional
</Tip>

### Map

A mapping of strings or enums to elements of another type.

**Syntax**: `map<string, ValueType>`

**Example**: `map<string, string>`

Enums and literal strings can also be used as keys.

```baml
enum Category {
  A
  B
  C
}

// Enum key syntax
map<Category, string>

// Literal strings syntax
map<"A" | "B" | "C", string>
```

{/* <Info>
  For TS users: `map<string, ValueType>` will generate a 
  `Record<string, ValueType>` type annotation, but using any other type for the
  key will generate a `Map`, e.g. `map<int, string>` in BAML will generate a
  `Map<number, string>` type annotation in TypeScript.
</Info> */}

### ❌ Set

- Not yet supported. Use a `List` instead.

### ❌ Tuple

- Not yet supported. Use a `class` instead.

## Type Aliases

<Info>
  This feature was added in: v0.71.0.
</Info>

A _type alias_ is an alternative name for an existing type. It can be used to
simplify complex types or to give a more descriptive name to a type. Type
aliases are defined using the `type` keyword:

```baml
type Graph = map<string, string[]>
```

Type aliases can point to other aliases:

```baml
type DataStructure = string[] | Graph
```

Recursive type aliases are supported only through map or list containers, just
like in TypeScript:

```baml
type JsonValue = int | string | bool | float | JsonObject | JsonArray
type JsonObject = map<string, JsonValue>
type JsonArray = JsonValue[]
```

Aliases can also refer to themselves:

```baml
type JsonValue = int | float | bool | string | null | JsonValue[] | map<string, JsonValue> 
```

However, this is invalid since no value can satisfy this type:

```baml
type A = B
type B = A
```

## Examples and Equivalents

Here are some examples and what their equivalents are in different languages.

### Example 1

<CodeBlocks>
```baml BAML
int? | string[] | MyClass
````

```python Python Equivalent
Union[Optional[int], List[str], MyClass]
```

```typescript TypeScript Equivalent
(number | null) | string[] | MyClass
```

</CodeBlocks>

### Example 2

<CodeBlocks>
```baml BAML
string[]
```

```python Python Equivalent
List[str]
```

```typescript TypeScript Equivalent
string[]
```

</CodeBlocks>

### Example 3

<CodeBlocks>
```baml BAML
(int | float)[]
```
```python Python Equivalent
List[Union[int, float]]
```

```typescript TypeScript Equivalent
number[]
```

</CodeBlocks>

### Example 4

<CodeBlocks>
```baml BAML
(int? | string[] | MyClass)[]
```

```python Python Equivalent
Optional[List[Union[Optional[int], List[str], MyClass]]]
```

```typescript TypeScript Equivalent
((number | null) | string[] | MyClass)[]
```

</CodeBlocks>

### Example 5

<CodeBlocks>
```baml BAML
"str" | 1 | false
```

```python Python Equivalent
Union[Literal["str"], Literal[1], Literal[False]]
```

```typescript TypeScript Equivalent
"str" | 1 | false
```

</CodeBlocks>

## ⚠️ Unsupported
- `any/json` - Not supported. We don't want to encourage its use as it defeats the purpose of having a type system. if you really need it, for now use `string` and call `json.parse` yourself or use [dynamic types](/guide/baml-advanced/dynamic-runtime-types)
- `datetime` - Not yet supported. Use a `string` instead.
- `duration` - Not yet supported. We recommend using `string` and specifying that it must be an "ISO8601 duration" in the description, which you can parse yourself into a duration.
- `units (currency, temperature)` - Not yet supported. Use a number (`int` or `float`) and have the unit be part of the variable name. For example, `temperature_fahrenheit` and `cost_usd` (see [@alias](/ref/baml/class))

---
title: BamlClientFinishReasonError
description: Technical reference for the BamlClientFinishReasonError class
---

The `BamlClientFinishReasonError` class represents an error that occurs when an LLM terminates with a disallowed finish reason.

You can allow or disallow finish reasons like this:

<CodeBlocks>
```baml
client<llm> OpenAIWithFinishReasonError {
  provider openai
  options {
    api_key env.OPENAI_API_KEY
    model "gpt-4"
    // make it very small so model will stop early
    max_tokens 10 
    // throws if the model returns any other finish reason
    finish_reason_allow_list ["stop"]
    // or allow all finish reasons except length
    // finish_reason_deny_list ["length"]
  }
}
```
</CodeBlocks>

## Type Definition

<CodeBlocks>
```typescript Type Definition
class BamlClientFinishReasonError extends Error {
  type: 'BamlClientFinishReasonError'
  message: string
  prompt: string
  raw_output: string
}
```
</CodeBlocks>

## Properties

<ParamField
  path="type"
  type="'BamlClientFinishReasonError'"
>
  Literal type identifier for the error class.
</ParamField>

<ParamField
  path="message"
  type="string"
>
  Error message describing the specific finish reason that caused the termination.
</ParamField>

<ParamField
  path="prompt"
  type="string"
>
  The original prompt sent to the LLM.
</ParamField>

<ParamField
  path="raw_output"
  type="string"
>
  The partial output received from the LLM before termination.
</ParamField>

## Type Guards

The error can be identified using TypeScript's `instanceof` operator:

<CodeBlocks>
```typescript Type Check
if (error instanceof BamlClientFinishReasonError) {
  // Handle finish reason error
}
```
</CodeBlocks>

---
title: BamlValidationError
description: Technical reference for the BamlValidationError class
---

The `BamlValidationError` class represents an error that occurs when BAML fails to parse or validate LLM output.

## Type Definition

<CodeBlocks>
```typescript Type Definition
class BamlValidationError extends Error {
  type: 'BamlValidationError'
  message: string
  prompt: string
  raw_output: string
}
```
</CodeBlocks>

## Properties

<ParamField
  path="type"
  type="'BamlValidationError'"
>
  Literal type identifier for the error class.
</ParamField>

<ParamField
  path="message"
  type="string"
>
  Error message describing the specific validation failure.
</ParamField>

<ParamField
  path="prompt"
  type="string"
>
  The original prompt sent to the LLM.
</ParamField>

<ParamField
  path="raw_output"
  type="string"
>
  The raw output from the LLM that failed validation.
</ParamField>

## Type Guards

The error can be identified using TypeScript's `instanceof` operator:

<CodeBlocks>
```typescript Type Check
if (error instanceof BamlValidationError) {
  // Handle validation error
}
```
</CodeBlocks>

## Related Errors

- [BamlClientFinishReasonError](/ref/baml_client/errors/baml-client-finish-reason-error)
- [BamlClientError](/ref/baml_client/errors/baml-client-finish-reason-error)

---
title: BAML Error Types
description: Technical reference for BAML error handling classes
---

BAML provides a set of error classes for handling different error scenarios when working with LLMs. Each error type is designed to handle specific failure cases in the BAML runtime.

## Error Class Hierarchy

All BAML errors extend the base JavaScript `Error` class and include a literal `type` field for type identification.

<CodeBlocks>
```typescript Type Hierarchy
// Base JavaScript Error class
class Error {
  message: string
  name: string
  stack?: string
}

// BAML-specific error classes
class BamlValidationError extends Error {
  type: 'BamlValidationError'
  message: string
  prompt: string
  raw_output: string
}

class BamlClientFinishReasonError extends Error {
  type: 'BamlClientFinishReasonError'
  message: string
  prompt: string
  raw_output: string
}
```
</CodeBlocks>

## Error Types

### [BamlValidationError](./baml-validation-error)
Thrown when BAML fails to parse or validate LLM output. Contains the original prompt and raw output for debugging.

### [BamlClientFinishReasonError](./baml-client-finish-reason-error)
Thrown when an LLM terminates with a disallowed finish reason. Includes the original prompt and partial output received before termination.

## Type Guards

All BAML errors can be identified using TypeScript's `instanceof` operator:

<CodeBlocks>
```typescript Type Checking
try {
  // BAML operation
} catch (error) {
  if (error instanceof BamlValidationError) {
    // Handle validation error
  } else if (error instanceof BamlClientFinishReasonError) {
    // Handle finish reason error
  }
}
```
</CodeBlocks>

## Common Properties

All BAML error classes include:

<ParamField
  path="type"
  type="string"
>
  Literal type identifier specific to each error class.
</ParamField>

<ParamField
  path="message"
  type="string"
>
  Human-readable error message describing the failure.
</ParamField>

For detailed information about each error type, refer to their individual reference pages.

react-nextjs
---
title: Hook Data Type Reference
description: Technical reference for the BAML React hook data type
---

The `HookData` type represents the non-null data from a BAML React hook. This type is useful when you know the data exists and want to avoid undefined checks.

<CodeBlocks>
```typescript title="Example Usage"
function Component() {
  const hook = useTestAws({
    stream: true, // optional, defaults to true
  })

  const data = hook.data;

  return (
    <div>
      {data} {/* No need for null checks */}
    </div>
  )
}
```

```typescript title="Example Types"
// Streaming configuration
const streamingData: HookData<'TestAws', { stream: true }> = "Streaming response..."

// Non-streaming configuration
const nonStreamingData: HookData<'TestAws', { stream: false }> = "Final response"
```

```typescript title="Type Definition"
type HookData<FunctionName extends FunctionNames, Options extends { stream?: boolean } = { stream?: true }> = NonNullable<HookOutput<FunctionName, Options>['data']>
```
</CodeBlocks>

## Type Parameters

<ParamField
  path="FunctionName"
  type="generic"
>
  The name of the BAML function being called. Used to infer input and output types.
</ParamField>

<ParamField
  path="Options"
  type="{ stream?: boolean }"
>
  Configuration object that determines streaming behavior. Defaults to `{ stream?: true }`.
</ParamField>

## Type Details

<ParamField
  path="type"
  type="NonNullable<HookOutput<FunctionName, Options>['data']>"
>
  A utility type that removes undefined from the data property of HookOutput. This means the type will be either FinalDataType or StreamDataType depending on the streaming configuration.
</ParamField>

---
title: Hook Input Type Reference
description: Technical reference for the BAML React hook input type
---

The `HookInput` type defines the configuration options for BAML React hooks.

<CodeBlocks>
```typescript title="Example Usage"
function Component() {
  const hook = useTestAws({
    stream: true, // optional, defaults to true
    onStreamData: (text) => console.log("Streaming:", text),
    onFinalData: (text) => console.log("Complete:", text),
    onData: (text) => console.log("Any update:", text),
    onError: (error) => console.error("Error:", error)
  })

  return <div>{hook.data}</div>
}
```

```typescript title="Example Types"
// Streaming configuration
const streamingInput: HookInput<'TestAws', { stream: true }> = {
  stream: true,
  onStreamData: (text) => console.log("Streaming:", text),
  onFinalData: (text) => console.log("Final:", text),
  onData: (text) => console.log("Any update:", text),
  onError: (error) => console.error(error),
}

// Non-streaming configuration
const nonStreamingInput: HookInput<'TestAws', { stream: false }> = {
  stream: false,
  onFinalData: (text) => console.log("Result:", text),
  onData: (text) => console.log("Result:", text),
  onError: (error) => console.error(error)
}
```

```typescript title="Type Definition"
type HookInput<FunctionName, Options extends { stream?: boolean } = { stream?: true }> = {
  stream?: Options['stream']
  onStreamData?: Options['stream'] extends false ? never : (response?: StreamDataType<FunctionName>) => void
  onFinalData?: (response?: FinalDataType<FunctionName>) => void
  onData?: (response?: StreamDataType<FunctionName> | FinalDataType<FunctionName>) => void
  onError?: (error: BamlErrors) => void
}
```
</CodeBlocks>

## Type Parameters

<ParamField
  path="FunctionName"
  type="generic"
>
  The name of the BAML function being called. Used to infer the correct types for responses.
</ParamField>

<ParamField
  path="Options"
  type="{ stream?: boolean }"
>
  Configuration object that determines streaming behavior. Defaults to `{ stream?: true }`.
</ParamField>

## Properties

<ParamField
  path="stream"
  type="boolean | undefined"
>
  Flag to enable or disable streaming mode. When true, enables streaming responses.
</ParamField>

<ParamField
  path="onStreamData"
  type="(response?: StreamDataType<FunctionName>) => void"
>
  Callback function for streaming responses. Only available when `Options['stream']` is true.
</ParamField>

<ParamField
  path="onFinalData"
  type="(response?: FinalDataType<FunctionName>) => void"
>
  Callback function for the final response.
</ParamField>

<ParamField
  path="onData"
  type="(response?: StreamDataType<FunctionName> | FinalDataType<FunctionName>) => void"
>
  Unified callback function that receives both streaming and final responses. For non-streaming hooks, only receives final responses.
</ParamField>

<ParamField
  path="onError"
  type="(error: BamlErrors) => void"
>
  Callback function for error handling. See [Error Types](../errors/overview).
</ParamField>

---
title: Hook Output Type Reference
description: Technical reference for the BAML React hook output type
---

The `HookOutput` type defines the return type for BAML React hooks.

<CodeBlocks>
```typescript title="Example Usage"
function Component() {
  const hook = useTestAws({
    stream: true, // optional, defaults to true
  })

  return (
    <div>
      {hook.error && <div>Error: {hook.error.message}</div>}
      <button onClick={() => hook.mutate("test")} disabled={hook.isLoading}>
        Submit
      </button>
    </div>
  )
}
```

```typescript title="Example Types"
// Streaming configuration
const streamingResult: HookOutput<'TestAws', { stream: true }> = {
  data: "Any response",
  finalData: "Final response",
  streamData: "Streaming response...",
  error: undefined,
  isError: false,
  isLoading: true,
  isSuccess: false,
  isStreaming: true,
  isPending: false,
  status: 'streaming',
  mutate: async () => new ReadableStream(),
  reset: () => void
}

// Non-streaming configuration
const nonStreamingResult: HookOutput<'TestAws', { stream: false }> = {
  data: "Final response",
  finalData: "Final response",
  error: undefined,
  isError: false,
  isLoading: false,
  isSuccess: true,
  isPending: false,
  status: 'success',
  mutate: async () => "Final response",
  reset: () => void
}
```

```typescript title="Type Definition"
type HookOutput<FunctionName, Options extends { stream?: boolean } = { stream?: true }> = {
  data?: Options['stream'] extends false ? FinalDataType<FunctionName> : FinalDataType<FunctionName> | StreamDataType<FunctionName>
  finalData?: FinalDataType<FunctionName>
  streamData?: Options['stream'] extends false ? never : StreamDataType<FunctionName>
  error?: BamlErrors
  isError: boolean
  isLoading: boolean
  isPending: boolean
  isSuccess: boolean
  isStreaming: Options['stream'] extends false ? never : boolean
  status: HookStatus<Options>
  mutate: (...args: Parameters<ServerAction>) => Options['stream'] extends false
    ? Promise<FinalDataType<FunctionName>>
    : Promise<ReadableStream<Uint8Array>>
  reset: () => void
}

type HookStatus<Options extends { stream?: boolean }> = Options['stream'] extends false
  ? 'idle' | 'pending' | 'success' | 'error'
  : 'idle' | 'pending' | 'streaming' | 'success' | 'error'
```
</CodeBlocks>

## Type Parameters

<ParamField
  path="FunctionName"
  type="generic"
>
  The name of the BAML function being called. Used to infer input and output types.
</ParamField>

<ParamField
  path="Options"
  type="{ stream?: boolean }"
>
  Configuration object that determines streaming behavior. Defaults to `{ stream?: true }`.
</ParamField>

## Properties

<ParamField
  path="data"
  type="FinalDataType<FunctionName> | StreamDataType<FunctionName> | undefined"
>
  The current response data. For streaming hooks, this contains either the latest streaming response or the final response. For non-streaming hooks, this only contains the final response.
</ParamField>

<ParamField
  path="finalData"
  type="FinalDataType<FunctionName> | undefined"
>
  The final response data. Only set when the request completes successfully.
</ParamField>

<ParamField
  path="streamData"
  type="StreamDataType<FunctionName> | undefined"
>
  The latest streaming response. Only available when `Options['stream']` is true.
</ParamField>

<ParamField
  path="error"
  type="BamlErrors | undefined"
>
  Any error that occurred during the request. See [Error Types](../errors/overview).
</ParamField>

<ParamField
  path="isError"
  type="boolean"
>
  True if the request resulted in an error.
</ParamField>

<ParamField
  path="isLoading"
  type="boolean"
>
  True if the request is in progress (either pending or streaming).
</ParamField>

<ParamField
  path="isPending"
  type="boolean"
>
  True if the request is pending (not yet streaming or completed).
</ParamField>

<ParamField
  path="isSuccess"
  type="boolean"
>
  True if the request completed successfully.
</ParamField>

<ParamField
  path="isStreaming"
  type="boolean"
>
  True if the request is currently streaming data. Only available when `Options['stream']` is true.
</ParamField>

<ParamField
  path="status"
  type="HookStatus<Options>"
>
  The current status of the request. For streaming hooks: 'idle' | 'pending' | 'streaming' | 'success' | 'error'. For non-streaming hooks: 'idle' | 'pending' | 'success' | 'error'.
</ParamField>

<ParamField
  path="mutate"
  type="(...args: Parameters<ServerAction>) => Promise<OutputType>"
>
  Function to trigger the BAML action. Returns a ReadableStream for streaming hooks, or a Promise of the final response for non-streaming hooks.
</ParamField>

<ParamField
  path="reset"
  type="() => void"
>
  Function to reset the hook state back to its initial values.
</ParamField>

---
title: Generated Hooks Reference
description: Technical reference for BAML's auto-generated React hooks
---

BAML automatically generates a type-safe React hook for each BAML function. Each hook follows the naming pattern `use{FunctionName}` and supports both streaming and non-streaming modes.

<CodeBlocks>
```typescript title="Example Usage"
import { useWriteMeAStory } from "@/baml_client/react/hooks";

// Basic usage with streaming enabled by default
const hook = useWriteMeAStory();

// Access streaming and final data
const { data, streamData, finalData } = hook;

// Track request state
const { isLoading, isStreaming, isPending, isSuccess, isError } = hook;

// Execute the function
await hook.mutate("A story about a brave AI");

// Reset state if needed
hook.reset();
```

```baml title="BAML Function"
class Story {
  title string @stream.not_null
  content string @stream.not_null
}

function WriteMeAStory(input: string) -> Story {
  client openai/gpt-4
  prompt #"
    Tell me a story.

    {{ ctx.output_format() }}

    {{ _.role("user") }}

    Topic: {{input}}
  "#
}
```
</CodeBlocks>

## HookInput

The hook accepts an optional configuration object. See [Hook Input](./hook-input) for complete details.

<ParamField
  path="stream"
  type="boolean"
>
  Enable streaming mode for real-time updates. Defaults to true.
</ParamField>

<ParamField
  path="onStreamData"
  type="(response?: StreamDataType<FunctionName>) => void"
>
  Callback for streaming updates. Only available when streaming is enabled.
</ParamField>

<ParamField
  path="onFinalData"
  type="(response?: FinalDataType<FunctionName>) => void"
>
  Callback when the request completes.
</ParamField>

<ParamField
  path="onData"
  type="(response?: StreamDataType<FunctionName> | FinalDataType<FunctionName>) => void"
>
  Unified callback for both streaming and final responses.
</ParamField>

<ParamField
  path="onError"
  type="(error: BamlErrors) => void"
>
  Callback when an error occurs. See [Error Types](../errors/overview).
</ParamField>

## HookOutput

The hook returns an object with the following properties. See [Hook Output](./hook-output) for complete details.

<ParamField
  path="data"
  type="FinalDataType<FunctionName> | StreamDataType<FunctionName> | undefined"
>
  The current response data. Contains either streaming or final data depending on the request state.
</ParamField>

<ParamField
  path="finalData"
  type="FinalDataType<FunctionName> | undefined"
>
  The final response data. Only available when the request completes.
</ParamField>

<ParamField
  path="streamData"
  type="StreamDataType<FunctionName> | undefined"
>
  Latest streaming update. Only available in streaming mode.
</ParamField>

<ParamField
  path="error"
  type="BamlErrors | undefined"
>
  Error information if the request fails. See [Error Types](../errors/overview).
</ParamField>

<ParamField
  path="isLoading"
  type="boolean"
>
  True while the request is in progress (either pending or streaming).
</ParamField>

<ParamField
  path="isPending"
  type="boolean"
>
  True if the request is pending (not yet streaming or completed).
</ParamField>

<ParamField
  path="isStreaming"
  type="boolean"
>
  True if the request is currently streaming data. Only available in streaming mode.
</ParamField>

<ParamField
  path="isSuccess"
  type="boolean"
>
  True if the request completed successfully.
</ParamField>

<ParamField
  path="isError"
  type="boolean"
>
  True if the request failed.
</ParamField>

<ParamField
  path="status"
  type="HookStatus<Options>"
>
  Current state of the request. For streaming hooks: 'idle' | 'pending' | 'streaming' | 'success' | 'error'. For non-streaming hooks: 'idle' | 'pending' | 'success' | 'error'.
</ParamField>

<ParamField
  path="mutate"
  type="(...args: Parameters<ServerAction>) => Promise<OutputType>"
>
  Function to execute the BAML function. Returns a ReadableStream for streaming hooks, or a Promise of the final response for non-streaming hooks.
</ParamField>

<ParamField
  path="reset"
  type="() => void"
>
  Function to reset the hook state back to its initial values.
</ParamField>

---
title: Audio
description: Learn how to handle audio inputs in BAML functions
---

Audio values to BAML functions can be created in client libraries. This document explains how to use these functions both at compile time and runtime to handle audio data. For more details, refer to [audio types](/ref/baml/types#audio).

## Usage Examples

<CodeBlocks>
```python
from baml_py import Audio
from baml_client import b

async def test_audio_input():
    # Create an Audio object from a URL
    audio = Audio.from_url("https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg")
    res = await b.TestAudioInput(audio=audio)

    # Create an Audio object from Base64 data
    audio_b64 = "iVB0xyz..."
    audio = Audio.from_base64("audio/ogg", audio_b64)
    res = await b.TestAudioInput(audio=audio)
```

```typescript
import { b } from '../baml_client'
import { Audio } from "@boundaryml/baml"

// Create an Audio object from a URL
let res = await b.TestAudioInput(
    Audio.fromUrl('https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg')
)

// Create an Audio object from Base64 data
const audio_b64 = "iVB0xyz..."
res = await b.TestAudioInput(
    Audio.fromBase64('audio/ogg', audio_b64)
)

// Browser-specific methods
const fileAudio = await Audio.fromFile(file)
const blobAudio = await Audio.fromBlob(blob, 'audio/ogg')
const fetchedAudio = await Audio.fromUrlAsync('https://example.com/audio.ogg')
```

```tsx
import { useTestAudioInput } from '../baml_client/react/hooks'
import { Audio } from "../baml_client/react/media"

export function TestAudioInput() {
    const { mutate } = useTestAudioInput()

    const handleClick = async () => {
        const audio = await Audio.fromUrl('https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg')
        mutate(audio)
    }

    return (
      <div>
          <button onClick={handleClick}>
              Test Audio Input
          </button>
      </div>
    )
}
```

```ruby
# Ruby implementation is in development.
```
</CodeBlocks>

## Static Methods

<ParamField
  path="fromUrl"
  type="(url: string, mediaType?: string) => Audio"
>
  Creates an Audio object from a URL. Optionally specify the media type, otherwise it will be inferred from the URL.
</ParamField>

<ParamField
  path="fromBase64"
  type="(mediaType: string, base64: string) => Audio"
>
  Creates an Audio object using Base64 encoded data along with the given MIME type.
</ParamField>

<ParamField
  path="fromFile"
  type="(file: File) => Promise<Audio>"
>
  <Info>Only available in browser environments. @boundaryml/baml/browser</Info>
  Creates an Audio object from a File object. Available in browser environments only.
</ParamField>

<ParamField
  path="fromBlob"
  type="(blob: Blob, mediaType?: string) => Promise<Audio>"
>
  <Info>Only available in browser environments. @boundaryml/baml/browser</Info>
  Creates an Audio object from a Blob object. Available in browser environments only.
</ParamField>

<ParamField
  path="fromUrlToBase64"
  type="(url: string) => Promise<Audio>"
>
  <Info>Only available in browser environments.</Info>
  Creates an Audio object by fetching from a URL. Available in browser environments only.
</ParamField>

## Instance Methods

<ParamField
  path="isUrl"
  type="() => boolean"
>
  Check if the audio is stored as a URL.
</ParamField>

<ParamField
  path="asUrl"
  type="() => string"
>
  Get the URL of the audio if it's stored as a URL. Throws an Error if the audio is not stored as a URL.
</ParamField>

<ParamField
  path="asBase64"
  type="() => [string, string]"
>
  Get the base64 data and media type if the audio is stored as base64. Returns [base64Data, mediaType]. Throws an Error if the audio is not stored as base64.
</ParamField>

<ParamField
  path="toJSON"
  type="() => { url: string } | { base64: string; media_type: string }"
>
  Convert the audio to a JSON representation. Returns either a URL object or a base64 object with media type.
</ParamField>

---
title: AsyncClient / SyncClient
---

BAML generates both a sync client and an async client. They offer the exact
same public API but methods are either synchronous or asynchronous.

## BAML Functions

The generated client exposes all the functions that you've defined your BAML
files as methods. Suppose we have this file named `baml_src/literature.baml`:

```baml title="baml_src/literature.baml"
function TellMeAStory() -> string {
    client "openai/gpt-4o"
    prompt #"
      Tell me a story
    "#
}

function WriteAPoemAbout(input: string) -> string {
    client "openai/gpt-4o"
    prompt #"
      Write a poem about {{ input }}
    "#
}
```

After running `baml-cli generate` you can directly call these functions from
your code. Here's an example using the async client:

<CodeBlocks>
```python
from baml_client.async_client import b

async def example():
    # Call your BAML functions.
    story = await b.TellMeAStory()
    poem = await b.WriteAPoemAbout("Roses")
```

```typescript
import { b } from '../baml_client/async_client'

async function example() {
    // Call your BAML functions.
    const story = await b.TellMeAStory()
    const poem = await b.WriteAPoemAbout("Roses")
}
```

```ruby
# Ruby doesn't have an async client.
require 'baml_client/client'

def example
  # Call your BAML functions.
  story = b.TellMeAStory()
  poem = b.WriteAPoemAbout("Roses")
end
```
</CodeBlocks>

The sync client is exactly the same but it doesn't need an async runtime,
instead it just blocks.

<CodeBlocks>
```python
from baml_client.sync_client import b

def example():
    # Call your BAML functions.
    story = b.TellMeAStory()
    poem = b.WriteAPoemAbout("Roses")
```

```typescript
import { b } from '../baml_client/sync_client'

function example() {
    // Call your BAML functions.
    const story = b.TellMeAStory()
    const poem = b.WriteAPoemAbout("Roses")
}
```

```ruby
require 'baml_client/client'

b = Baml.Client

def example
  # Call your BAML functions.
  story = b.TellMeAStory()
  poem = b.WriteAPoemAbout("Roses")
end
```
</CodeBlocks>

## Call Patterns

The client object exposes some references to other objects that call your
functions in a different manner.

### `.stream`

The `.stream` object is used to stream the response from a function.

<CodeBlocks>
```python
from baml_client.async_client import b

async def example():
    stream = b.stream.TellMeAStory()

    async for partial in stream:
        print(partial)

    print(await stream.get_final_response())
```

```typescript
import { b } from '../baml_client/async_client'

async function example() {
    const stream = b.stream.TellMeAStory()

    for await (const partial of stream) {
        console.log(partial)
    }

    console.log(await stream.getFinalResponse())
}
```

```ruby
require 'baml_client/client'

b = Baml.Client

def example
  stream = b.stream.TellMeAStory

  stream.each do |partial|
    puts partial
  end

  puts stream.get_final_response
end
```
</CodeBlocks>

### `.request`

<Info>
  This feature was added in: v0.79.0
</Info>

The `.request` object returns the raw HTTP request but it **does not** send it.
However, the async client still returns an awaitable object because we might
need to resolve media types like images and convert them to base64 or the
required format in order to send them to the LLM.

<CodeBlocks>
```python
from baml_client.async_client import b

async def example():
    request = await b.request.TellMeAStory()
    print(request.url)
    print(request.headers)
    print(request.body.json())
```

```typescript
import { b } from '../baml_client/async_client'

async function example() {
    const request = await b.request.TellMeAStory()
    console.log(request.url)
    console.log(request.headers)
    console.log(request.body.json())
}
```

```ruby
require 'baml_client/client'

b = Baml.Client

def example
  request = b.request.TellMeAStory
  puts request.url
  puts request.headers
  puts request.body.json
end
```
</CodeBlocks>

### `.stream_request`

<Info>
  This feature was added in: v0.79.0
</Info>

Same as [`.request`](#request) but sets the streaming options to `true`.

<CodeBlocks>
```python
from baml_client.async_client import b

async def example():
    request = await b.stream_request.TellMeAStory()
    print(request.url)
    print(request.headers)
    print(request.body.json())
```

```typescript
import { b } from '../baml_client/async_client'

async function example() {
    const request = await b.stream_request.TellMeAStory()
    console.log(request.url)
    console.log(request.headers)
    console.log(request.body.json())
}
```

```ruby
require 'baml_client/client'

b = Baml.Client

def example
  request = b.stream_request.TellMeAStory
  puts request.url
  puts request.headers
  puts request.body.json
end
```
</CodeBlocks>

### `.parse`

<Info>
  This feature was added in: v0.79.0
</Info>

The `.parse` object is used to parse the response returned by the LLM after
the function call. Can be used in combination with [`.request`](#request).

<CodeBlocks>
```python
import requests
# requests is not async so for simplicity we'll use the sync client.
from baml_client.sync_client import b

def example():
    # Get the HTTP request.
    request = b.request.TellMeAStory()

    # Send the HTTP request.
    response = requests.post(request.url, headers=request.headers, json=request.body.json())

    # Parse the LLM response.
    parsed = b.parse.TellMeAStory(response.json()["choices"][0]["message"]["content"])

    # Fully parsed response.
    print(parsed)
```

```typescript
import { b } from '../baml_client/async_client'

async function example() {
    // Get the HTTP request.
    const request = await b.request.TellMeAStory()

    // Send the HTTP request.
    const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(request.body.json())
    })

    // Parse the HTTP body.
    const body = await response.json() as any

    // Parse the LLM response.
    const parsed = await b.parse.TellMeAStory(body.choices[0].message.content)

    // Fully parsed response.
    console.log(parsed)
}
```

```ruby
require 'net/http'
require 'uri'
require 'json'

require_relative 'baml_client'

b = Baml.Client

def run
  # Get the HTTP request object.
  baml_req = b.request.TellMeAStory()

  # Construct the Ruby HTTP client.
  uri = URI.parse(baml_req.url)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = uri.scheme == 'https'

  # Construct the Ruby HTTP request.
  req = Net::HTTP::Post.new(uri.path)
  req.initialize_http_header(baml_req.headers)
  req.body = baml_req.body.json.to_json

  # Send the HTTP request.
  response = http.request(req)

  # Parse the LLM response.
  parsed = b.parse.TellMeAStory(
    llm_response: JSON.parse(response.body)["choices"][0]["message"]["content"]
  )

  # Fully parsed Resume type.
  puts parsed
end
```
</CodeBlocks>

### `.parse_stream`

<Info>
  This feature was added in: v0.79.0
</Info>

Same as [`.parse`](#parse) but for streaming responses. Can be used in
combination with [`.stream_request`](#stream_request).

<CodeBlocks>
```python
from openai import AsyncOpenAI
from baml_client.async_client import b

async def example():
  client = AsyncOpenAI()

  request = await b.stream_request.TellMeAStory()
  stream = await client.chat.completions.create(**request.body.json())

  llm_response: list[str] = []
  async for chunk in stream:
    if len(chunk.choices) > 0 and chunk.choices[0].delta.content is not None:
      llm_response.append(chunk.choices[0].delta.content)
      print(b.parse_stream.TellMeAStory("".join(llm_response)))
```

```typescript
import OpenAI from 'openai'
import { b } from '../baml_client/async_client'

async function example() {
    const client = new OpenAI()

    const request = await b.stream_request.TellMeAStory()
    const stream = await client.chat.completions.create(**request.body.json())

    let llmResponse: string[] = []
    for await (const chunk of stream) {
        if (chunk.choices.length > 0 && chunk.choices[0].delta.content) {
            llmResponse.push(chunk.choices[0].delta.content)
            console.log(b.parse_stream.TellMeAStory(llmResponse.join('')))
        }
    }
}
```
</CodeBlocks>

---
title: Collector
---
<Info>
This feature was added in 0.79.0
</Info>

The `Collector` allows you to inspect the internal state of BAML function calls, including raw HTTP requests, responses, usage metrics, and timing information, so you can always see the raw data, without any abstraction layers.

## Quick Start

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector

# Create a collector with optional name
collector = Collector(name="my-collector")

# Use it with a function call
result = b.ExtractResume("...", baml_options={"collector": collector})

# Access logging information
print(collector.last.usage)  # Print usage metrics
print(collector.last.raw_llm_response)  # Print final response as string
# since there may be retries, print the last http response received
print(collector.last.calls[-1].http_response) 
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import { b } from 'baml_client'
import { Collector } from '@boundaryml/baml'

// Create a collector with optional name
const collector = new Collector("my-collector")

// Use it with a function call
const result = await b.ExtractResume("...", { collector })

// Access logging information
console.log(collector.last?.usage)  // Print usage metrics
console.log(collector.last?.rawLlmResponse)  // Print final response
// since there may be retries, print the last http response received
console.log(collector.last?.calls[-1].httpResponse)
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"
b = Baml.Client

# Create a collector with optional name
collector = Baml::Collector.new(name: "my-collector")

# Use it with a function call
res = b.ExtractResume(input: '...', baml_options: { collector: collector })

# Access logging information
print(collector.last.usage)  # Print usage metrics
print(collector.last.calls[-1].http_response)  # Print final response
print(collector.last.raw_llm_response) # a string of the last response made
```
</Tab>
</Tabs>

## Common Use Cases

### Basic Logging

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector  # Import the Collector class

def run():
    # Create a collector instance with an optional name
    collector = Collector(name="my-collector")
    # collector will be modified by the function to include all internal state
    res = b.ExtractResume("...", baml_options={"collector": collector})
    # This will print the return type of the function
    print(res)

    # This is guaranteed to be set by the function
    assert collector.last is not None

    # This will print the id of the last request
    print(collector.last.id)

    # This will print the usage of the last request
    # (This aggregates usage from all retries if there was usage emitted)
    print(collector.last.usage)

    # This will print the raw response of the last request
    print(collector.last.calls[-1].http_response)

    # This will print the raw text we used to run the parser.
    print(collector.last.raw_llm_response)
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import {b} from 'baml_client'
import {Collector} from '@boundaryml/baml'

async function run() {
    // Create a collector instance with an optional name
    const collector = new Collector("my-collector")
    // collector will be modified by the function to include all internal state
    const res = await b.ExtractResume("...", { collector })
    // This will print the return type of the function
    console.log(res)

    // This is guaranteed to be set by the function
    assert(collector.last)

    // This will print the id of the last request
    console.log(collector.last.id)

    // This will print the usage of the last request
    // (This aggregates usage from all retries if there was usage emitted)
    console.log(collector.last.usage)

    // This will print the raw response of the last request
    console.log(collector.last.calls[-1].httpResponse)

    // This will print the raw text we used to run the parser.
    console.log(collector.last.rawLlmResponse)
}
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"
b = Baml.Client

def run
    # Create a collector instance
    collector = Baml::Collector.new(name: "my-collector")
    # The function will now use the collector to track internal state
    res = b.ExtractResume(input: 'hi there', baml_options: { collector: collector })

    # This will print the return type of the function
    print(res)

    # This is guaranteed to be set by the function
    raise "Assertion failed" unless collector.last

    # This will print the id of the last request
    print(collector.last.id)

    # This will print the usage of the last request
    # (This aggregates usage from all retries if there was usage emitted)
    print(collector.last.usage)

    # This will print the raw response of the last request
    print(collector.last.calls[-1].http_response)

    # This will print the raw text we used to run the parser.
    print(collector.last.raw_llm_response)
end

# Call the function
run
```
</Tab>
</Tabs>


### Managing Collector State

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector

def run():
    collector = Collector(name="reusable-collector")
    res = b.ExtractResume("...", baml_options={"collector": collector})
    # Remove all logs and free up memory
    collector.clear()

    # Reuse the same collector
    res = b.TestOpenAIGPT4oMini("Second call", baml_options={"collector": collector})
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import {b} from 'baml_client'
import {Collector} from '@boundaryml/baml'

async function run() {
    const collector = new Collector("reusable-collector")
    const res = await b.ExtractResume("...", { collector })
    // Remove all logs and free up memory
    collector.clear()

    // Reuse the same collector
    const res2 = await b.ExtractResume("...", { collector })
}
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"
b = Baml.Client

def run
    collector = Baml::Collector.new(name: "reusable-collector")
    res = b.ExtractResume(input: 'First call', baml_options: { collector: collector })
    # Remove all logs and free up memory
    collector.clear()

    # Reuse the same collector
    res = b.ExtractResume(input: 'Second call', baml_options: { collector: collector })
end
```
</Tab>
</Tabs>

### Using Multiple Collectors

You can use multiple collectors to track different aspects of your application:

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector

def run():
    # Create separate collectors for different parts of your application
    collector_a = Collector(name="collector-a")
    collector_b = Collector(name="collector-b")
    
    # Use both collectors for the same function call
    res = b.ExtractResume("...", baml_options={"collector": [collector_a, collector_b]})
    
    # Both collectors will have the same logs
    assert collector_a.last.usage.input_tokens == collector_b.last.usage.input_tokens
    
    # Use only collector_a for another call
    res2 = b.TestOpenAIGPT4oMini("another call", baml_options={"collector": collector_a})
    
    # collector_a will have 2 logs, collector_b will still have 1
    assert len(collector_a.logs) == 2
    assert len(collector_b.logs) == 1
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import {b} from 'baml_client'
import {Collector} from '@boundaryml/baml'

async function run() {
    // Create separate collectors for different parts of your application
    const collector_a = new Collector("collector-a")
    const collector_b = new Collector("collector-b")
    
    // Use both collectors for the same function call
    const res = await b.ExtractResume("...", { collector: [collector_a, collector_b] })
    
    // Both collectors will have the same logs
    assert(collector_a.last?.usage.inputTokens === collector_b.last?.usage.inputTokens)
    
    // Use only collector_a for another call
    const res2 = await b.ExtractResume("...", { collector: collector_a })
    
    // collector_a will have 2 logs, collector_b will still have 1
    assert(collector_a.logs.length === 2)
    assert(collector_b.logs.length === 1)
}
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"
b = Baml.Client
def run
    # Create separate collectors for different parts of your application
    collector_a = Baml::Collector.new(name: "collector-a")
    collector_b = Baml::Collector.new(name: "collector-b")
    
    # Use both collectors for the same function call
    res = b.ExtractResume(input: 'hi there', baml_options: { collector: [collector_a, collector_b] })
    
    # Both collectors will have the same logs
    raise "Assertion failed" unless collector_a.last.usage.input_tokens == collector_b.last.usage.input_tokens
    
    # Use only collector_a for another call
    res2 = b.ExtractResume(input: 'another call', baml_options: { collector: collector_a })
    
    # collector_a will have 2 logs, collector_b will still have 1
    raise "Assertion failed" unless collector_a.logs.length == 2
    raise "Assertion failed" unless collector_b.logs.length == 1
end
```
</Tab>
</Tabs>

### Usage Tracking

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector

def run():
    collector_a = Collector(name="collector-a")
    res = b.ExtractResume("...", baml_options={"collector": collector_a})

    collector_b = Collector(name="collector-b")
    res = b.ExtractResume("...", baml_options={"collector": collector_b})

    # The total usage of both logs is now available
    print(collector_a.usage)
    print(collector_b.usage)
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import {b} from 'baml_client'
import {Collector} from '@boundaryml/baml'

async function run() {
    const collector_a = new Collector("collector-a")
    const res = await b.ExtractResume("...", { collector: collector_a })

    const collector_b = new Collector("collector-b")
    const res2 = await b.ExtractResume("...", { collector: collector_b })
    // The total usage of both logs is now available
    console.log(collector_a.usage)
    console.log(collector_b.usage)
}
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require_relative "baml_client/client"

def run
    collector_a = Baml::Collector.new(name: "collector-a")
    res = Baml.Client.ExtractResume(input: 'First call', baml_options: { collector: collector_a })

    collector_b = Baml::Collector.new(name: "collector-b")
    res = Baml.Client.ExtractResume(input: 'Second call', baml_options: { collector: collector_b })


    # The total usage of both logs is now available
    print(collector_a.usage)
    print(collector_b.usage)
end
```
</Tab>
</Tabs>

## API Reference

### Collector Class

The Collector class provides properties to introspect the internal state of BAML function calls.

| Property | Type | Description |
|--------|------|-------------|
| `logs` | `List[FunctionLog]` | A list of all function calls (ordered from oldest to newest) |
| `last` | `FunctionLog \| null` | The most recent function log. |
| `usage` | `Usage` | The cumulative total usage of all requests this collector has tracked. This includes all retries and fallbacks, if those did use any tokens. |


The Collector class provides the following methods:

| Method | Type | Description |
|--------|------|-------------|
| `id(id: string)` | `FunctionLog \| null` | Get the function log by id. |
| `clear()` | `void` | Clears all logs. |

### FunctionLog Class

The `FunctionLog` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | The id of the request. |
| `function_name` | `string` | The name of the function. |
| `log_type` | `"call" \| "stream"` | The manner in which the function was called. |
| `timing` | `Timing` | The timing of the request. |
| `usage` | `Usage` | The usage of the request (aggregated from all calls). |
| `calls` | `(LLMCall \| LLMStreamCall)[]` | Every call made to the LLM (including fallbacks and retries). Sorted from oldest to newest. |
| `selected_call` | `(LLMCall \| LLMStreamCall)?` | The call used by BAML for parsing the response (there may be many due to fallbacks and retries). |
| `raw_llm_response` | `string \| null` | The raw text from the best matching LLM. |
| `tags` | `Map[str, any]` | Any user provided metadata. |


### Timing Class

The `Timing` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `start_time_utc_ms` | `int` | The start time of the request in milliseconds since epoch. |
| `duration_ms` | `int \| null` | The duration of the request in milliseconds. |

#### StreamTiming Class (extends Timing)

| Property | Type | Description |
|----------|------|-------------|
| `time_to_first_token_ms` | `int \| null` | The time to first token in milliseconds. |

### Usage Class

The `Usage` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `input_tokens` | `int \| null` | The cumulative number of tokens used in the inputs. |
| `output_tokens` | `int \| null` | The cumulative number of tokens used in the outputs. |

<Info>
Note: Usage may not include all things like "thinking_tokens" or "cached_tokens". For that you may need to look at the raw HTTP response and build your own adapters.
</Info>

### LLMCall Class

The `LLMCall` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `client_name` | `str` | The name of the client used. |
| `provider` | `str` | The provider of the client used. |
| `timing` | `Timing` | The timing of the request. |
| `http_request` | `HttpRequest` | The raw HTTP request sent to the client. |
| `http_response` | `HttpResponse \| null` | The raw HTTP response from the client (null for streaming). |
| `usage` | `Usage \| null` | The usage of the request (if available). |
| `selected` | `bool` | Whether this call was selected and used for parsing. |

### LLMStreamCall Class (extends LLMCall)

The `LLMStreamCall` includes the same properties as `LLMCall` plus the following:

| Property | Type | Description |
|----------|------|-------------|  
| `timing` | `StreamTiming` | The timing of the request. |
|`chunks` | `string[]` | The chunks of the response (API coming soon). |


### HttpRequest Class

The `HttpRequest` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `url` | `str` | The URL of the request. |
| `method` | `str` | The HTTP method of the request. |
| `headers` | `object` | The request headers. |
| `body` | `HTTPBody` | The request body. |

### HttpResponse Class

The `HttpResponse` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `status` | `int` | The HTTP status code. |
| `headers` | `object` | The response headers. |
| `body` | `HTTPBody` | The response body. |

### HTTPBody Class

The `HTTPBody` class has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `text()` | `string` | The body as a string. |
| `json()` | `object` | The body as a JSON object. |

## Related Topics
- [Using with_options](/ref/baml_client/with-options) - Learn how to configure logging globally
- [TypeBuilder](/ref/baml_client/type-builder) - Build custom types for your BAML functions
- [Client Registry](/ref/baml_client/client-registry) - Manage LLM clients and their configurations

## Best Practices
1. Use a single collector instance when tracking related function calls in a chain.
2. Clear the collector when reusing it for unrelated operations.
3. Consider using multiple collectors to track different parts of your application.
4. Use function IDs when tracking specific calls in parallel operations.
5. For streaming calls, be aware that `http_response` will be null, but you can still access usage information.

---
title: config (logging / environment variables)
---

Various settings are configurable via environment variables.

| Setting | Environment Variable | Description | Default |
| ------- | -------------------- | ----------- | ------- |
| Logging Level | `BAML_LOG` | The logging level to use (`INFO`, `DEBUG`, `TRACE`, `WARN`, `ERROR`, `OFF`) | `INFO` |
| Text / JSON Mode | `BAML_LOG_JSON` | Whether to log in JSON format or human-readable format (`1`, `0`) | `0` |
| Max Log Chunk Size | `BAML_LOG_MAX_MESSAGE_LENGTH` | How large of a prompt / response will be logged (`0` for no limit) | `64000` |
| Log Color Mode | `BAML_LOG_COLOR_MODE` | Whether to color the log output (`auto`, `always`, `never`) | `auto` |

Setting can also be modified via functions in `baml_client.config`.


<Tabs>
  <Tab title="python">
  ```python
  from baml_client.config import set_from_env, set_log_level, 
                                 set_log_json_mode, set_log_max_message_length,
                                 get_log_level, reset_baml_env_vars
  ```

  ### set_log_level

  Environment variable: `BAML_LOG`

  ```python
  def set_log_level(level: "INFO" | "DEBUG" | "TRACE" | "WARN" | "ERROR" | "OFF"):
    ...
  ```
  
  ### set_log_json_mode

  Environment variable: `BAML_LOG_JSON`

  Switches the log output between JSON and human-readable format.

  ```python
  def set_log_json_mode(enable: bool):
  ```

  ### set_log_max_message_length

  `0` for unlimited

  Environment variable: `BAML_LOG_MAX_MESSAGE_LENGTH`

  ```python
  def set_log_max_message_length(length: int):
  ```

  ### get_log_level

  ```python
  def get_log_level() -> "INFO" | "DEBUG" | "TRACE" | "WARN" | "ERROR" | "OFF":
  ```

  ### reset_baml_env_vars
  <Warning>
  `reset_baml_env_vars` is deprecated and is safe to remove, since environment variables are now lazily loaded on each function call
  </Warning>

  Resets the environment variables to the values in the provided dictionary.
  Will also reset any logging related environment variables to those passed in (if set explicitly).

  ```python
  def reset_baml_env_vars(env: Dict[str, str]):
  ```
  </Tab>

  <Tab title="typescript">
  ```typescript
  import { setLogLevel, setLogJsonMode, 
           setLogMaxMessageLength, getLogLevel,
           resetBamlEnvVars } from '@/baml_client/config';
  ```

  ### setLogLevel
  Environment variable: `BAML_LOG`

  ```typescript
  setLogLevel(level: "INFO" | "DEBUG" | "TRACE" | "WARN" | "ERROR" | "OFF"): void;
  ```

  ### setLogJsonMode
  Environment variable: `BAML_LOG_JSON`

  Switches the log output between JSON and human-readable format.

  ```typescript
  setLogJsonMode(enable: boolean): void;
  ``` 

  ### setLogMaxMessageLength
  Environment variable: `BAML_LOG_MAX_MESSAGE_LENGTH`

  `0` for unlimited
  ```typescript
  setLogMaxMessageLength(length: number): void;
  ```

  ### getLogLevel

  ```typescript
  getLogLevel(): "INFO" | "DEBUG" | "TRACE" | "WARN" | "ERROR" | "OFF";
  ```

  ### resetBamlEnvVars

  Resets the environment variables to the values in the provided dictionary.
  Will also reset any logging related environment variables to those passed in (if set explicitly).

  ```typescript
  resetBamlEnvVars(env: Record<string, string | undefined>): void;
  ```  
  
  </Tab>
  <Tab title="ruby">
```ruby
# not implemented yet
# please use environment variables instead
```
  </Tab>
</Tabs>

<hr />
<Markdown src="/snippets/setting-env-vars.mdx" />

---
title: id
---

<Warning>
`id` is in proposal stage and may change. It is not yet available in any language. Please leave feedback on our discord.
</Warning>

The `id` property allows you to get a unique identifier for each function call. This is particularly useful when tracking specific calls in logs, especially when running multiple functions in parallel or when using streaming responses.

## Quick Start

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector

# Get both id and result
id, result = b.id.ExtractResume("...")

# Use id with collector
collector = Collector(name="multi-function-collector")
other_id, result = b.id.ExtractResume("...", baml_options={"collector": collector})
print(collector.id(other_id).usage)  # Get usage for specific call
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import { b } from 'baml_client'

// Get both id and result
const { id, data: result } = await b.id.ExtractResume("...")

// Use id with collector
const collector = new Collector(name="multi-function-collector")
const { id: otherId, data: result2 } = await b.id.ExtractResume("...", { collector })
console.log(collector.id(otherId)?.usage)  // Get usage for specific call
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require 'baml_client'

# Get both id and result
id, result = Baml.Client.id.ExtractResume("...")

# Use id with collector
collector = Baml::Collector.new(name: "multi-function-collector")
other_id, result = Baml.Client.id.ExtractResume("...", baml_options: { collector: collector })
print(collector.id(other_id).usage)  # Get usage for specific call
```
</Tab>
</Tabs>

## Common Use Cases

### Tracking Parallel Calls

Use `id` to track individual function calls when running multiple functions in parallel.

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import Collector
import asyncio

async def run():
    collector = Collector(name="multi-function-collector")
    
    # Run multiple functions in parallel
    resume_id, resume = b.id.ExtractResume("...", baml_options={"collector": collector})
    invoice_id, invoice = b.id.ExtractInvoice("...", baml_options={"collector": collector})
    
    # Access specific logs by id
    print(f"Resume usage: {collector.id(resume_id).usage}")
    print(f"Invoice usage: {collector.id(invoice_id).usage}")
    
    # Access all logs
    print(f"Total usage: {collector.usage}")
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import { b } from 'baml_client'
import { Collector } from "@boundaryml/baml"

const collector = new Collector(name="multi-function-collector")

// Run multiple functions in parallel
const [
    { id: resumeId, data: resume },
    { id: invoiceId, data: invoice }
] = await Promise.all([
    b.id.ExtractResume("...", { collector }),
    b.id.ExtractInvoice("...", { collector })
])

// Access specific logs by id
console.log(`Resume usage: ${collector.id(resumeId)?.usage}`)
console.log(`Invoice usage: ${collector.id(invoiceId)?.usage}`)

// Access all logs
console.log(`Total usage: ${collector.usage}`)
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require 'baml_client'
require 'async'

Async do
    collector = Baml::Collector.new(name: "multi-function-collector")
    
    # Run multiple functions in parallel
    resume_id, resume = Baml.Client.id.ExtractResume("...", baml_options: { collector: collector })
    invoice_id, invoice = Baml.Client.id.ExtractInvoice("...", baml_options: { collector: collector })
    
    # Access specific logs by id
    print("Resume usage: #{collector.id(resume_id).usage}")
    print("Invoice usage: #{collector.id(invoice_id).usage}")
    
    # Access all logs
    print("Total usage: #{collector.usage}")
end
```
</Tab>
</Tabs>

### Using with Streaming

The `id` property works seamlessly with streaming responses, allowing you to track the entire stream's usage.

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client.async_client import b

async def run():
    collector = Collector(name="multi-function-collector")
    stream_id, stream = b.id.stream.ExtractResume("...", baml_options={"collector": collector})
    
    async for chunk in stream:
        print(chunk)
    
    result = await stream.get_final_result()
    print(f"Stream usage: {collector.id(stream_id).usage}")
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import { b } from 'baml_client'
import { Collector } from "@boundaryml/baml"

const collector = new Collector(name="multi-function-collector")

const { id: streamId, data: stream } = await b.id.stream.ExtractResume("...", { collector })

for await (const chunk of stream) {
    console.log(chunk)
}

const result = await stream.getFinalResult()
console.log(`Stream usage: ${collector.id(streamId)?.usage}`)
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require 'baml_client'

collector = Baml::Collector.new(name: "multi-function-collector")
stream_id, stream = Baml.Client.id.stream.ExtractResume("...", baml_options: { collector: collector })

stream.each do |chunk|
    print(chunk)
end

result = stream.get_final_result
print("Stream usage: #{collector.id(stream_id).usage}")
```
</Tab>
</Tabs>

## API Reference

### Return Types

The `id` property returns different types depending on the language:

| Language | Return Type | Description |
|----------|-------------|-------------|
| Python | `Tuple[str, T]` | A tuple of `(id, result)` where `T` is the function's return type |
| TypeScript | `{ id: string, data: T }` | An object with `id` and `data` properties where `T` is the function's return type |
| Ruby | `[String, T]` | An array of `[id, result]` where `T` is the function's return type |

## Related Topics
- [Collector](/ref/baml_client/collector) - Track function calls and usage metrics
- [with_options](/ref/baml_client/with-options) - Configure default options for function calls

## Best Practices
1. Use `id` when you need to track specific function calls in parallel operations
2. Always use the same collector instance when tracking related function calls
3. Consider using `with_options` to set up consistent logging and ID tracking

<Info>
IDs are globally unique and can be used to track function calls across your entire application, including in logs and monitoring systems.
</Info>

---
title: Image
description: Learn how to handle image inputs in BAML functions
---

Image values to BAML functions can be created in client libraries. This document explains how to use these functions both at compile time and runtime to handle image data. For more details, refer to [image types](/ref/baml/types#image).

## Usage Examples

<CodeBlocks>
```python
from baml_py import Image
from baml_client import b

async def test_image_input():
    # Create an Image from a URL
    img = Image.from_url("https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png")
    res = await b.TestImageInput(img=img)

    # Create an Image from Base64 data
    image_b64 = "iVB0xyz..."
    img = Image.from_base64("image/png", image_b64)
    res = await b.TestImageInput(img=img)
```

```typescript
import { b } from '../baml_client'
import { Image } from "@boundaryml/baml"

// Create an Image from a URL
let res = await b.TestImageInput(
    Image.fromUrl('https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png')
)

// Create an Image from Base64 data
const image_b64 = "iVB0xyz..."
res = await b.TestImageInput(
    Image.fromBase64('image/png', image_b64)
)

// Browser-specific methods
const fileImage = await Image.fromFile(file)
const blobImage = await Image.fromBlob(blob, 'image/png')
```

```tsx
import { useTestImageInput } from '../baml_client/react/hooks'
import { Image } from "../baml_client/react/media"

export function TestImageInput() {
    const { mutate } = useTestImageInput()

    const handleClick = async () => {
        const image = await Image.fromUrl('https://upload.wikimedia.org/wikipedia/en/4/4d/Shrek_%28character%29.png')
        mutate(image)
    }

    return (
      <div>
          <button onClick={handleClick}>
              Test Image Input
          </button>
      </div>
    )
}
```

```ruby
# Ruby implementation is in development.
```
</CodeBlocks>

## Static Methods

<ParamField
  path="fromUrl"
  type="(url: string, mediaType?: string) => Image"
>
  Creates an Image object from a URL. Optionally specify the media type, otherwise it will be inferred from the URL.
</ParamField>

<ParamField
  path="fromBase64"
  type="(mediaType: string, base64: string) => Image"
>
  Creates an Image object using Base64 encoded data along with the given MIME type.
</ParamField>

<ParamField
  path="fromFile"
  type="(file: File) => Promise<Image>"
>
  <Info>Only available in browser environments. @boundaryml/baml/browser</Info>
  Creates an Image object from a File object. Available in browser environments only.
</ParamField>

<ParamField
  path="fromBlob"
  type="(blob: Blob, mediaType?: string) => Promise<Image>"
>
  <Info>Only available in browser environments. @boundaryml/baml/browser</Info>
  Creates an Image object from a Blob object. Available in browser environments only.
</ParamField>

<ParamField
  path="fromUrlToBase64"
  type="(url: string) => Promise<Image>"
>
  <Info>Only available in browser environments. </Info>
  Creates an Image object by fetching from a URL. Available in browser environments only.
</ParamField>

## Instance Methods

<ParamField
  path="isUrl"
  type="() => boolean"
>
  Check if the image is stored as a URL.
</ParamField>

<ParamField
  path="asUrl"
  type="() => string"
>
  Get the URL of the image if it's stored as a URL. Throws an Error if the image is not stored as a URL.
</ParamField>

<ParamField
  path="asBase64"
  type="() => [string, string]"
>
  Get the base64 data and media type if the image is stored as base64. Returns [base64Data, mediaType]. Throws an Error if the image is not stored as base64.
</ParamField>

<ParamField
  path="toJSON"
  type="() => { url: string } | { base64: string; media_type: string }"
>
  Convert the image to a JSON representation. Returns either a URL object or a base64 object with media type.
</ParamField>

---
title: Image / Audio
description: Learn how to handle image and audio inputs in BAML functions
---

BAML functions can accept both image and audio inputs for multimedia processing capabilities. Choose the appropriate type based on your needs:

<Cards>
  <Card
    title="Image"
    icon="image"
    href="./image"
  >
    Create Image objects from URLs, base64 data, or browser-specific sources like File and Blob objects.
  </Card>

  <Card
    title="Audio"
    icon="volume-high"
    href="./audio"
  >
   Create Audio objects from URLs, base64 data, or browser-specific sources like File and Blob objects.
  </Card>
</Cards>

---
title: Client Features Proposal
---

# BAML Client Features Proposal

This document outlines proposed enhancements to the BAML client library that aim to improve observability, debugging, and configuration management. These features are currently in the proposal stage and may evolve based on community feedback.

## Overview

We're proposing three major features to enhance the BAML client experience:

1. **Function IDs** - Unique identifiers for tracking individual function calls
2. **Enhanced Logging** - Comprehensive logging system for debugging and monitoring
3. **Client Configuration** - Flexible configuration management through `with_options`

## Motivation

### Current Challenges

1. **Limited Observability**: Currently, tracking individual function calls, especially in parallel operations or streaming scenarios, is difficult.
2. **Debugging Complexity**: Without detailed logs of LLM interactions, debugging issues is time-consuming.
3. **Configuration Management**: Setting up consistent configurations across multiple function calls requires boilerplate code.

### Goals

1. **Improved Traceability**: Enable tracking of individual function calls through unique IDs
2. **Better Debugging**: Provide comprehensive logging of all LLM interactions
3. **Simplified Configuration**: Allow setting default options that apply across multiple calls
4. **Performance Monitoring**: Track usage metrics and timing information

## Proposed Features

### 1. Function IDs (`id`)

Function IDs provide a way to uniquely identify and track individual function calls:

- Unique identifier for each function call
- Works with both regular and streaming calls
- Integrates with logging system
- Essential for parallel operations

### 2. Enhanced Logging (`logger`)

A comprehensive logging system that captures:

- Raw requests and responses
- Usage metrics (tokens, costs)
- Timing information
- Streaming chunks
- Fallback and retry attempts

### 3. Client Configuration (`with_options`)

A flexible configuration system that allows:

- Setting default options for multiple calls
- Managing client registries
- Configuring logging
- Setting up type builders
- Per-call option overrides

## Implementation Status

These features are currently in proposal stage and not yet available in any language. We're seeking community feedback on:

1. API design and ergonomics
2. Additional features or requirements
3. Language-specific considerations
4. Performance implications

## Next Steps

1. Gather community feedback
2. Finalize API design
3. Implement in supported languages
4. Create comprehensive documentation
5. Release beta version for testing

## Related Topics

- [Client Registry](./client-registry)
- [TypeBuilder](./typebuilder)

## Feedback

Please join our Discord to provide feedback on these proposed features. Your input will help shape the final implementation.

<Info>
These features are designed to work together seamlessly while remaining optional. You can adopt them incrementally as needed.
</Info> 

---
title: TypeBuilder
---


`TypeBuilder` is used to create or modify output schemas at runtime. It's particularly useful when you have dynamic output structures that can't be determined at compile time - like categories from a database or user-provided schemas.

Here's a simple example of using TypeBuilder to add new enum values before calling a BAML function:

**BAML Code**
```baml {4}
enum Category {
  RED
  BLUE
  @@dynamic  // Makes this enum modifiable at runtime
}

function Categorize(text: string) -> Category {
  prompt #"
    Categorize this text:
    {{ text }}

    {{ ctx.output_format }}
  "#
}
```

**Runtime Usage**
<CodeBlocks>
```python Python
from baml_client.type_builder import TypeBuilder
from baml_client import b

# Create a TypeBuilder instance
tb = TypeBuilder()

# Add new values to the Category enum
tb.Category.add_value('GREEN')
tb.Category.add_value('YELLOW')

# Pass the typebuilder when calling the function
result = b.Categorize("The sun is bright", {"tb": tb})
# result can now be RED, BLUE, GREEN, or YELLOW
```
```typescript TypeScript
import { TypeBuilder } from '../baml_client/type_builder'
import { b } from '../baml_client'

// Create a TypeBuilder instance
const tb = new TypeBuilder()

// Add new values to the Category enum
tb.Category.addValue('GREEN')
tb.Category.addValue('YELLOW')

// Pass the typebuilder when calling the function
const result = await b.Categorize("The sun is bright", { tb })
// result can now be RED, BLUE, GREEN, or YELLOW
```
```ruby Ruby
require_relative 'baml_client/client'

# Create a TypeBuilder instance
tb = Baml::TypeBuilder.new

# Add new values to the Category enum
tb.Category.add_value('GREEN')
tb.Category.add_value('YELLOW')

# Pass the typebuilder when calling the function
result = Baml::Client.categorize(text: "The sun is bright", baml_options: { tb: tb })
# result can now be RED, BLUE, GREEN, or YELLOW
```
</CodeBlocks>

## Dynamic Types

There are two ways to use TypeBuilder:
1. Modifying existing BAML types marked with `@@dynamic`
2. Creating entirely new types at runtime

### Modifying Existing Types

To modify an existing BAML type, mark it with `@@dynamic`:

<ParamField path="Classes" type="example">
```baml
class User {
  name string
  age int
  @@dynamic  // Allow adding more properties
}
```

**Runtime Usage**
<CodeBlocks>
```python Python
tb = TypeBuilder()
tb.User.add_property('email', tb.string())
tb.User.add_property('address', tb.string())
```
```typescript TypeScript
const tb = new TypeBuilder()
tb.User.addProperty('email', tb.string())
tb.User.addProperty('address', tb.string())
```
```ruby Ruby
tb = Baml::TypeBuilder.new
tb.User.add_property('email', tb.string)
tb.User.add_property('address', tb.string)
```
</CodeBlocks>
</ParamField>

<ParamField path="Enums" type="example">
```baml
enum Category {
  VALUE1
  VALUE2
  @@dynamic  // Allow adding more values
}
```

**Runtime Usage**
<CodeBlocks>
```python Python
tb = TypeBuilder()
tb.Category.add_value('VALUE3')
tb.Category.add_value('VALUE4')
```
```typescript TypeScript
const tb = new TypeBuilder()
tb.Category.addValue('VALUE3')
tb.Category.addValue('VALUE4')
```
```ruby Ruby
tb = Baml::TypeBuilder.new
tb.Category.add_value('VALUE3')
tb.Category.add_value('VALUE4')
```
</CodeBlocks>
</ParamField>

### Creating New Types

You can also create entirely new types at runtime:

<CodeBlocks>
```python Python
tb = TypeBuilder()

# Create a new enum
hobbies = tb.add_enum("Hobbies")
hobbies.add_value("Soccer")
hobbies.add_value("Reading")

# Create a new class
address = tb.add_class("Address")
address.add_property("street", tb.string())
address.add_property("city", tb.string())

# Attach new types to existing BAML type
tb.User.add_property("hobbies", hobbies.type().list())
tb.User.add_property("address", address.type())
```
```typescript TypeScript
const tb = new TypeBuilder()

// Create a new enum
const hobbies = tb.addEnum("Hobbies")
hobbies.addValue("Soccer")
hobbies.addValue("Reading")

// Create a new class
const address = tb.addClass("Address")
address.addProperty("street", tb.string())
address.addProperty("city", tb.string())

// Attach new types to existing BAML type
tb.User.addProperty("hobbies", hobbies.type().list())
tb.User.addProperty("address", address.type())
```
```ruby Ruby
tb = Baml::TypeBuilder.new

# Create a new enum
hobbies = tb.add_enum("Hobbies")
hobbies.add_value("Soccer")
hobbies.add_value("Reading")

# Create a new class
address = tb.add_class("Address")
address.add_property("street", tb.string)
address.add_property("city", tb.string)

# Attach new types to existing BAML type
tb.User.add_property("hobbies", hobbies.type.list)
tb.User.add_property("address", address.type)
```
</CodeBlocks>

## Type Builders

TypeBuilder provides methods for building different kinds of types:

| Method | Returns | Description | Example |
|--------|---------|-------------|---------|
| `string()` | `FieldType` | Creates a string type | `tb.string()` |
| `int()` | `FieldType` | Creates an integer type | `tb.int()` |
| `float()` | `FieldType` | Creates a float type | `tb.float()` |
| `bool()` | `FieldType` | Creates a boolean type | `tb.bool()` |
| `literal_string(value: string)` | `FieldType` | Creates a literal string type | `tb.literal_string("hello")` |
| `literal_int(value: int)` | `FieldType` | Creates a literal integer type | `tb.literal_int(123)` |
| `literal_bool(value: boolean)` | `FieldType` | Creates a literal boolean type | `tb.literal_bool(true)` |
| `list(type: FieldType)` | `FieldType` | Makes a type into a list | `tb.list(tb.string())` |
| `union(types: FieldType[])` | `FieldType` | Creates a union of types | `tb.union([tb.string(), tb.int()])` |
| `map(key: FieldType, value: FieldType)` | `FieldType` | Creates a map type | `tb.map(tb.string(), tb.int())` |
| `add_class(name: string)` | `ClassBuilder` | Creates a new class | `tb.add_class("User")` |
| `add_enum(name: string)` | `EnumBuilder` | Creates a new enum | `tb.add_enum("Category")` |
| `MyClass` | `FieldType` | Reference an existing BAML class | `tb.MyClass.type()` |


In addition to the methods above, all types marked with `@@dynamic` will also appear in the TypeBuilder.

```baml {4}
class User {
  name string
  age int
  @@dynamic  // Allow adding more properties
}
```

```python {2}
tb = TypeBuilder()
tb.User.add_property("email", tb.string())
```

### FieldType

`FieldType` is a type that represents a field in a type. It can be used to add descriptions, constraints, and other metadata to a field.

| Method | Returns | Description | Example |
|--------|---------|-------------|---------|
| `list()` | `FieldType` | Makes a type into a list | `tb.string().list()` |
| `optional()` | `FieldType` | Makes a type optional | `tb.string().optional()` |

### ClassBuilder

`ClassBuilder` is a type that represents a class in a type. It can be used to add properties to a class.

| Method | Returns | Description | Example |
|--------|---------|-------------|---------|
| `add_property(name: string, type: FieldType)` | `ClassPropertyBuilder` | Adds a property to the class | `my_cls.add_property("email", tb.string())` |
| `description(description: string)` | `ClassBuilder` | Adds a description to the class | `my_cls.description("A user class")` |
| `type()` | `FieldType` | Returns the type of the class | `my_cls.type()` |

### ClassPropertyBuilder

`ClassPropertyBuilder` is a type that represents a property in a class. It can be used to add descriptions, constraints, and other metadata to a property.


| Method | Returns | Description | Example |
|--------|---------|-------------|---------|
| `description(description: string)` | `ClassPropertyBuilder` | Adds a description to the property | `my_prop.description("An email address")` |
| `alias(alias: string)` | `ClassPropertyBuilder` | Adds the alias attribute to the property | `my_prop.alias("email_address")` |

### EnumBuilder

`EnumBuilder` is a type that represents an enum in a type. It can be used to add values to an enum.

| Method | Returns | Description | Example |
|--------|---------|-------------|---------|
| `add_value(value: string)` | `EnumValueBuilder` | Adds a value to the enum | `my_enum.add_value("VALUE1")` |
| `description(description: string)` | `EnumBuilder` | Adds a description to the enum value | `my_enum.description("A value in the enum")` |
| `type()` | `FieldType` | Returns the type of the enum | `my_enum.type()` |

### EnumValueBuilder

`EnumValueBuilder` is a type that represents a value in an enum. It can be used to add descriptions, constraints, and other metadata to a value.

| Method | Returns | Description | Example |
|--------|---------|-------------|---------|
| `description(description: string)` | `EnumValueBuilder` | Adds a description to the enum value | `my_value.description("A value in the enum")` |
| `alias(alias: string)` | `EnumValueBuilder` | Adds the alias attribute to the enum value | `my_value.alias("VALUE1")` |
| `skip()` | `EnumValueBuilder` | Adds the skip attribute to the enum value | `my_value.skip()` |


## Adding Descriptions

You can add descriptions to properties and enum values to help guide the LLM:

<CodeBlocks>
```python Python
tb = TypeBuilder()

# Add description to a property
tb.User.add_property("email", tb.string()) \
   .description("User's primary email address")

# Add description to an enum value
tb.Category.add_value("URGENT") \
   .description("Needs immediate attention")
```
```typescript TypeScript
const tb = new TypeBuilder()

// Add description to a property
tb.User.addProperty("email", tb.string())
   .description("User's primary email address")

// Add description to an enum value
tb.Category.addValue("URGENT")
   .description("Needs immediate attention")
```
```ruby Ruby
tb = Baml::TypeBuilder.new

# Add description to a property
tb.User.add_property("email", tb.string)
   .description("User's primary email address")

# Add description to an enum value
tb.Category.add_value("URGENT")
   .description("Needs immediate attention")
```
</CodeBlocks>

## Creating/modyfing dynamic types with the `add_baml` method

The `TypeBuilder` has a higher level API for creating dynamic types at runtime.
Here's an example:

<CodeBlocks>

```python Python
tb = TypeBuilder()
tb.add_baml("""
  // Creates a new class Address that does not exist in the BAML source.
  class Address {
    street string
    city string
    state string
  }

  // Modifies the existing @@dynamic User class to add the new address property.
  dynamic class User {
    address Address
  }

  // Modifies the existing @@dynamic Category enum to add a new variant.
  dynmic enum Category {
    PURPLE
  }
""")
```

```typescript TypeScript
const tb = new TypeBuilder()
tb.addBaml(`
  // Creates a new class Address that does not exist in the BAML source.
  class Address {
    street string
    city string
    state string
  }

  // Modifies the existing @@dynamic User class to add the new address property.
  dynamic class User {
    address Address
  }

  // Modifies the existing @@dynamic Category enum to add a new variant.
  dynmic enum Category {
    PURPLE
  }
`)
```

```ruby Ruby
tb = Baml::TypeBuilder.new
tb.add_baml("
  // Creates a new class Address that does not exist in the BAML source.
  class Address {
    street string
    city string
    state string
  }

  // Modifies the existing @@dynamic User class to add the new address property.
  dynamic class User {
    address Address
  }

  // Modifies the existing @@dynamic Category enum to add a new variant.
  dynmic enum Category {
    PURPLE
  }
")
```

</CodeBlocks>

## Common Patterns

Here are some common patterns when using TypeBuilder:

1. **Dynamic Categories**: When categories come from a database or external source
<CodeBlocks>
```python Python
categories = fetch_categories_from_db()
tb = TypeBuilder()
for category in categories:
    tb.Category.add_value(category)
```
```typescript TypeScript
const categories = await fetchCategoriesFromDb()
const tb = new TypeBuilder()
categories.forEach(category => {
    tb.Category.addValue(category)
})
```
```ruby Ruby
categories = fetch_categories_from_db
tb = Baml::TypeBuilder.new
categories.each do |category|
    tb.Category.add_value(category)
end
```
</CodeBlocks>

2. **Form Fields**: When extracting dynamic form fields
<CodeBlocks>
```python Python
fields = get_form_fields()
tb = TypeBuilder()
form = tb.add_class("Form")
for field in fields:
    form.add_property(field.name, tb.string())
```
```typescript TypeScript
const fields = getFormFields()
const tb = new TypeBuilder()
const form = tb.addClass("Form")
fields.forEach(field => {
    form.addProperty(field.name, tb.string())
})
```
```ruby Ruby
fields = get_form_fields
tb = Baml::TypeBuilder.new
form = tb.add_class("Form")
fields.each do |field|
    form.add_property(field.name, tb.string)
end
```
</CodeBlocks>

3. **Optional Properties**: When some fields might not be present
<CodeBlocks>
```python Python
tb = TypeBuilder()
tb.User.add_property("middle_name", tb.string().optional())
```
```typescript TypeScript
const tb = new TypeBuilder()
tb.User.addProperty("middle_name", tb.string().optional())
```
```ruby Ruby
tb = Baml::TypeBuilder.new
tb.User.add_property("middle_name", tb.string.optional)
```
</CodeBlocks>

<Warning>
All types added through TypeBuilder must be connected to the return type of your BAML function. Standalone types that aren't referenced won't affect the output schema.
</Warning>

## Testing Dynamic Types

See the [advanced dynamic types tests guide](/guide/baml-advanced/dynamic-runtime-types#testing-dynamic-types-in-baml)
for examples of testing functions that use dynamic types. See also the
[reference](/ref/baml/test) for syntax.

## Future Features

We're working on additional features for TypeBuilder:

- JSON Schema support (awaiting use cases)
- OpenAPI schema integration
- Pydantic model support

If you're interested in these features, please join the discussion in our GitHub
issues.

---
title: with_options
---

<Info>
Added in 0.79.0
</Info>

The `with_options` function creates a new client with default configuration options for logging, client registry, and type builders. These options are automatically applied to all function calls made through this client, but can be overridden on a per-call basis when needed.

## Quick Start

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import ClientRegistry, Collector

# Set up default options for this client
collector = Collector(name="my-collector")
client_registry = ClientRegistry()
client_registry.set_primary("openai/gpt-4o-mini")
env = {"BAML_LOG": "DEBUG", "OPENAI_API_KEY": "key-123"}

# Create client with default options
my_b = b.with_options(collector=collector, client_registry=client_registry, env=env)

# Uses the default options
result = my_b.ExtractResume("...")

# Override options for a specific call
other_collector = Collector(name="other-collector")
result2 = my_b.ExtractResume("...", baml_options={"collector": other_collector})
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import { b } from "baml_client"
import { Collector, ClientRegistry } from "@boundaryml/baml"

// Set up default options for this client
const collector = new Collector("my-collector")
const clientRegistry = new ClientRegistry()
clientRegistry.setPrimary("openai/gpt-4o-mini")
const env = {"BAML_LOG": "DEBUG", "OPENAI_API_KEY": "key-123"}

// Create client with default options
const myB = b.withOptions({ collector, clientRegistry, env })

// Uses the default options
const result = await myB.ExtractResume("...")

// Override options for a specific call
const otherCollector = new Collector("other-collector")
const result2 = await myB.ExtractResume("...", { collector: otherCollector })
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require 'baml_client'

# Set up default options for this client
collector = Baml::Collector.new(name: "my-collector")
client_registry = Baml::ClientRegistry.new
client_registry.set_primary("openai/gpt-4o-mini")
env = {"BAML_LOG": "DEBUG", "OPENAI_API_KEY": "key-123"}

# Create client with default options
my_b = Baml.Client.with_options(collector: collector, client_registry: client_registry, env: env)

# Uses the default options
result = my_b.ExtractResume(input: "...")

# Override options for a specific call
other_collector = Baml::Collector.new(name: "other-collector")
result2 = my_b.ExtractResume(input: "...", baml_options: { collector: other_collector })
```
</Tab>
</Tabs>

## Common Use Cases

### Basic Configuration

Use `with_options` to create a client with default settings that will be applied to all function calls made through this client. These defaults can be overridden when needed.

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client import b
from baml_py import ClientRegistry, Collector

def run():
    # Configure options
    collector = Collector(name="my-collector")
    client_registry = ClientRegistry()
    client_registry.set_primary("openai/gpt-4o-mini")

    # Create configured client
    my_b = b.with_options(collector=collector, client_registry=client_registry)

    # All calls will use the configured options
    res = my_b.ExtractResume("...")
    invoice = my_b.ExtractInvoice("...")

    # Access configuration
    print(my_b.client_registry)
    # Access logs from the collector
    print(collector.logs)
    print(collector.last)
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import { b } from "baml_client"
import { Collector, ClientRegistry } from "@boundaryml/baml"

const collector = new Collector("my-collector")
const clientRegistry = new ClientRegistry()
clientRegistry.setPrimary("openai/gpt-4o-mini")

const myB = b.withOptions({ collector, clientRegistry })

// All calls will use the configured options
const res = await myB.ExtractResume("...")
const invoice = await myB.ExtractInvoice("...")

// Access configuration
console.log(myB.clientRegistry)
console.log(collector.logs)
console.log(collector.last?.usage)
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require 'baml_client'

collector = Baml::Collector.new(name: "my-collector")
client_registry = Baml::ClientRegistry.new
client_registry.set_primary("openai/gpt-4o-mini")

my_b = Baml.Client.with_options(collector: collector, client_registry: client_registry)

# All calls will use the configured options
res = my_b.ExtractResume(input: "...")
invoice = my_b.ExtractInvoice(input: "...")

# Access configuration
print(my_b.client_registry)
print(collector.logs)
print(collector.last.usage)
```
</Tab>
</Tabs>

### Parallel Execution

When running functions in parallel, `with_options` helps maintain consistent configuration across all calls. This works seamlessly with the [`Collector`](./collector) functionality.

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client.async_client import b
from baml_py import ClientRegistry, Collector
import asyncio

async def run():
    collector = Collector(name="my-collector")
    my_b = b.with_options(collector=collector, client_registry=client_registry)

    # Run multiple functions in parallel
    res, invoice = await asyncio.gather(
        my_b.ExtractResume("..."),
        my_b.ExtractInvoice("...")
    )

    # Access results and logs
    print(res)
    print(invoice)
    print(collector.id(res.id).usage)
    print(collector.id(invoice.id).usage)
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import { Collector, ClientRegistry } from "@boundaryml/baml"

const collector = new Collector("my-collector")
const myB = b.withOptions({ collector, clientRegistry })

// Run multiple functions in parallel
const [
    {data: res, id: resumeId},
    {data: invoice, id: invoiceId}
] = await Promise.all([
    myB.raw.ExtractResume("..."),
    myB.raw.ExtractInvoice("...")
])

// Access results and logs
console.log(res)
console.log(invoice)
console.log(collector.id(resumeId)?.usage)
console.log(collector.id(invoiceId)?.usage)
```
</Tab>

<Tab title="Ruby" language="ruby">
BAML Ruby (beta) does not currently support async/concurrent calls. Reach out to us if it's something you need!
</Tab>
</Tabs>

### Streaming Mode

`with_options` can be used with streaming functions while maintaining all configured options.

<Tabs>
<Tab title="Python" language="python">
```python
from baml_client.async_client import b
from baml_py import Collector

async def run():
    collector = Collector(name="my-collector")
    my_b = b.with_options(collector=collector, client_registry=client_registry)

    stream = my_b.stream.ExtractResume("...")
    async for chunk in stream:
        print(chunk)
    
    result = await stream.get_final_result()
    print(collector.id(stream.id).usage)
```
</Tab>

<Tab title="TypeScript" language="typescript">
```typescript
import { Collector } from "@boundaryml/baml"

const collector = new Collector("my-collector")
const myB = b.withOptions({ collector, clientRegistry })

const stream = myB.stream.ExtractResume("...")
for await (const chunk of stream) {
    console.log(chunk)
}

const result = await stream.getFinalResult()
console.log(collector.id(stream.id)?.usage)
```
</Tab>

<Tab title="Ruby" language="ruby">
```ruby
require 'baml_client'

collector = Baml::Collector.new(name: "my-collector")
my_b = Baml.Client.with_options(collector: collector, client_registry: client_registry)

stream = my_b.stream.ExtractResume(input: "...")
stream.each do |chunk|
    print(chunk)
end

result = stream.get_final_result
print(collector.id(stream.id).usage)
```
</Tab>
</Tabs>

## API Reference

### with_options Parameters

<Note>
These can always be overridden on a per-call basis with the `baml_options` parameter in any function call.
</Note>

| Parameter | Type | Description |
|-----------|------|-------------|
| `collector` | [`Collector`](/ref/baml_client/collector) | Collector instance for tracking function calls and usage metrics |
| `client_registry` | `ClientRegistry` | Registry for managing LLM clients and their configurations |
| `type_builder` | [`TypeBuilder`](/ref/baml_client/type-builder) | Custom type builder for function inputs and outputs |
| `env` | `Dict/Object` | Environment variables to set for the client |

### Configured Client Properties

<Info>
The configured client maintains the same interface as the base `baml_client`, so you can use all the same functions and methods.
</Info>


## Related Topics
- [Collector](/ref/baml_client/collector) - Track function calls and usage metrics
- [TypeBuilder](/ref/baml_client/type-builder) - Build custom types for your functions
- [Client Registry](/ref/baml_client/client-registry) - Manage LLM clients and their configurations
- [Environment Variables](/ref/baml/general-baml-syntax/environment-variables) - Set environment variables

<Info>
The configured client maintains the same interface as the base client, so you can use all the same functions and methods.
</Info>


The `dev` command starts a development server that watches your BAML source
files for changes and automatically reloads the BAML runtime. This feature is
designed to streamline the development process by providing real-time updates as
you modify your BAML configurations.

## Usage

```
baml-cli dev [OPTIONS]
```

## Details

See the [serve](./serve) command for more information on the arguments.

The dev command performs the exact same functionality, but it additionally:

1. Watches the BAML source files for changes.
2. Automatically reloads the server when changes are detected.
3. Automatically runs any generators when changes are detected.

The `fmt` command will format your BAML files.

<Warning>
  **Warning: Beta Feature**
  
  This feature is still in-progress, and does not yet support all BAML syntax.
</Warning>

## Usage

```
baml-cli fmt [OPTIONS] [file.baml] [file2.baml] [file3.baml] ...
```

## Details

To disable the formatter in a file, you can add

```baml
// baml-format: ignore
```

anywhere in the file.

Formatting is done in-place and non-configurable.

The `generate` command is used to generate BAML clients based on your BAML source files. It processes the BAML configurations and creates the necessary client code for your specified output type.

## Usage

```
baml-cli generate [OPTIONS]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--from <PATH>` | Path to the `baml_src` directory | `./baml_src` |
| `--no-version-check` | Generate `baml_client` without checking for version mismatch | `false` |

## Description

The `generate` command performs the following actions:

1. Finds all generators in the BAML project (usualy in `generators.baml`).
2. Ensure all generators match the CLI version.
3. Generate each `baml_client` based on the generator configurations.

## Examples

1. Generate clients using default settings:
   ```
   baml-cli generate
   ```

2. Generate clients from a specific directory:
   ```
   baml-cli generate --from /path/to/my/baml_src
   ```

3. Generate clients without version check:
   ```
   baml-cli generate --no-version-check
   ```

## Output

The command provides informative output about the generation process:

- If no clients were generated, it will suggest a configuration to add to your BAML files.
- If clients were generated, it will report the number of clients generated and their locations.


## Notes

- If no generator configurations are found in the BAML files, the command will generate a default client based on the CLI defaults and provide instructions on how to add a generator configuration to your BAML files.
- If generator configurations are found, the command will generate clients according to those configurations.
- If one of the generators fails, the command will stop at that point and report the error.


The `init` command is used to initialize a project with BAML. It sets up the necessary directory structure and configuration files to get you started with BAML.

## Usage

```
baml-cli init [OPTIONS]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--dest <PATH>` | Specifies where to initialize the BAML project | Current directory (`.`) |
| `--client-type <TYPE>` | Type of BAML client to generate | Guesses based on where the CLI was installed from (`python/pydantic` for pip, `typescript` for npm, etc.) |
| `--openapi-client-type <TYPE>` | The OpenAPI client generator to run, if `--client-type=openapi` | None |

## Description

The `init` command performs the following actions:

1. Creates a new BAML project structure in `${DEST}/baml_src`.
2. Creates a `generators.baml` file in the `baml_src` directory with initial configuration.
3. Includes some additional examples files in `baml_src` to get you started.

## Client Types

The `--client-type` option allows you to specify the type of BAML client to generate. Available options include:

- `python/pydantic`: For Python clients using Pydantic
- `typescript`: For TypeScript clients
- `ruby/sorbet`: For Ruby clients using Sorbet
- `rest/openapi`: For REST clients using OpenAPI

If not specified, it uses the default from the runtime CLI configuration.

## OpenAPI Client Types

When using `--client-type=rest/openai`, you can specify the OpenAPI client generator using the `--openapi-client-type` option. Some examples include:

- `go`
- `java`
- `php`
- `ruby`
- `rust`
- `csharp`

For a full list of supported OpenAPI client types, refer to the [OpenAPI Generator documentation](https://github.com/OpenAPITools/openapi-generator#overview).

## Examples

1. Initialize a BAML project in the current directory with default settings:
   ```
   baml init
   ```

2. Initialize a BAML project in a specific directory:
   ```
   baml init --dest /path/to/my/project
   ```

3. Initialize a BAML project for Python with Pydantic:
   ```
   baml init --client-type python/pydantic
   ```

4. Initialize a BAML project for OpenAPI with a Go client:
   ```
   baml init --client-type openapi --openapi-client-type go
   ```

## Notes

- If the destination directory already contains a `baml_src` directory, the command will fail to prevent overwriting existing projects.
- The command attempts to infer the OpenAPI generator command based on what's available in your system PATH. It checks for `openapi-generator`, `openapi-generator-cli`, or falls back to using `npx @openapitools/openapi-generator-cli`.
- After initialization, follow the instructions provided in the console output for language-specific setup steps.

The `serve` command starts a BAML-over-HTTP API server that exposes your BAML
functions via HTTP endpoints. This feature allows you to interact with your BAML
functions through a RESTful API interface.

## Usage

```
baml-cli serve [OPTIONS]
```

<Tip>
If you're actively developing, you can use the `dev` command to include
hot-reload functionality:
```
baml-cli dev [OPTIONS]
```

[See more](./dev)
</Tip>

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--from <PATH>` | Path to the `baml_src` directory | `./baml_src` |
| `--port <PORT>` | Port to expose BAML on | `2024` |
| `--no-version-check` | Generate `baml_client` without checking for version mismatch | `false` |

## Description

The `serve` command performs the following actions:

1. Exposes BAML functions as HTTP endpoints on the specified port.
2. Provides authentication middleware for secure access.

## Endpoints


`POST /call/:function_name`: Call a BAML function

```bash curl
curl \
  -X POST \
  "http://localhost:2024/call/MyFunctionName" \
  -H "Content-Type: application/json" \
  -d '{"arg1": "value1", "arg2": "value2"}'
```

`POST /stream/:function_name`: Stream results from a BAML function

```bash curl
curl \
  -X POST \
  "http://localhost:2024/stream/MyFunctionName" \
  -H "Content-Type: application/json" \
  -d '{"arg1": "value1", "arg2": "value2"}'
```

**Debugging**
- `GET /docs`: Interactive API documentation (Swagger UI)
- `GET /openapi.json`: OpenAPI specification for the BAML functions
- `GET /_debug/ping`: Health check endpoint
- `GET /_debug/status`: Server status and authentication check

## Stability

`baml-cli serve` is currently in Tier 2 stability. This means that the CLI and
the HTTP APIs are stable, but there are a number of features which are
not yet available:

   - the [TypeBuilder API](/ref/baml_client/type-builder)
   - the [Collector API](/guide/baml-advanced/collector-track-tokens)
   - the [Modular API](/guide/baml-advanced/modular-api)
   - custom trace annotations for [Boundary Studio](/guide/boundary-cloud/observability/tracking-usage)

## Authentication

We support the header: `x-baml-api-key`

Set the `BAML_PASSWORD` environment variable to enable authentication.

## Examples

1. Start the server with default settings:
   ```
   baml-cli serve --preview
   ```

2. Start the server with a custom source directory and port:
   ```
   baml-cli serve --from /path/to/my/baml_src --port 3000 --preview
   ```

## Testing

To test the server, you can use the following `curl` commands:

1. Check if the server is running:
   ```bash
   curl http://localhost:2024/_debug/ping
   ```

2. Call a function:
   ```bash
   curl -X POST \
      http://localhost:2024/call/MyFunctionName \
      -H "Content-Type: application/json" \
      -d '{"arg1": "value1", "arg2": "value2"}'
   ```

   ```bash API Key
   curl -X POST \
      http://localhost:2024/call/MyFunctionName \
      -H "Content-Type: application/json" \
      -H "x-baml-api-key: ${BAML_PASSWORD}" \
      -d '{"arg1": "value1", "arg2": "value2"}'
   ```

3. Access the API documentation:
   Open `http://localhost:2024/docs` in your web browser.

The `test` command runs BAML function tests defined in your BAML files. It provides comprehensive testing capabilities including filtering, parallel execution, and various output formats.

## Usage

```
baml-cli test [OPTIONS]
```

## Options

| Option                    | Description                                                      | Default       |
| ------------------------- | ---------------------------------------------------------------- | ------------- |
| `--from <PATH>`           | Path to the `baml_src` directory                                 | `./baml_src`  |
| `--list`                  | Only list selected tests without running them                    | `false`       |
| `-i, --include <PATTERN>` | Include specific functions or tests (can be used multiple times) | Run all tests |
| `-x, --exclude <PATTERN>` | Exclude specific functions or tests (can be used multiple times) | None          |
| `--parallel <NUM>`        | Number of tests to run in parallel                               | `10`          |
| `--pass-if-no-tests`      | Pass if no tests are selected                                    | `false`       |
| `--require-human-eval`    | Fail if any tests need human evaluation                          | `true`        |
| `--dotenv`                | Load environment variables from .env file                        | `true`        |
| `--dotenv-path <PATH>`    | Path to custom .env file                                         | None          |

## Description

The `test` command performs the following actions:

1. Discovers and parses all test cases defined in BAML files
2. Applies include/exclude filters to select which tests to run
3. Executes tests in parallel (configurable concurrency)
4. Reports results with detailed output and assertions
5. Supports various output formats and CI integration

## Test Filtering

The `--include` and `--exclude` options support powerful pattern matching:

### Pattern Syntax

- `*` matches any characters within a name
- `FunctionName::TestName` matches a specific test in a specific function
- `FunctionName::` matches all tests in a function
- `::TestName` matches a test name across all functions
- Multiple patterns can be combined

### Examples

```bash
# Run all tests
baml-cli test

# List all available tests
baml-cli test --list

# Run tests for a specific function
baml-cli test -i "ExtractResume::"

# Run a specific test
baml-cli test -i "ExtractResume::TestBasicResume"

# Run all tests matching a pattern
baml-cli test -i "Extract*::"

# Run tests with multiple include patterns
baml-cli test -i "Extract*::" -i "Classify*::"

# Exclude specific tests
baml-cli test -x "ExtractResume::TestComplexResume"

# Combine include and exclude (exclude takes precedence)
baml-cli test -i "Extract*::" -x "*::TestSlow*"
```

## Parallel Execution

Control the number of tests running simultaneously:

```bash
# Run tests with default parallelism (10)
baml-cli test

# Run tests sequentially
baml-cli test --parallel 1

# Run with high parallelism
baml-cli test --parallel 20
```

## Environment Variables

The test command automatically loads environment variables:

```bash
# Use default .env file loading
baml-cli test

# Disable .env file loading
baml-cli test --no-dotenv

# Use custom .env file
baml-cli test --dotenv-path .env.test
```

Environment variables can also be set directly:

```bash
# Set API keys for testing
OPENAI_API_KEY=... ANTHROPIC_API_KEY=... baml-cli test
```

## Exit Codes

The `test` command returns different exit codes based on results:

| Exit Code | Meaning                        |
| --------- | ------------------------------ |
| `0`       | All tests passed               |
| `1`       | Test failures occurred         |
| `2`       | Tests require human evaluation |
| `3`       | Test execution was cancelled   |
| `4`       | No tests were found to run     |

## Examples

### Basic Testing

```bash
# Run all tests in the project
baml-cli test

# Run tests from a specific directory
baml-cli test --from /path/to/my/baml_src
```

### Development Workflow

```bash
# Run tests for a function you're developing
baml-cli test -i "MyNewFunction::"

# Run specific test while debugging
baml-cli test -i "MyFunction::TestEdgeCase"

# List tests to see what's available
baml-cli test --list -i "Extract*::"
```

### CI/CD Integration

```bash
# Fail fast on first assertion failure
baml-cli test --require-human-eval

# Allow tests that need human evaluation to pass
baml-cli test --no-require-human-eval

# Run with controlled parallelism for CI
baml-cli test --parallel 5
```

### Test Discovery

```bash
# See all available tests
baml-cli test --list

# See tests for specific functions
baml-cli test --list -i "ClassifyMessage::"

# See what tests would run with filters
baml-cli test --list -i "Extract*::" -x "*::TestSlow*"
```

## Test Definition

Tests are defined in BAML files using the `test` block syntax:

```baml
function ExtractResume(resume: string) -> Resume {
  client GPT4
  prompt #"Extract resume information: {{resume}}"#
}

test TestBasicResume {
  functions [ExtractResume]
  args {
    resume "John Doe\njohn@example.com\nSoftware Engineer"
  }
  @@assert({{ this.name == "John Doe" }})
  @@assert({{ this.email == "john@example.com" }})
}
```

## Related Commands

- [`baml dev`](./dev) - Development server with hot reload for interactive testing
- [`baml serve`](./serve) - Production server for HTTP API testing
- [`baml generate`](./generate) - Generate client code before running tests

| Type | Value |
| --- | --- |
| `string \| null` | null |



If set, all generated code will use this instead of the packaged generator shipped with the extension.

<Tip>
We recommend this setting! This prevents mismatches between the VSCode Extension and the installed BAML package.
</Tip>

## Usage

If you use unix, you can run `where baml-cli` in your project to figure out what the path is.

```json settings.json
{
  "baml.cliPath": "/path/to/baml-cli"
}
```
| Type | Value |
| --- | --- |
| `boolean \| null` | true |


<Tip>
When running VSCode from a remote machine, you likely need to set this to `false`.
</Tip>

Many LLM providers don't accept requests from the browser. This setting enables a proxy that runs in the background and forwards requests to the LLM provider.

## Usage

```json settings.json
{
  "baml.enablePlaygroundProxy": false
}
```

| Type | Default Value |
| --- | --- |
| `"always" \| "never"` | "always" |


- `always`: Generate code for `baml_client` on every save
- `never`: Do not generate `baml_client` on any save

If you have a generator of type `rest/*`, `"always"` will not do any code generation. You will have to manually run:

```
path/to/baml-cli generate
```

## Usage

```json settings.json
{
  "baml.generateCodeOnSave": "never",
}
```
| Type | Default Value |
| --- | --- |
| `"auto" \| "never" \| "always"` | "auto" |


- `auto`: Sync the extension version to match the generator version when a mismatch is detected. This will make the extension download the correct version of the baml-cli to generate the client code -- preventing issues with mismatched versions.
- `never`: Never sync the extension version to match the generator version
- `always`: Always attempt to sync the extension version to match the generator version.


Note that on Windows platforms, the extension-sync feature is disabled when the `syncExtensionToGeneratorVersion` setting is set to `auto`.

## Usage

```json
{
  "baml.syncExtensionToGeneratorVersion": "auto",
}
```



Each `generator` that you define in your BAML project will tell `baml-cli
generate` to generate code for a specific target language. You can define
multiple `generator` clauses in your BAML project, and `baml-cli generate` will
generate code for each of them.

<Tip>If you created your project using `baml-cli init`, then one has already been generated for you!</Tip>


<CodeBlocks>

```baml Python
generator target {
    output_type "python/pydantic"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // What interface you prefer to use for the generated code (sync/async)
    // Both are generated regardless of the choice, just modifies what is exported
    // at the top level
    default_client_mode "sync"

    // Version of runtime to generate code for (should match installed baml-py version)
    version "0.76.2"
}
```

```baml Python (Pydantic 1.x)
generator target {
    // Generate code will be compatible with Pydantic 1.x
    output_type "python/pydantic/v1"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // What interface you prefer to use for the generated code (sync/async)
    // Both are generated regardless of the choice, just modifies what is exported
    // at the top level
    default_client_mode "sync"

    // Version of runtime to generate code for (should match installed baml-py version)
    version "0.76.2"
}
```

```baml TypeScript
generator target {
    output_type "typescript"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // What interface you prefer to use for the generated code (sync/async)
    // Both are generated regardless of the choice, just modifies what is exported
    // at the top level
    default_client_mode "async"

    // Version of runtime to generate code for (should match the package @boundaryml/baml version)
    version "0.76.2"

    // The format of the generated module.
    // "esm" - Use ES modules
    // "cjs" - Use CommonJS modules (default)
    module_format "cjs"
}
```

```baml React/Next.js
generator target {
    output_type "typescript/react"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // What interface you prefer to use for the generated code (sync/async)
    // Both are generated regardless of the choice, just modifies what is exported
    // at the top level
    default_client_mode "async"

    // Version of runtime to generate code for (should match the package @boundaryml/baml version)
    version "0.76.2"

    // The format of the generated module.
    // "esm" - Use ES modules 
    // "cjs" - Use CommonJS modules (default)
    module_format "cjs"
}
```

```baml Ruby (beta)
generator target {
    output_type "ruby/sorbet"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // Version of runtime to generate code for (should match installed `baml` package version)
    version "0.76.2"
}
```

```baml OpenAPI
generator target {
    output_type "rest/openapi"

    // Where the generated code will be saved (relative to baml_src/)
    output_dir "../"

    // Version of runtime to generate code for (should match installed `baml` package version)
    version "0.76.2"

    // 'baml-cli generate' will run this after generating openapi.yaml, to generate your OpenAPI client
    // This command will be run from within $output_dir
    on_generate "npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g OPENAPI_CLIENT_TYPE -o ."
}
```

</CodeBlocks>

---
title: BAML Reference
---

Welcome to the BAML reference guide!

Here you can learn about every BAML keyword, feature, and setting.

For more in-depth explanations, we recommend reading the [Guides](/guide) first.

<Cards>
  <Card title="BAML Language" icon="fa-solid fa-language" href="/ref/baml">
    Learn everything about BAML's language features.
  </Card>

  <Card title="Prompt (Jinja) Syntax" icon="fa-solid fa-code" href="/ref/prompt-syntax">
    Learn about BAML's Jinja prompt syntax.
  </Card>

  <Card title="BAML CLI" icon="fa-solid fa-terminal" href="/ref/baml-cli">
    BAML CLI commands and flags.
  </Card>

  <Card title="VSCode Settings" icon="fa-solid fa-gears" href="/ref/editor-extension-settings">
    VSCode BAML Extension settings
  </Card>

  <Card title="LLM Clients" icon="fa-solid fa-brain" href="/ref/baml/client-llm">
    LLM clients and how to configure them.
  </Card>

  <Card title="baml_client" icon="fa-solid fa-running" href="/ref/baml_client/type-builder">
    API Reference for the `baml_client` object.
  </Card>

</Cards>

<CodeBlocks>
```bash npm
npx baml-cli init
```

```bash pnpm
pnpm exec baml-cli init
```

```bash yarn
yarn baml-cli init
```

```bash bun
bun baml-cli init
```

```bash deno
deno run --unstable-sloppy-imports -A npm:@boundaryml/baml/baml-cli init
```
</CodeBlocks>

<CodeBlocks>
```bash npm
npx baml-cli generate
```

```bash pnpm
pnpm exec baml-cli generate
```

```bash yarn
yarn baml-cli generate
```

```bash bun
bun baml-cli generate
```

```bash deno
deno run --unstable-sloppy-imports -A npm:@boundaryml/baml/baml-cli generate
```
</CodeBlocks>

```baml title="baml_src/clients.baml"
client<llm> OpenAI {
  provider openai
  options {
    model gpt-4o
    api_key env.OPENAI_API_KEY
  }
}
```

```baml title="baml_src/story.baml" focus={1-16}
class Story {
  title: string
  content: string
}

function WriteMeAStory(prompt: string) -> Story {
  client OpenAI
  prompt #"
    Act as a storyteller.

    { ctx.output_format }

    { _.role('user') }
    Once upon a time {prompt}
  "#
}

test WriteMeAStory {
  functions [WriteMeAStory]
  args {
    prompt "The Universe"
  }

}
```

<ParamField
  path="allowed_role_metadata"
  type="string[]"
>
  Which role metadata should we forward to the API? **Default: `[]`**

  For example you can set this to `["foo", "bar"]` to forward the cache policy to the API.

  If you do not set `allowed_role_metadata`, we will not forward any role metadata to the API even if it is set in the prompt.

  Then in your prompt you can use something like:
  ```baml
  client<llm> Foo {
    provider openai
    options {
      allowed_role_metadata: ["foo", "bar"]
    }
  }

  client<llm> FooWithout {
    provider openai
    options {
    }
  }
  template_string Foo() #"
    {{ _.role('user', foo={"type": "ephemeral"}, bar="1", cat=True) }}
    This will be have foo and bar, but not cat metadata. But only for Foo, not FooWithout.
    {{ _.role('user') }}
    This will have none of the role metadata for Foo or FooWithout.
  "#
  ```

  You can use the playground to see the raw curl request to see what is being sent to the API.
</ParamField>

<ParamField
  path="allowed_role_metadata"
  type="string[]"
>
  Which role metadata should we forward to the API? **Default: `[]`**

  For example you can set this to `["cache_control"]` to forward the cache policy to the API.

  If you do not set `allowed_role_metadata`, we will not forward any role metadata to the API even if it is set in the prompt.

  Then in your prompt you can use something like:
  ```baml
  client<llm> ClaudeWithCaching {
    provider anthropic
    options {
      model claude-3-haiku-20240307
      api_key env.ANTHROPIC_API_KEY
      max_tokens 1000
      allowed_role_metadata ["cache_control"]
      headers {
        "anthropic-beta" "prompt-caching-2024-07-31"
      }
    }
  }

  client<llm> FooWithout {
    provider anthropic
    options {
    }
  }

  template_string Foo() #"
    {{ _.role('user', cache_control={"type": "ephemeral"}) }}
    This will be cached for ClaudeWithCaching, but not for FooWithout!
    {{ _.role('user') }}
    This will not be cached for Foo or FooWithout!
  "#
  ```

  You can use the playground to see the raw curl request to see what is being sent to the API.
</ParamField>

<ParamField path="provider" type="string" required>
This configures which provider to use. The provider is responsible for handling the actual API calls to the LLM service. The provider is a required field.

The configuration modifies the URL request BAML runtime makes.

| Provider Name    | Docs                                                         | Notes                                                      |
| ---------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| `anthropic`      | [Anthropic](/ref/llm-client-providers/anthropic)             | Supports [/v1/messages](https://docs.anthropic.com/en/api/messages) endpoint                       |
| `aws-bedrock`    | [AWS Bedrock](/ref/llm-client-providers/aws-bedrock)         | Supports [Converse](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html) and [ConverseStream](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html) endpoint |
| `google-ai`      | [Google AI](/ref/llm-client-providers/google-ai-gemini)      | Supports Google AI's [generateContent](https://ai.google.dev/api/generate-content) and [streamGenerateContent](https://ai.google.dev/api/generate-content#method:-models.streamgeneratecontent) endpoints |
| `vertex-ai`      | [Vertex AI](/ref/llm-client-providers/google-vertex)         | Supports Vertex's [generateContent](https://cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent) and [streamGenerateContent](https://cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/streamGenerateContent) endpoints |
| `openai`         | [OpenAI](/ref/llm-client-providers/open-ai)                  | Supports [/chat/completions](https://platform.openai.com/docs/api-reference/chat) endpoint                  |
| `azure-openai`   | [Azure OpenAI](/ref/llm-client-providers/open-ai-from-azure) | Supports Azure's [/chat/completions](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#chat-completions) endpoint                  |
| `openai-generic` | [OpenAI (generic)](/ref/llm-client-providers/openai-generic) | Any other provider that supports OpenAI's `/chat/completions` endpoint |


A non-exhaustive list of providers you can use with `openai-generic`:

| Inference Provider | Docs |
| -------------- | -------------- |
| Azure AI Foundary | [Azure AI Foundary](/ref/llm-client-providers/azure-ai-foundary) |
| Groq | [Groq](/ref/llm-client-providers/groq) |
| Hugging Face | [Hugging Face](/ref/llm-client-providers/huggingface) |
| Keywords AI | [Keywords AI](/ref/llm-client-providers/keywordsai) |
| Litellm | [Litellm](/ref/llm-client-providers/litellm) |
| LM Studio | [LM Studio](/ref/llm-client-providers/lmstudio) |
| Ollama | [Ollama](/ref/llm-client-providers/ollama) |
| OpenRouter | [OpenRouter](/ref/llm-client-providers/openrouter) |
| TogetherAI | [TogetherAI](/ref/llm-client-providers/together) |
| Unify AI | [Unify AI](/ref/llm-client-providers/unify) |
| vLLM | [vLLM](/ref/llm-client-providers/vllm) |


We also have some special providers that allow composing clients together:
| Provider Name  | Docs                             | Notes                                                      |
| -------------- | -------------------------------- | ---------------------------------------------------------- |
| `fallback`     | [Fallback](/ref/llm-client-strategies/fallback)             | Used to chain models conditional on failures               |
| `round-robin`  | [Round Robin](/ref/llm-client-strategies/round-robin)       | Used to load balance                                       |

</ParamField>

<ParamField path="options" type="dict[str, Any]" required>
These vary per provider. Please see provider specific documentation for more
information. Generally they are pass through options to the POST request made
to the LLM.
</ParamField>

<ParamField path="client_response_type" type="openai | anthropic | google | vertex" default="openai">
  <Warning>
    Please let [us know on Discord](https://www.boundaryml.com/discord) if you have this use case! This is in alpha and we'd like to make sure we continue to cover your use cases.
  </Warning>

  The type of response to return from the client.

  Sometimes you may expect a different response format than the provider default.
  For example, using Azure you may be proxying to an endpoint that returns a different format than the OpenAI default.

  **Default: `openai`**
</ParamField>

```baml {3, 12-16}
class DynamicClass {
    static_prop string
    @@dynamic
}

function ReturnDynamicClass(input: string) -> DynamicClass {
    // ...
}

test DynamicClassTest {
    functions [ReturnDynamicClass]
    type_builder {
        dynamic class DynamicClass {
            new_prop_here string
        }
    }
    args {
        input "test data"
    }
}
```
<ParamField
  path="finish_reason_allow_list"
  type="string[]"
>
  Which finish reasons are allowed? **Default: `null`**

  <Warning>version 0.73.0 onwards: This is case insensitive.</Warning>

  Will raise a `BamlClientFinishReasonError` if the finish reason is not in the allow list. See [Exceptions](/guide/baml-basics/error-handling#bamlclientfinishreasonerror) for more details.

  Note, only one of `finish_reason_allow_list` or `finish_reason_deny_list` can be set.

  For example you can set this to `["stop"]` to only allow the stop finish reason, all other finish reasons (e.g. `length`) will treated as failures that PREVENT fallbacks and retries (similar to parsing errors).

  Then in your code you can use something like:
  ```baml
  client<llm> MyClient {
    provider "openai"
    options {
      model "gpt-4o-mini"
      api_key env.OPENAI_API_KEY
      // Finish reason allow list will only allow the stop finish reason
      finish_reason_allow_list ["stop"]
    }
  }
  ```
</ParamField>

<ParamField
  path="finish_reason_deny_list"
  type="string[]"
>
  Which finish reasons are denied? **Default: `null`**

  <Warning>version 0.73.0 onwards: This is case insensitive.</Warning>

  Will raise a `BamlClientFinishReasonError` if the finish reason is in the deny list. See [Exceptions](/guide/baml-basics/error-handling#bamlclientfinishreasonerror) for more details.

  Note, only one of `finish_reason_allow_list` or `finish_reason_deny_list` can be set.

  For example you can set this to `["length"]` to stop the function from continuing if the finish reason is `length`. (e.g. LLM was cut off because it was too long).

  Then in your code you can use something like:
  ```baml
  client<llm> MyClient {
    provider "openai"
    options {
      model "gpt-4o-mini"
      api_key env.OPENAI_API_KEY
      // Finish reason deny list will allow all finish reasons except length
      finish_reason_deny_list ["length"]
    }
  }
  ```
</ParamField>

<Tabs>

<Tab title="Go">

```go
import (
    "os"
    baml "my-golang-app/baml_client"
)

func main() {
    cfg := baml.NewConfiguration()
    if boundaryEndpoint := os.Getenv("BOUNDARY_ENDPOINT"); boundaryEndpoint != "" {
        cfg.BasePath = boundaryEndpoint
    }
    if boundaryApiKey := os.Getenv("BOUNDARY_API_KEY"); boundaryApiKey != "" {
        cfg.DefaultHeader["Authorization"] = "Bearer " + boundaryApiKey
    }
    b := baml.NewAPIClient(cfg).DefaultAPI
    // Use `b` to make API calls
}
```

</Tab>

<Tab title="Java">
```java
import com.boundaryml.baml_client.ApiClient;
import com.boundaryml.baml_client.ApiException;
import com.boundaryml.baml_client.Configuration;
import com.boundaryml.baml_client.api.DefaultApi;
import com.boundaryml.baml_client.auth.*;

public class ApiExample {
    public static void main(String[] args) {
        ApiClient apiClient = Configuration.getDefaultApiClient();

        String boundaryEndpoint = System.getenv("BOUNDARY_ENDPOINT");
        if (boundaryEndpoint != null && !boundaryEndpoint.isEmpty()) {
            apiClient.setBasePath(boundaryEndpoint);
        }

        String boundaryApiKey = System.getenv("BOUNDARY_API_KEY");
        if (boundaryApiKey != null && !boundaryApiKey.isEmpty()) {
            apiClient.addDefaultHeader("Authorization", "Bearer " + boundaryApiKey);
        }

        DefaultApi apiInstance = new DefaultApi(apiClient);
        // Use `apiInstance` to make API calls
    }
}
```

</Tab>

<Tab title="PHP">

```php
require_once(__DIR__ . '/vendor/autoload.php');

$config = BamlClient\Configuration::getDefaultConfiguration();

$boundaryEndpoint = getenv('BOUNDARY_ENDPOINT');
$boundaryApiKey = getenv('BOUNDARY_API_KEY');

if ($boundaryEndpoint) {
    $config->setHost($boundaryEndpoint);
}

if ($boundaryApiKey) {
    $config->setAccessToken($boundaryApiKey);
}

$apiInstance = new OpenAPI\Client\Api\DefaultApi(
    new GuzzleHttp\Client(),
    $config
);

// Use `$apiInstance` to make API calls
```

</Tab>

<Tab title="Ruby">
```ruby
require 'baml_client'

api_client = BamlClient::ApiClient.new

boundary_endpoint = ENV['BOUNDARY_ENDPOINT']
if boundary_endpoint
  api_client.host = boundary_endpoint
end

boundary_api_key = ENV['BOUNDARY_API_KEY']
if boundary_api_key
  api_client.default_headers['Authorization'] = "Bearer #{boundary_api_key}"
end
b = BamlClient::DefaultApi.new(api_client)
# Use `b` to make API calls
```
</Tab>

<Tab title="Rust">
```rust
let mut config = baml_client::apis::configuration::Configuration::default();
if let Some(base_path) = std::env::var("BOUNDARY_ENDPOINT").ok() {
    config.base_path = base_path;
}
if let Some(api_key) = std::env::var("BOUNDARY_API_KEY").ok() {
    config.bearer_access_token = Some(api_key);
}
// Use `config` to make API calls
```
</Tab>

</Tabs>

<ParamField
  path="default_role"
  type="string"
>
  The role to use if the role is not in the allowed_roles. **Default: `"user"` usually, but some models like OpenAI's `gpt-4o` will use `"system"`**

  Picked the first role in `allowed_roles` if not "user", otherwise "user".
</ParamField>

<ParamField
  path="allowed_roles"
  type="string[]"
>
  Which roles should we forward to the API? **Default: `["system", "user", "assistant"]` usually, but some models like OpenAI's `o1-mini` will use `["user", "assistant"]`**

  When building prompts, any role not in this list will be set to the `default_role`.
</ParamField>

## Setting Environment Variables

### In the VSCode Playground

Once you open a `.baml` file in VSCode, you should see a small button over every BAML function: `Open Playground`. Then you should be able to set environment variables in the settings tab.

<img src="/assets/vscode/code-lens.png" alt="VSCode Code Lens" />

Or type `BAML Playground` in the VSCode Command Bar (`CMD + Shift + P` or `CTRL + Shift + P`) to open the playground.

### For Your App (Default)

BAML will do its best to load environment variables from your program. Any of the following strategies for setting env vars are compatible with BAML:

- Setting them in your shell before running your program
- In your `Dockerfile`
- In your `next.config.js`
- In your Kubernetes manifest
- From `secrets-store.csi.k8s.io`
- From a secrets provider such as [Infisical](https://infisical.com/) / [Doppler](https://www.doppler.com/)
- From a `.env` file (using `dotenv` CLI)
- Using account credentials for ephemeral token generation (e.g., Vertex AI Auth Tokens)
- `python-dotenv` package in Python or `dotenv` package in Node.js

```bash
export MY_SUPER_SECRET_API_KEY="..."
python my_program_using_baml.py
```

<Tabs>
  <Tab title="python">

    ```python
    from dotenv import load_dotenv
    from baml_client import b

    load_dotenv()
    ```
  </Tab>
  <Tab title="typescript">
    
    ```typescript
    import dotenv from 'dotenv'
    import { b } from './baml_client'

    dotenv.config()
    ```
  </Tab>
  <Tab title="ruby">
    ```ruby
    require 'dotenv/load'
    require 'baml_client'
    ```
  </Tab>
</Tabs>

<ParamField
  path="supports_streaming"
  type="boolean"
>
  Whether the internal LLM client should use the streaming API. **Default: `<auto>`**

  | Model | Supports Streaming |
  | --- | --- |
  | `o1-preview` | false |
  | `o1-mini` | false |
  | `o1-*` | false |
  | `gpt-4o` | true |
  | `gpt-4o-mini` | true |
  | `*` | true |

  Then in your prompt you can use something like:
  ```baml
  client<llm> MyClientWithoutStreaming {
    provider openai
    options {
      model gpt-4o
      api_key env.OPENAI_API_KEY
      supports_streaming false 
    }
  }

  function MyFunction() -> string {
    client MyClientWithoutStreaming
    prompt #"Write a short story"#
  }
  ```

  ```python
  # This will be streamed from your python code perspective, 
  # but under the hood it will call the non-streaming HTTP API
  # and then return a streamable response with a single event
  b.stream.MyFunction()

  # This will work exactly the same as before
  b.MyFunction()
  ```

</ParamField>

<ParamField
  path="supports_streaming"
  type="boolean"
>
  Whether the internal LLM client should use the streaming API. **Default: `true`**

  Then in your prompt you can use something like:
  ```baml
  client<llm> MyClientWithoutStreaming {
    provider anthropic
    options {
      model claude-3-haiku-20240307
      api_key env.ANTHROPIC_API_KEY
      max_tokens 1000
      supports_streaming false
    }
  }

  function MyFunction() -> string {
    client MyClientWithoutStreaming
    prompt #"Write a short story"#
  }
  ```

  ```python
  # This will be streamed from your python code perspective, 
  # but under the hood it will call the non-streaming HTTP API
  # and then return a streamable response with a single event
  b.stream.MyFunction()

  # This will work exactly the same as before
  b.MyFunction()
  ```

</ParamField>

rules
You are the world's best documentation writer, renowned for your clarity, precision, and engaging style. Every piece of documentation you produce is:

1. Clear and precise - no ambiguity, jargon, marketing language or unnecssarily complex language.
2. Concise—short, direct sentences and paragraphs.
3. Scientifically structured—organized like a research paper or technical white paper, with a logical flow and strict attention to detail.
4. Visually engaging—using line breaks, headings, and components to enhance readability.
5. Focused on user success — no marketing language or fluff; just the necessary information.

# Writing guidelines

- Titles must always start with an uppercase letter, followed by lowercase letters unless it is a name. Examples: Getting started, Text to speech, Conversational AI...
- No emojis or icons unless absolutely necessary.
- Scientific research tone—professional, factual, and straightforward.
- Avoid long text blocks. Use short paragraphs and line breaks.
- Do not use marketing/promotional language.
- Be concise, direct, and avoid wordiness.
- Tailor the tone and style depending on the location of the content.
  - The `docs` tab (/fern/docs folder) contains a mixture of technical and non-technical content.
    - The /fern/docs/pages/capabilities folder should not contain any code and should be easy to read for both non-technical and technical readers.
    - The /fern/docs/pages/workflows folder is tailored to non-technical readers (specifically enterprise customers) who need detailed step-by-step visual guides.
    - The /fern/docs/pages/developer-guides is strictly for technical readers. This contains detailed guides on how to use the SDK or API.
    - The best-practices folder contains both tech & non-technical content.
  - The `conversational-ai` tab (/fern/conversational-ai) contains content for the conversational-ai product. It is tailored to technical people but may be read by non-technical people.
  - The `api-reference` tab (/fern/api-reference) contains content for the API. It is tailored to technical people only.
- If the user asks you to update the changelog, you must create a new changelog file in the /fern/docs/pages/changelog folder with the following file name: `2024-10-13.md` (the date should be the current date).

  - The structure of the changelog should look something like this:

- Ensure there are well-designed links (if applicable) to take the technical or non-technical reader to the relevant page.

# Page structure

- Every `.mdx` file starts with:
  ```
  ---
  title: <insert title here, keep it short>
  subtitle: <insert subtitle here, keep it concise and short>
  ---
  ```
  - Example titles (good, short, first word capitalized):
    - Getting started
    - Text to speech
    - Streaming
    - API reference
    - Conversational AI
  - Example subtitles (concise, some starting with "Learn how to …" for guides):
    - Build your first conversational AI voice agent in 5 minutes.
    - Learn how to control delivery, pronunciation & emotion of text to speech.
- All documentation images are located in the non-nested /fern/assets/images folder. The path can be referenced in `.mdx` files as /assets/images/<file-name>.jpg/png/svg.

## Components

Use the following components whenever possible to enhance readability and structure.

### Accordions

````
<AccordionGroup>
  <Accordion title="Option 1">
    You can put other components inside Accordions.
    ```ts
    export function generateRandomNumber() {
      return Math.random();
    }
    ```
  </Accordion>
  <Accordion title="Option 2">
    This is a second option.
  </Accordion>

  <Accordion title="Option 3">
    This is a third option.
  </Accordion>
</AccordionGroup>
````

### Callouts (Tips, Notes, Warnings, etc.)

```
<Tip title="Example Callout" icon="leaf">
This Callout uses a title and a custom icon.
</Tip>
<Note>This adds a note in the content</Note>
<Warning>This raises a warning to watch out for</Warning>
<Error>This indicates a potential error</Error>
<Info>This draws attention to important information</Info>
<Tip>This suggests a helpful tip</Tip>
<Check>This brings us a checked status</Check>
```

### Cards & Card Groups

```
<Card
    title='Python'
    icon='brands python'
    href='https://github.com/fern-api/fern/tree/main/generators/python'
>
View Fern's Python SDK generator.
</Card>
<CardGroup cols={2}>
  <Card title="First Card" icon="circle-1">
    This is the first card.
  </Card>
  <Card title="Second Card" icon="circle-2">
    This is the second card.
  </Card>
  <Card title="Third Card" icon="circle-3">
    This is the third card.
  </Card>
  <Card title="Fourth Card" icon="circle-4">
    This is the fourth and final card.
  </Card>
</CardGroup>
```

### Code snippets

- Always use the focus attribute to highlight the code you want to highlight.
- `maxLines` is optional if it's long.
- `wordWrap` is optional if the full text should wrap and be visible.

```javascript focus={2-4} maxLines=10 wordWrap
console.log('Line 1');
console.log('Line 2');
console.log('Line 3');
console.log('Line 4');
console.log('Line 5');
```

### Code blocks

- Use code blocks for groups of code, especially if there are multiple languages or if it's a code example. Always start with Python as the default.

````
<CodeBlocks>
```javascript title="helloWorld.js"
console.log("Hello World");
````

```python title="hello_world.py"
print('Hello World!')
```

```java title="HelloWorld.java"
    class HelloWorld {
        public static void main(String[] args) {
            System.out.println("Hello, World!");
        }
    }
```

</CodeBlocks>
```

### Steps (for step-by-step guides)

```
<Steps>
  ### First Step
    Initial instructions.

  ### Second Step
    More instructions.

  ### Third Step
    Final Instructions
</Steps>

```

### Frames

- You must wrap every single image in a frame.
- Every frame must have `background="subtle"`
- Use captions only if the image is not self-explanatory.
- Use ![alt-title](image-url) as opposed to HTML `<img>` tags unless styling.

```
  <Frame
    caption="Beautiful mountains"
    background="subtle"
  >
      <img src="https://images.pexels.com/photos/1867601.jpeg" alt="Sample photo of mountains" />
  </Frame>

```

### Tabs (split up content into different sections)

```
<Tabs>
  <Tab title="First Tab">
    ☝️ Welcome to the content that you can only see inside the first Tab.
  </Tab>
  <Tab title="Second Tab">
    ✌️ Here's content that's only inside the second Tab.
  </Tab>
  <Tab title="Third Tab">
    💪 Here's content that's only inside the third Tab.
  </Tab>
</Tabs>

```

# Examples of a well-structured piece of documentation

- Ideally there would be links to either go to the workflows for non-technical users or the developer-guides for technical users.
- The page should be split into sections with a clear structure.

```
---
title: Text to speech
subtitle: Learn how to turn text into lifelike spoken audio with ElevenLabs.
---

## Overview

ElevenLabs [Text to Speech (TTS)](/docs/api-reference/text-to-speech) API turns text into lifelike audio with nuanced intonation, pacing and emotional awareness. [Our models](/docs/models) adapt to textual cues across 32 languages and multiple voice styles and can be used to:

- Narrate global media campaigns & ads
- Produce audiobooks in multiple languages with complex emotional delivery
- Stream real-time audio from text

Listen to a sample:

<elevenlabs-audio-player
    audio-title="George"
    audio-src="https://storage.googleapis.com/eleven-public-cdn/audio/marketing/george.mp3"
/>

Explore our [Voice Library](https://elevenlabs.io/community) to find the perfect voice for your project.

## Parameters

The `text-to-speech` endpoint converts text into natural-sounding speech using three core parameters:

- `model_id`: Determines the quality, speed, and language support
- `voice_id`: Specifies which voice to use (explore our [Voice Library](https://elevenlabs.io/community))
- `text`: The input text to be converted to speech
- `output_format`: Determines the audio format, quality, sampling rate & bitrate

### Voice quality

For real-time applications, Flash v2.5 provides ultra-low 75ms latency optimized for streaming, while Multilingual v2 delivers the highest quality audio with more nuanced expression.

Learn more about our [models](/docs/models).

### Voice options

ElevenLabs offers thousands of voices across 32 languages through multiple creation methods:

- [Voice Library](/docs/voice-library) with 3,000+ community-shared voices
- [Professional Voice Cloning](/docs/voice-cloning/professional) for highest-fidelity replicas
- [Instant Voice Cloning](/docs/voice-cloning/instant) for quick voice replication
- [Voice Design](/docs/voice-design) to generate custom voices from text descriptions

Learn more about our [voice creation options](/docs/voices).

## Supported formats

The default response format is "mp3", but other formats like "PCM", & "μ-law" are available.

- **MP3**
  - Sample rates: 22.05kHz - 44.1kHz
  - Bitrates: 32kbps - 192kbps
  - **Note**: Higher quality options require Creator tier or higher
- **PCM (S16LE)**
  - Sample rates: 16kHz - 44.1kHz
  - **Note**: Higher quality options require Pro tier or higher
- **μ-law**
  - 8kHz sample rate
  - Optimized for telephony applications

<Success>
  Higher quality audio options are only available on paid tiers - see our [pricing
  page](https://elevenlabs.io/pricing) for details.
</Success>

## Supported languages

<Markdown src="/snippets/v2-model-languages.mdx" />

<Markdown src="/snippets/v2-5-model-languages.mdx" />

Simply input text in any of our supported languages and select a matching voice from our [Voice Library](https://elevenlabs.io/community). For the most natural results, choose a voice with an accent that matches your target language and region.

## FAQ

<AccordionGroup>
  <Accordion title="Can I fine-tune the emotional range of the generated audio?">
    The models interpret emotional context directly from the text input. For example, adding
    descriptive text like "she said excitedly" or using exclamation marks will influence the speech
    emotion. Voice settings like Stability and Similarity help control the consistency, while the
    underlying emotion comes from textual cues.
  </Accordion>
  <Accordion title="Can I clone my own voice or a specific speaker's voice?">
    Yes. Instant Voice Cloning quickly mimics another speaker from short clips. For high-fidelity
    clones, check out our Professional Voice Clone.
  </Accordion>
  <Accordion title="Do I own the audio output?">
    Yes. You retain ownership of any audio you generate. However, commercial usage rights are only
    available with paid plans. With a paid subscription, you may use generated audio for commercial
    purposes and monetize the outputs if you own the IP rights to the input content.
  </Accordion>
  <Accordion title="How do I reduce latency for real-time cases?">
    Use the low-latency Flash models (Flash v2 or v2.5) optimized for near real-time conversational
    or interactive scenarios. See our [latency optimization guide](/docs/latency-optimization) for
    more details.
  </Accordion>
  <Accordion title="Why is my output sometimes inconsistent?">
    The models are nondeterministic. For consistency, use the optional seed parameter, though subtle
    differences may still occur.
  </Accordion>
  <Accordion title="What's the best practice for large text conversions?">
    Split long text into segments and use streaming for real-time playback and efficient processing.
    To maintain natural prosody flow between chunks, use `previous_text` or `previous_request_ids`.
  </Accordion>
</AccordionGroup>
```

