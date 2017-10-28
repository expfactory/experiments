# Expfactory Library

This is the library of official experiments provided by the Experiment Factory. Adding experiments to the core expfactory family is a process centered around pull requests (PRs), one of them being to this repository. Before contributing an experiment, the following questions are important to consider:

 - is this experiment generally useful to the larger community? For example, a new task would be useful, but a slightly modified stroop would be better served from your own repository.
 - Once you experiment is added to the library, you as the author are responsible for keeping it up to date and responding to issues, of course with help from our team. Updates will follow the same process.

# The general steps
You will want to first make an experiment repository, with the minimum requirements being a `config.json` file (more on this in a bit) and a primary `index.html` to start the experiment. The experiment should have all dependencies (css, js, images, etc.) within the repo. You can assume that the experiment will be served from the repository base.

Then, fork this repository, and in the [experiments](experiments) folder, create a file named equivalently to the main identifier (`exp_id`) of your experiment. An example is shown below. The following file should then be submit via a pull request.

### Experiment Metadata File
If my experiment is called `tower-of-london`, then my `exp_id` (the identifier) is `tower-of-london` and I probably have a Github repository called `tower-of-london`. I would add a file called `experiments/tower-of-london.json` that has the following content:


```
{

   "name": "tower-of-london",
   "maintainer": "@vsoch",
   "github":     "https://github.com/expfactory-experiments/tower-of-london.git"

}
```

 - `maintainer`: is a contact for when an issue arises with the expeiment. In the example we use a Github username, and you could also use an email.
 - `name`: is the same identifier for the experiment.
 - `github`: Is the most important metadata - the location of the experiment


That's it! I am finishing up functions to validate the experiments (using containers and CI) so that When you submit the Pull Request, your experiment metadata will be evaluated, and approved merged will make it available in the [library](https://expfactory.github.io/library/index.json). More information will be added about using the library as it is developed.
