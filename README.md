This screencast takes the form of a comic that is completely generated from the screenplay in [screenplay.yaml](screenplay.yaml).

## User interface

- If JavaScript is disabled, the page displays as a static, scrollable comic using only HTML and CSS.
- Light DOM components: components handle behavior only; all contents are generated at build time. Styles are nested beneath custom element names so that they only apply to the relevant portions of the light DOM.
- Responsive comic panels.
- Generated voice narration (see below).
- Sound effects. To round out the simulated UI, the comic uses Web Audio API to play typing sounds.
- At build time, Origami generates the actual output that will be shown in the simulated terminal.

## Narration

This project uses Origami to generate the audio narration from the screenplay.

A small Origami script [narrate.ori](src/narrate/narrate.ori) invokes the OpenAI text-to-speech API to obtain an MP3 file with the generated narration. This is then saved in a `.mp3` file with a name like `000-hi-there.mp3` that includes both a numerical index and the beginning of that entry's text so that it can be easily identified.

The final voice files are saved in the [narration](narration) folder.
