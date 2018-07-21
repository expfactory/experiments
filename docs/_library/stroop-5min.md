---
layout: experiment
name:  "stroop-5min"
maintainer: "@bluewizard"
github: "https://www.github.com/expfactory-experiments/stroop-5min"
preview: "https://expfactory-experiments.github.io/stroop-5min"
tags:
- jspsych
- experiment
- 5min
---

# The 5-Minute Stroop

This is a derivative of the default Experiment Factory Stroop task, which was designed to provide a reliable and (statistically) powerful way to capture the Stroop phenomenon in a short amount of time. This task was designed with the following considerations in mind:

- The task should generate the Stroop phenomenon (slower response times for incongruent vs. congruent stimuli) with a medium-to-large effect size
- The task should be user-friendly, accessible, and provide a user experience that is not unpleasant
- The task should take approximately 5 minutes to complete

To this end, the following changes were made to the default Experiment Factory Stroop task:

## Changes for Statistical Power / Effect
- The ratio of congruent:incongruent trials was increased from 1:1 to 2:1, since proportion congruency has been shown in some past research to increase the size of the Stroop effect

## Changes for Accessibility and User-Friendliness
- Colors were selected to maximize accessibility for individuals with color-blindness (Accessibility of colors was confirmed using a color-blindness simulator, Color Oracle [http://colororacle.org])
- The background color was changed from white to black, to minimize eye strain and maximize contrast
- A figure was added to the instructions to illustrate a suggested finger placement on the keyboard

## Changes for Brevity
- In this version, when a response is entered the trial ends and feedback is displayed right away (Previously, trials had a fixed duration)
- The number of practice trials was reduced from 24 to 18
- The number of test trials was reduced from 96 to 72

The original stroop was a legacy experiment that has been ported into its Experiment Factory Reproducible Container version. If you'd like to make the experiment, it's documentation, or use better, please contribute at the respective repositories.
