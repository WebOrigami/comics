This is the source for an Origami intro screencast in the form of an animated comic with voiceover. The entire experience is generated from the screenplay in [screenplay.yaml](screenplay.yaml).

The screenplay specifies:

- The caption/narration for a given panel.
- The "actor" that's speaking in that panel.
- The "scene" for the panel: a terminal window, an editor with a terminal pane, etc.
- The options for the panel: the Origami command that should be run, the file that should be shown, etc.

From the above, the comic build process generates everything you can see and hear.

This includes running the demonstrated Origami commands and folding their output into the built HTML to be shown in the simulated terminal. This ensures that the comic always shows actual output from the latest Origami version.

## Why generate a comic?

A comic strikes a middle ground between static documentation and a video. Documentation is great for reference material, but for learning new topics many people expect video introductions.

The problem with video is that it takes a _ton_ of production work. That not only limits the amount of video that can be created, but it also serves to make updating videos impractical. Because the Origami language and project is evolving, video tutorials quickly become out of date and have to be taken down to avoid confusing people.

Some inspirations:

- Math YouTuber Grant Sanderson [generates his math animations programmatically](https://www.3blue1brown.com/lessons/manim-demo), leading to the idea of generating a screencast programmatically.
- Researcher Bret Victor places [thumbnails next to his videos](https://dynamicland.org/2024/Intro/). You can read the thumbnails like a comic, which led to the idea of making the whole thing feel more like an animated comic.

The goal of this project is to generate everything from the aforementioned screenplay.

It wouldn't be too hard to extend this project to generate a full video with audio, but given the opportunity, a comic seems like a more fun and appropriate medium for introductory content. A comic is also more easily skimmable and navigable.

Bonus: The result is a web experience that can hosted anywhere, instead of a video that must be hosted on a site owned by, say, an exploitative surveilling monopolist.

## User interface

- All visible content is generated at build time using Origami itself.
- The Origami output is obtained by invoking the Origami interpreter and inlining its results into the HTML.
- Voice narration is generated on-demand to save money and energy. If the screenplay is edited, only the affected voice clips need to be regenerated.
- If JavaScript is disabled, the page displays as a static, scrollable comic using only HTML and CSS.
- Custom elements handle behavior only. Styles are nested beneath custom element names so that they only apply to the relevant portions of the light DOM.
- Shadow DOM is used to create repetitive elements that are only relevant with JavaScript.
- Comic panels are responsive to adapt to the current screen/window size.
- Sound effects. To round out the simulated UI, the comic uses Web Audio API to play typing sounds.
- If the user has disabled autoplay for audio, they can still opt into playing sound.

## Narration

This project uses Origami to generate the audio narration from the screenplay.

A small Origami script invokes the OpenAI text-to-speech API to obtain an MP3 file with the generated narration. This is then saved in a `.mp3` file with a name like `000-hi-there.mp3` that includes both a numerical index and the beginning of that entry's text so that it can be easily identified.

Switching between two synthetic voices seems to reduce listening fatigue. The screenplay which of two "actors" will be used for a given piece of narration.

The final voice files are saved in the [narration](narration) folder.
