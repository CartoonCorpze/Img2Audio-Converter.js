# Img2Audio-Converter
Simple NodeJS program I wrote to convert between images and audio.
The idea behind this is to be able to edit or create audio through photoshop software.

I've always wanted to see how audio would look like in image format
and be able to edit or "draw" it.

I hope to create a algorithm that can convert images <-> audio in such a way that
the process can be reversed in order to get the source image/audio back
out of it.

=====================================================================
Run `install_packages.bat` in command prompt to auto-install all required node packages.

Convert image to audio: `node img2aud def [image.png]`

Convert audio to image: `node aud2img def [audio.wav] [resX] [resY]`


Note:

-Converting audio to images works but not as intended.

-I want to add more algorithms later.

-All images/audio must be in the same folder as the program's files.

-The `.blend` file is for quickly generating/rendering images with Blender to test the conversion,
but any image (PNG or JPEG) should work.

-Be warned that large images (4K and such) will generate big `.wav`s (About 2 minutes long and 40MB-ish of disk space).
