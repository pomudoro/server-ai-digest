---
name: cover
description: Generate cover image for a digest article via Replicate
disable-model-invocation: false
argument-hint: [article description]
---

Generate a cover image for the article described below.

Article description: $ARGUMENTS

Steps:
1. Based on the article description, compose a prompt for image generation.
   Style: modern, minimalist, tech-oriented illustration. No text on the image.
2. Use the Replicate MCP server to create a prediction with model
   `black-forest-labs/flux-schnell`.
   Input parameters:
   - prompt: your composed prompt in English
   - num_outputs: 1
   - aspect_ratio: "16:9"
3. Download the generated image and save it to the article's directory
   as cover.webp or cover.png.
4. Report the file path of the saved image.