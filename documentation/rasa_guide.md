# Guide to developing the bot with Rasa

## Installation

Run the commands 

`pip3 install -U pip`

`pip3 install rasa`

to install Rasa on your computer. For a more detailed guide, check [the official Rasa docs](https://rasa.com/docs/rasa/installation).

## Training the model

A Rasa bot model needs to be trained and saved into a folder designated for models in order to use the bot. A model needs a domain file or a designated folder containing domain files, a config.yml -file, and training data, which can be in any number of files as long as all of them are in the same folder.

The current implementation has one domain file for both bots and separate data folders for each bot, where the training data is divided into separate files for NLU, rules, and stories. The folder data_nice contains the training data for the co-operative bot, and data_troll contains the data for the trolling bot.

The models for the co-operative bot are saved into the folder models_nice and the models for the trolling bot are saved into models_troll.

To train both bots with this folder structure, run the following commands while in the backend/rasa/ folder:

Nicebot: `rasa train --data data_nice --out models_nice`

Trollbot: `rasa train --data data_troll --out models_troll`

The data-argument directs the model to derive the training data from the given folder. The out-argument directs the model to save the trained file into the given folder.

More information on possible arguments for this command found in [Rasa docs: command line interface](https://rasa.com/docs/rasa/command-line-interface#rasa-train)

## Modifying the training data

**Note: all rasa files used in model training (not only training data files!) require a `version`-key. Do not remove it.**

The training data consists of NLU, rules, and stories. In the current implementation, the NLU-files in both training data sets are identical, but the rules and stories are different. This is because NLU defines user intents (how the model undertands user messages), and this does not need to be different between the two bots. The rules and stories define how the bot reacts to the users, which is different between the bots.

(TODO: HOW TO DEFINE NLU, RULES, STORIES)

When defining a new intent, remember to add it to the list of intents in the domain file.

For more information on training data, see [Rasa docs: Training Data Format](https://rasa.com/docs/rasa/training-data-format#conversation-training-data)

## Domain

The domain file is shared between the bots. The domain file contains
- declarations of user intents (and the entities in them)
- declarations of entities
- declarations of slots
- declarations of actions
- bot responses

(If deemed necessary, the domain files could be separate for each bot, or the domain could be split into separate files (treated as if a single file) in the same directory. In this case, bot training requires a domain-argument to specify a directory or filename other than "domain.yml".)

When new intents, slots or custom actions are added, they need to be listed in the domain file. During bot training Rasa will give a warning and stop training if it finds something that is called but not declared in the domain.

#### Intents

List used intents' names under "intents". If an intent contains an entity, specify them. Example:

```
- suggest_artist:
    use_entities:
      - artist
```

#### Entities

List names of entities found in intents under "entities".

#### Slots

Declare and define slots under "slots". Include at least the slot's type, and most of the time also values for auto_fill and influence_conversation. Setting auto_fill as false prevents Rasa from determining when to fill the slot value by itself, and makes sure that the slot value is changed only intentionally in a custom action. Setting influence_conversation as true lets Rasa determine the appropriate story based on the slot's value, if it is marked as relevant in the story. An initial value for the slot may be set with initial_value.

#### Actions

List names of custom actions under "actions". These actions, along with Rasa's default actions, can be called in stories or rules. 

#### Responses

Responses are actions that only consist of the bot saying something defined in the response. Responses may contain slot values. When called, a response is selected randomly from the given text options. Responses for both bots are in the same file, and similar responses that cannot be the same are differentiated with "_nice"- and "_troll"-suffixes.

More on domain in [Rasa docs: Domain](https://rasa.com/docs/rasa/domain)

## Actions

Rasa has some default actions that do not need custom defining. The most important one of these is `action_listen`, which is used whenever the bot needs to do nothing but wait for the next message, and Rasa calls this action whenever there are no further actions called in a story. More on default actions in [Rasa docs: Default Actions](https://rasa.com/docs/rasa/default-actions)

Rasa custom actions run python code and are used in most runtime interactions to set slots independently of the users or retrieve information from the backend. (TODO)

## Pipeline configuration and policies

The config.yml file contains specifications on how to train the bot in a more technical level. If no pipeline and policy specification is provided in the file, a default pipeline is used. Many of the components in the pipeline are swappable or removable, but impact performance.

If any part is changed, the bots need to be trained again for the changes to apply.

The pipeline deals with language understanding. During development, we never removed WhitespaceTokenizer, RegexFeaturizer, LexicalSyntacticFeaturizer, or either CountVectorsFeaturizer, as they appear to be crucial for our purposes.

LanguageModelFeaturizer for Google's BERT was implemented, as it has excellent natural language understanding. This can be changed if necessary; more on [Rasa docs: Pipeline components; LanguageModelFeaturizer](https://rasa.com/docs/rasa/components#languagemodelfeaturizer)

For intents and entities, DIETClassifier is used. RegexEntityExtractor is used for recognizing entities that are defined in lookup tables in the NLU. Because RegexEntityExtractor is after DIETClassifier in the pipeline, entities recognized by DIETClassifier are overwritten in their respective slots by RegexEntityExtractor. In custom actions, the artist-entity is often taken from the information regarding the last message's extracted entities in order to use the DIETClassifier's entity, which is allows more artist entities to be recognized than RegexEntityExtractor. RegexEntityExtractor only recognizes artist names listed in the lookup table, while DIETClassifier analyzes the tokens more flexibly. Our plan was to **abandon lookup tables and RegexEntityExtractor entirely**, but DIETClassifier still had some troubles recognizing artist names from intents, apparently assuming parts of the names were part of the intent itself instead of the entity.

DIETClassifier can be further tuned by changing the values, most importantly for epochs. A higher number of epochs may improve precision and performance, but always increases training time. More details on adjustable values in [Rasa docs: DIETClassifier](https://rasa.com/docs/rasa/components#dietclassifier)

FallbackClassifier is necessary for recognizing fallbacks; specifically, nlu_fallback. When the message's intent is ambiguous (highest confidence for any intent is lower than the threshold), or many intents are almost as probable (difference between confidence for highest-scoring intents is less than ambiguity_threshold), the message's intent will be recognized as nlu_fallback. This intent will then be treated as if any intent would (the rules-files contain rules for dealing with them).

Policies impact how the bot reacts to recognized intents. Policies determine how the bot is trained to learn from rules and stories. 

RulePolicy has the highest priority in determining the next action from a certain intent. Whenever a situation matches a known rule in the bot's training data, the following action will be chosen explicitly from that rule. RulePolicy can be adjusted to change fallback behaviour and more, see [Rasa docs: RulePolicy](https://rasa.com/docs/rasa/policies#rule-policy)

MemoizationPolicy and TEDPolicy are used to follow stories. MemoizationPolicy follows stories more strictly while TEDPolicy is more flexible (but occasionally assumes the next action in unpredicted ways). Using these two together has seemed to work well, as either alone is slightly too unreliable. For TEDPolicy, epochs work quite similarly as for DIETClassifier; more epochs may improve performance, but always increase training time. See docs for more details on adjustments: [Rasa docs: Machine learning policies](https://rasa.com/docs/rasa/policies#machine-learning-policies)

See the official docs for more information on tuning the model: [Rasa docs: Pipeline components](https://rasa.com/docs/rasa/components)

## Other

Check the [the official Rasa docs](https://rasa.com/docs/rasa/) for more information.