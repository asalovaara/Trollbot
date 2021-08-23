# Guide to developing the bot with Rasa

## Installation

Run the commands `pip3 install -U pip
pip3 install rasa`
to install Rasa on your computer. For a more detailed guide, check [the official Rasa docs](https://rasa.com/docs/rasa/installation).

## Training the model

A Rasa bot model needs to be trained and saved into a folder designated for models in order to use the bot. A model needs a domain file or a designated folder containing domain files, a config.yml -file, and training data, which can be in any number of files as long as all of them are in the same folder.

The current implementation has one domain file for both bots and separate data folders for each bot, where the training data is divided into separate files for NLU, rules, and stories. The folder data_nice contains the training data for the co-operative bot, and data_troll contains the data for the trolling bot.

The models for the co-operative bot are saved into the folder models_nice and the models for the trolling bot are saved into models_troll.

To train both bots with this folder structure, run the following commands while in the backend/rasa/ folder:

Nicebot: `rasa train --data data_nice --out models_nice`

Trollbot: `rasa train --data data_troll --out models_troll`

The --data -argument directs the model to derive the training data from the given folder. The --out -argument directs the model to save the trained file into the given folder.

More information on possible arguments for this command found in [Rasa docs: command line interface](https://rasa.com/docs/rasa/command-line-interface#rasa-train)

## Modifying the training data

**Note: all rasa files used in model training (not only training data files!) require a `version`-key. Do not remove it.**

The training data consists of NLU, rules, and stories. In the current implementation, the NLU-files in both training data sets are identical, but the rules and stories are different. This is because NLU defines user intents (how the model undertands user messages), and this does not need to be different between the two bots. The rules and stories define how the bot reacts to the users, which is different between the bots.

(TODO: HOW TO DEFINE NLU, RULES, STORIES)

When defining a new intent, remember to add it to the list of intents in the domain file.

For more information on training data, see [Rasa docs: Training Data Format](https://rasa.com/docs/rasa/training-data-format#conversation-training-data)

## Domain

(TODO)

The domain contains responses, which are actions that only consist of the bot saying something defined in the response. (TODO)

## Using rasa actions

Rasa has some default actions that do not need custom defining. The most important one of these is `action_listen`, which is used whenever the bot needs to do nothing but wait for the next message. More on default actions in [Rasa docs: Default Actions](https://rasa.com/docs/rasa/default-actions)

Rasa custom actions run python code and are used in most runtime interactions to set slots independently of the users or retrieve information from the backend. (TODO)

## Other

Check the [the official Rasa docs](https://rasa.com/docs/rasa/) for more information.