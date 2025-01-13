This screencast takes the form of a comic that is completely generated from the screenplay in [screenplay.yaml](screenplay.yaml).

The screenplay specifies:

- The caption/narration for a given panel.
- The "actor" that's speaking in that panel.
- The "scene" for the panel: a terminal window, an editor with a terminal pane, etc.
- The options for the panel: the Origami command that should be run, the file that should be shown, etc.

From the above, the comic build process generates everything you can see and hear.

This includes running the demonstrated Origami commands and folding their output into the built HTML to be shown in the simulated terminal. This ensures that the comic always shows actual output from the latest Origami version.

## Why generate a comic?

A comic strikes a middle ground between static documentation and a video. Documentation is great for reference material, but many people seem to prefer video introductions to unfamiliar topics.

The problem with video is that it takes a _ton_ of work to produce. That not only limits the amount of video that can be created, but it also serves to make updating videos impractical. Because the Origami language and project is evolving, video tutorials quickly become out of date and have to be taken down to avoid confusing people.

The goal of this project is to generate everything from the aforementioned screenplay. A comic seems like an appropriate medium for such content. While this project includes most of the foundation necessary to completely generate a video, a comic is more easily skimmable and navigable.

## User interface

- All visible content is generated at build time.
- If JavaScript is disabled, the page displays as a static, scrollable comic using only HTML and CSS.
- Custom elements handle behavior only. Styles are nested beneath custom element names so that they only apply to the relevant portions of the light DOM.
- Shadow DOM is used to create repetitive elements that are only relevant with JavaScript.
- Comic panels are responsive to adapt to the current screen/window size.
- Generated voice narration (see below).
- Sound effects. To round out the simulated UI, the comic uses Web Audio API to play typing sounds.

## Narration

This project uses Origami to generate the audio narration from the screenplay.

A small Origami script [narrate.ori](src/narrate/narrate.ori) invokes the OpenAI text-to-speech API to obtain an MP3 file with the generated narration. This is then saved in a `.mp3` file with a name like `000-hi-there.mp3` that includes both a numerical index and the beginning of that entry's text so that it can be easily identified.

The final voice files are saved in the [narration](narration) folder.
