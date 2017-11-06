# Expfactory Library

[![CircleCI](https://circleci.com/gh/expfactory/experiments.svg?style=svg)](https://circleci.com/gh/expfactory/experiments)


This is the library of official experiments provided by the Experiment Factory. You can browse the [experiment table](https://expfactory.github.io/experiments/) or obtain the resource [programmatically](https://expfactory.github.io/experiments/library.json). 

## How to Contribute
Adding experiments to the core expfactory family is a process centered around pull requests (PRs). Before contributing an experiment, the following questions are important to consider:

 - is this experiment generally useful to the larger community? For example, a new task would be useful, but a slightly modified stroop would be better served from your own repository.
 - Once you experiment is added to the library, you as the author are responsible for keeping it up to date and responding to issues, of course with help from our team. Updates will follow the same process.

### Experiments
If you browse the [library](docs/_library) folder, you'll find simple markdown files that point to experiment repositories. These repositories are tested, and after passing, are added to the [library manifest](https://expfactory.github.io/experiments/library.json) and thus available programmatically.

### Automatically Generated Container Recipe
The application [recipes](docs/_recipes) folder is set up to build recipes that contain all experiments with a particular tag (meaning the markdown file in the `_library`) folder has some term under `tags` in the header. If you have a particular set of experiments with a common tag that you want a recipe automatically generated for, add a new file here. 

### Custom Container Recipe
If you've generated your own custom recipe and want to contribute, we recommend you and want to share, please add your recipe here.

For both of these contributions, we are still writing the documentation. Contributing an experiment comes down to a single markdown file in this repository. In the meantime, see our [documentation](https://expfactory.github.io/expfactory) in progress. Thanks for stopping by!
