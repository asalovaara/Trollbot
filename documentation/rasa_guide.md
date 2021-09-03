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

## Training Data

**Note: all rasa files used in model training (not only training data files!) require a `version`-key. Do not remove it.**

The training data consists of NLU, rules, and stories. In the current implementation, the NLU-files in both training data sets are identical, but the rules and stories are different. This is because NLU defines user intents (how the model undertands user messages), and this does not need to be different between the two bots. The rules and stories define how the bot reacts to the users, which is different between the bots.

#### NLU

The NLU files (named nlu.yml) in both bots' training data are kept identical, so that the bots understand user messages in the same way. NLU includes defining user intents and lookup tables for entities (when extracted with RegexEntityExtractor). When creating new intents, provide as many and as varied examples as possible. This will reduce the chances of mixup between intents that are similar. When the intent includes entities, mark it according to the examples, and keep in mind that Rasa may sometimes understand the entity value as affecting what intent the message is recognized as. Individual cases can be prevented by adding them to the entity examples within message examples, such as by adding "ABBA" to intent examples with negative connotations to prevent Rasa from always understanding messages containing "ABBA" as inherently positive. Lookup tables contain all the possible values for given entities for RegexEntityExtractor, and other values will not be recognized by it. If RegexEntityExtractor is removed from use (see possible reasons in *Pipeline configuration and policies* below), lookup tables are no longer needed, but varied examples of entities need to be added into the intent examples. When defining a new intent, remember to add it to the list of intents in the domain file. External intents (intents with prefix EXTERNAL, that are sent by Rasa itself instead of the users) are not defined in this file.

#### Rules

The rules files (named rules.yml) specify rules: actions to always take when certain conditions apply. Rules should be short and separate from story flow. Rules can be used to define fallback behaviour. Rules also include how to deal with external intents: for example, EXTERNAL_positive_evaluation_timer is an intent sent by Rasa itself to signal when to call the action action_trigger_positive_evaluation, as defined in the rule. Rules need a condition (a slot_was_set check), even when a slot's value is not relevant to the story; otherwise the rules may not be applied consistently.

#### Stories

As the conversation is divided into phases: introduction phase, task phase and decision phase. The conversation is assumed to automatically start in introduction phase, so it is not checked, but stories do check if task phase or decision phase is on. The slot_was_set key in stories lists all slots that need to have given values in order for the story to progress, so Rasa will know which story to choose if all possibilities are accounted for. A story may have any number of actions, and when the story does not specify any more actions, the action action_listen is performed, but it is also listed in some stories to clarify that the bot does not do anything.

Some stories are currently removed from use (but in comments), as they contain currently problematic features. All active_user checks are in comments, as the active user is currently set every time a user message is sent.

Checkpoints are used in decision phase stories to ensure that the conversation flow is clear to the bot. For more information on checkpoints and more, see [Rasa docs: Stories](https://rasa.com/docs/rasa/stories)


For more information on all training data, see [Rasa docs: Training Data Format](https://rasa.com/docs/rasa/training-data-format#conversation-training-data)

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

In some cases, Rasa might extract an entity from an intent that should not have one or not recognise entities from intents that do have them. In these cases, the problem is likely in the lookup tables or other entity examples in the training data.

#### Entities

List names of entities found in intents under "entities".

#### Slots

Declare and define slots under "slots". Include at least the slot's type, and most of the time also values for auto_fill and influence_conversation. Setting auto_fill as false prevents Rasa from determining when to fill the slot value by itself, and makes sure that the slot value is changed only intentionally in a custom action. Setting influence_conversation as true lets Rasa determine the appropriate story based on the slot's value, if it is marked as relevant in the story. An initial value for the slot may be set with initial_value.

#### Actions

List names of custom actions under "actions". These actions, along with Rasa's default actions, can be called in stories or rules. 

#### Responses

Responses are actions that only consist of the bot saying something defined in the response. Responses may contain slot values. When called, a response is selected randomly from the given text options. Responses for both bots are in the same file, and similar responses that cannot be the same are differentiated with "_nice"- and "_troll"-suffixes.

More on domain in [Rasa docs: Domain](https://rasa.com/docs/rasa/domain)

## Actions and special slots

Rasa has some default actions that do not need custom defining. The most important one of these is `action_listen`, which is used whenever the bot needs to do nothing but wait for the next message, and Rasa calls this action whenever there are no further actions called in a story. More on default actions in [Rasa docs: Default Actions](https://rasa.com/docs/rasa/default-actions)

Rasa custom actions run python code and are used in most runtime interactions to set slots independently of the users or retrieve information from the backend.

Many custom actions are used to set slots that are not entities from user messages, such as task_activated or genre. Action action_set_task_slot returns a Rasa action SlotSet, where parameters given are the slot and the value it should have. In stories, this action is called when introduction phase is over and task phase begins, and the slot's value is checked when determining the stories the bot should follow; stories that have task_activated as True. The slot decision_phase is treated similarly.

Action action_set_genre_slot is also an action that sets slot values, but in this case the value is retrieved from the backend. Additionally, this action also creates the artist objects and adds them to the bot's list. The action first tries to retrieve genre information for the artist entity extracted by DIETClassifier (see backend/controllers/botRouter.js for how the genre is fetched). Then it checks if the artist already exists in the bot's list. If not, the artist object is created by fetching the artist from the database (also sent via botRouter) and parsing its information into an object in Rasa. Fields in the fetched artist object can be checked or changed in backend/models/artist.js. If no errors occur, the action returns three SlotSet actions. 

Reminders in Rasa are actions that schedule a certain intent to be signaled after a certain time. In action action_delayed_positive_evaluation, a reminder is scheduled to signal the EXTERNAL_positive_evaluation_timer intent after five seconds, but the reminder is cancelled if any user sends a message within those five seconds (kill_on_user_message=True). In practice, this is used with the idea that NiceBot only says something nice about the user's suggested artist if the other user does not comment on it immediately.

The opinion slot is set according to what sentiment the user's message has, and is meant to help checking the sentiment of the latest artist discussion. This slot is set as good during stories where the user praises an artist, and as bad when the user says something negative about an artist.

Some actions can be used to make the bot respond with certain responses depending on the action's result; for example, action action_deflect_opinion_question is used by TrollBot to determine how it should respond to a question of its likes. If no opinions have been expressed by the users yet, it will send the response utter_idk, and if opinions have been expressed, insult the previous opinion. This action does not have to return a Rasa action, as responses are delivered by `dispatcher.utter_message()` instead.

The actions action_post_decision and action_end_conversation are placeholders for future actions, that most likely would have to connect to the backend. 

Some actions are not in use (such as validate_introduction_form and action_increment_counter), but were meant to ensure that all users have said their introductions no matter how many users the conversation has. If the amount of users is changed later and the story structure changes so that the task phase is not entered before everyone has introduced themselves, these could prove useful.

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